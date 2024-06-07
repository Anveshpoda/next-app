// pages/api/run-script.js
import { exec } from 'child_process';
import path from 'path';

let lastExecutionTime = 0; // Store the last execution time in milliseconds

export default function handler(req, res) {
  const now = Date.now();
  const fiveMinutes = 5 * 60 * 1000;

  if (now - lastExecutionTime < fiveMinutes) {
    return res.status(429).json({ error: 'Script was run less than 5 minutes ago' });
  }

  const scriptPath = path.resolve('/home/anveshpoda/el_beta.sh');

  exec(`bash ${scriptPath}`, (error, stdout, stderr) => {
    if (error) {
      console.error(`Error executing script: ${error}`);
      return res.status(500).json({ error: 'Failed to run script', details: error.message });
    }
    if (stderr) {
      console.error(`Script stderr: ${stderr}`);
      return res.status(500).json({ error: 'Script error', stderr });
    }

    lastExecutionTime = now;

    console.log(`Script output: ${stdout}`);
    return res.status(200).json({ message: 'Script ran successfully', output: stdout });
  });
}
