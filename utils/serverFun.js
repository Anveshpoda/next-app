import { spawn } from 'child_process';
import path from 'path';
import compression from 'compression';

export const runScript = (req, res, end, script, ...args) => {
    return new Promise((resolve, reject) => {
        const compressionMiddleware = compression();

        compressionMiddleware(req, res, () => {
            const scriptPath = path.resolve(script);
            console.log(`Running script: ${scriptPath} with args: ${args.join(' ')}`);

            const scriptProcess = spawn('bash', [scriptPath, ...args]);

            scriptProcess.stdout.on('data', (data) => {
                res.write(data);
                if (res.flush) res.flush();
            });

            scriptProcess.stderr.on('data', (data) => {
                res.write(data);
                if (res.flush) res.flush();
            });

            scriptProcess.on('close', (code) => {
                if (code === 0) {
                    console.log('Script ran successfully');
                    res.write('\nScript ran successfully');
                    resolve();
                } else {
                    console.error(`Script exited with code ${code}`);
                    res.write(`\nScript exited with code ${code}`);
                    reject(new Error(`Script exited with code ${code}`));
                }
                if (end) res.end();
            });

            scriptProcess.on('error', (error) => {
                console.error(`Error executing script: ${error.message}`);
                res.status(500).end(`Failed to run script: ${error.message}`);
                reject(error);
            });

            res.on('close', () => scriptProcess.kill());
        });
    });
};