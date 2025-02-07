import { spawn } from 'child_process';
import path from 'path';
import compression from 'compression';

export const runScript = async (req, res, script, ...arg) => {
    const compressionMiddleware = compression();

    compressionMiddleware(req, res, () => {
        const scriptPath = path.resolve(script);
        // Pass extra arguments using the spread operator
        const scriptProcess = spawn('bash', [scriptPath, ...arg]);

        scriptProcess.stdout.on('data', (data) => {
            res.write(data);
            if (res.flush) res.flush();
        });

        scriptProcess.stderr.on('data', (data) => {
            res.write(data);
            if (res.flush) res.flush();
        });

        scriptProcess.on('close', (code) => {
            if (code === 0) res.write('\nScript ran successfully');
            else res.write(`\nScript exited with code ${code}`);
            // Optionally call res.end() here or later depending on your use-case.
            // res.end()
        });

        scriptProcess.on('error', (error) => {
            console.error(`Error executing script: ${error}`);
            res.status(500).end(`Failed to run script: ${error.message}`);
        });

        res.on('close', () => scriptProcess.kill());
    });
}
