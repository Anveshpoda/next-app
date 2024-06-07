// pages/api/run-script.js
import { spawn } from 'child_process';
import path from 'path';

let lastExecutionTime = 0; // Store the last execution time in milliseconds

export default function handler(req, res) {
  const now = Date.now();
  const fiveMinutes = 5 * 60 * 1000;

  // Check if the script was run in the last 5 minutes
  if (now - lastExecutionTime < fiveMinutes) {
    return res.status(429).json({ error: 'Script was run less than 5 minutes ago' });
  }

  const scriptPath = path.resolve('/home/anveshpoda/el_beta.sh');

  // Set headers for streaming response
  res.setHeader('Content-Type', 'text/plain; charset=utf-8');
  res.setHeader('Transfer-Encoding', 'chunked');

  // Start the script process
  const scriptProcess = spawn('bash', [scriptPath]);

  // Stream stdout
  scriptProcess.stdout.on('data', (data) => {
    res.write(data);
    res.flushHeaders(); // Force flushing of headers
  });

  // Stream stderr
  scriptProcess.stderr.on('data', (data) => {
    res.write(data);
    res.flushHeaders(); // Force flushing of headers
  });

  // Handle process exit
  scriptProcess.on('close', (code) => {
    if (code === 0) {
      // Update the last execution time
      lastExecutionTime = now;
      res.write('\nScript ran successfully');
    } else {
      res.write(`\nScript exited with code ${code}`);
    }
    res.end(); // Ensure the response is properly closed
  });

  // Handle errors
  scriptProcess.on('error', (error) => {
    console.error(`Error executing script: ${error}`);
    res.status(500).end(`\nFailed to run script: ${error.message}`);
  });

  // Prevent Node.js from closing the connection early
  res.on('close', () => {
    scriptProcess.kill();
  });
}
