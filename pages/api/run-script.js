import { spawn } from 'child_process';
import path from 'path';

let lastExecutionTime = 0;

export default function handler(req, res) {
  const now = Date.now();
  const fiveMinutes = 5 * 60 * 1000;

  if (now - lastExecutionTime < fiveMinutes) {
    return res.status(429).json({ error: 'Script was run less than 5 minutes ago' });
  }

  const scriptPath = path.resolve('/home/anveshpoda/el_beta.sh');

  const scriptProcess = spawn('bash', [scriptPath]);

  scriptProcess.stdout.on('data', (data) => {
    res.write(data);
  });

  scriptProcess.stderr.on('data', (data) => {
    res.write(data);
  });


  scriptProcess.on('close', (code) => {
    if (code === 0) {

      lastExecutionTime = now;
      res.end('\nScript ran successfully');
    } else {
      res.status(500).end(`\nScript exited with code ${code}`);
    }
  });


  scriptProcess.on('error', (error) => {
    console.error(`Error executing script: ${error}`);
    res.status(500).end(`\nFailed to run script: ${error.message}`);
  });

  // Set headers for streaming response
  res.setHeader('Content-Type', 'text/plain');
  res.setHeader('Transfer-Encoding', 'chunked');
}
