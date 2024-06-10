// pages/api/run-script.js
import { exec } from 'child_process';
import path from 'path';

let lastExecutionTime = 0; // Store the last execution time in milliseconds

export default async function handler(req, res) {
  const now = Date.now();
  const fiveMinutes = 5 * 60 * 1000;

  // Check if the script was run in the last 5 minutes
  if (now - lastExecutionTime < fiveMinutes) {
    return res.status(429).json({ error: 'Script was run less than 5 minutes ago' });
  }

  const scriptPath = path.resolve('/home/anveshpoda/el_beta.sh');

  // Create a promise for the exec call with increased maxBuffer
  const runScript = (scriptPath) => {
    return new Promise((resolve, reject) => {
      exec(`bash ${scriptPath}`, { maxBuffer: 1024 * 1024 * 10 }, (error, stdout, stderr) => { // 10MB buffer size
        if (error) {
          reject({ error: 'Failed to run script', details: error.message });
        } else if (stderr) {
          reject({ error: 'Script error', stderr });
        } else {
          resolve(stdout);
        }
      });
    });
  };

  try {
    const output = await runScript(scriptPath);

    // Update the last execution time
    lastExecutionTime = now;

    return res.status(200).json({ message: 'Script ran successfully', output });
  } catch (error) {
    console.error(`Error executing script: ${error.details || error.stderr || error}`);
    return res.status(500).json({ error: error.error || 'Failed to run script', details: error.details || error.stderr });
  }
}
