// pages/api/run-script.js
import { spawn } from 'child_process';
import path from 'path';
import compression from 'compression';
import { createMr, slackLog } from '@/utils/fun';

let lastExecutionTime = 0; // Store the last execution time in milliseconds
let disabled = false;

// Middleware to handle compression and flush
const compressionMiddleware = compression();

export default function handler(req, res) {
    const { type, force } = req.query
    if (disabled) return res.status(200).end('\nScript is already running');
    disabled = true;

    compressionMiddleware(req, res, () => {
        const now = Date.now();
        const timeLimit = 2 * 60 * 1000;

        if (type != 'dev' && force != 1 && (now - lastExecutionTime < timeLimit)) {
            const waitTime = Math.ceil((timeLimit - (now - lastExecutionTime)) / 1000 / 60); // Calculate wait time in minutes
            const lastRun = new Date(lastExecutionTime).toLocaleString();
            disabled = false;
            return res.status(429).json({
                error: `Script was run less than 2 minutes ago. Last run time was: ${lastRun}. Please wait at least ${waitTime} more minute(s).`
            });
        }

        const scriptPath = path.resolve(type == 'dev' ? 'el_dev.sh' : type == 'hotfix' ? 'el_hotfix.sh' : '/home/anveshpoda/el_beta.sh');

        res.setHeader('Content-Type', 'text/plain; charset=utf-8');
        res.setHeader('Transfer-Encoding', 'chunked');

        const scriptProcess = spawn('bash', [scriptPath]);

        scriptProcess.stdout.on('data', (data) => {
            res.write(data);
            if (res.flush) {
                res.flush();
            }
        });

        scriptProcess.stderr.on('data', (data) => {
            res.write(data);
            if (res.flush) {
                res.flush();
            }
        });

        scriptProcess.on('close', (code) => {
            disabled = false;
            lastExecutionTime = now;

            if (code === 0) {
                res.write('\nScript ran successfully');
                if(type == 'hotfix') takeLive(res)
                else res.end();
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

const takeLive = async (res) => {
    let dt = await createMr("next_monorepo","hotFix","dev","Test")
    if(dt.code == 0 || dt.data.message) return res.status(500).json(dt)
  
    slackLog(dt.data.web_url)
    slackLog(dt.data.web_url, "anvesh")

    res.write(`\n${dt.data.web_url}`);
    res.write(`\n${dt}`);
    res.end();
}