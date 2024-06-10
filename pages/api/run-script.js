// pages/api/run-script.js
import { spawn } from 'child_process';
import path from 'path';
import compression from 'compression';
import { NextApiRequest, NextApiResponse } from 'next';

let lastExecutionTime = 0; // Store the last execution time in milliseconds/
let disabled = false;

// Middleware to handle compression and flush
const compressionMiddleware = compression();

export default function handler(req, res) {

    if (disabled) return res.status(200).end(`\nScript was already running`);
    disabled = true;
    compressionMiddleware(req, res, () => {
        const now = Date.now();
        const fiveMinutes = 5 * 60 * 1000;

        if (now - lastExecutionTime < fiveMinutes) {
            disabled = false;
            return res.status(429).json({ error: 'Script was run less than 5 minutes ago' });
        }

        const scriptPath = path.resolve('/home/anveshpoda/el_beta.sh');

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
            if (code === 0) {
                lastExecutionTime = now;
                res.write('\nScript ran successfully');
            } else {
                res.write(`\nScript exited with code ${code}`);
            }
            disabled = false;
            res.end();
        });

        scriptProcess.on('error', (error) => {
            disabled = false;
            console.error(`Error executing script: ${error}`);
            res.status(500).end(`\nFailed to run script: ${error.message}`);
        });

        // Prevent Node.js from closing the connection early
        res.on('close', () => {
            scriptProcess.kill();
        });
    });
}
