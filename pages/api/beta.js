import { exec } from 'child_process';

let lastExecutionTime = 0; // Store the last execution time in milliseconds

export default function handler(req, res) {
  const now = Date.now();
  const fiveMinutes = 2 * 60 * 1000;

  if (now - lastExecutionTime < fiveMinutes) {
    return res.status(429).json({ error: 'Script was run less than 2 minutes ago' });
  }

  exec('node /home/anveshpoda/el_beta.sh', (error, stdout, stderr) => {
    if (error) {
      console.error(`Error executing script: ${error}`);
      return res.status(500).json({ error: 'Failed to run script' });
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
