import { spawn } from 'child_process';
import path from 'path';
import fs from 'fs';
import moment from 'moment';
import compression from 'compression';
import { createMr, slackLog } from '@/utils/fun';

const LOG_DIR = 'logs/'; // Directory to store logs
let lastExecutionTime = 0; // Store the last execution time in milliseconds
let disabled = false;

// Middleware to handle compression and flush
const compressionMiddleware = compression();

export default function handler(req, res) {
    const { type, force, uDir, pm2Name, user, pass, host } = req.query
    if (disabled) return res.status(200).end('\nScript is already running');
    disabled = true;

    compressionMiddleware(req, res, () => {
        const now = Date.now();
        const timeLimit = 2 * 60 * 1000;

        if (type != 'dev' && type != 'custom_pull' && force != 1 && (now - lastExecutionTime < timeLimit)) {
            const waitTime = Math.ceil((timeLimit - (now - lastExecutionTime)) / 1000 / 60); // Calculate wait time in minutes
            const lastRun = new Date(lastExecutionTime).toLocaleString();
            disabled = false;
            return res.status(429).json({
                error: `Script was run less than 2 minutes ago. Last run time was: ${lastRun}. Please wait at least ${waitTime} more minute(s).`
            });
        }

        const args = [
            ...(uDir ? ['-r', uDir] : []),
            ...(pm2Name ? ['-p', pm2Name] : []),
            ...(host ? ['-H', host] : []),
            ...(user ? ['-u', user] : []),
            ...(pass ? ['-w', pass] : [])
        ];

        // const timestamp = new Date().toISOString().replace(/[:.]/g, '-'); // Generate timestamp for file naming
        // const logFileName = `${LOG_DIR}${type}/log-${timestamp}.txt`;
        // const logFileName = `log_${new Date().toLocaleString('en-GB', { hour: '2-digit', minute: '2-digit', day: '2-digit', month: '2-digit', year: 'numeric' }).replace(/[/,]/g, '-').replace(' ', '__').replace(':', '-')}.txt`;
        const logFileName = `${LOG_DIR}${type}/log_${moment().format('HH-mm__DD-MM-YYYY')}.txt`;
        console.log('logFileName >> ', logFileName)

        const scriptPath = path.resolve(type == 'custom_pull' ? 'update_sandbox.sh' : type == 'dev' ? 'el_dev.sh' : type == 'hotfix' ? 'el_hotfix.sh' : '/home/anveshpoda/el_beta.sh');

        // res.setHeader('Content-Type', 'text/plain; charset=utf-8');
        // res.setHeader('Transfer-Encoding', 'chunked');

        const scriptProcess = spawn('bash', [scriptPath, ...args]);

        let logData = '';

        scriptProcess.stdout.on('data', (data) => {
            res.write(data);
            logData += data;
            if (res.flush) {
                res.flush();
            }
        });

        scriptProcess.stderr.on('data', (data) => {
            res.write(data);
            logData += data;
            if (res.flush) {
                res.flush();
            }
        });

        scriptProcess.on('close', (code) => {
            disabled = false;
            lastExecutionTime = now;

            // Save the output to a new log file
            fs.writeFileSync(logFileName, logData + `\nScript exited with code ${code}`);

            if (code === 0) {
                res.write('\nScript ran successfully');
                res.end();
            } else {
                res.write(`\nScript exited with code ${code}`);
                res.end();
            }
        });

        scriptProcess.on('error', (error) => {
            disabled = false;
            console.error(`Error executing script: ${error}`);
            res.status(500).end(`Failed to run script: ${error.message}`);
        });

        res.on('close', () => {
            scriptProcess.kill();
        });
    });
}