// pages/api/run-script.js
import { exec } from 'child_process';

export default async function handler(req, res) {
    const { cmd, cwd } = req.body
    console.log('Command >>>>>>> ', decodeURIComponent(cmd), decodeURIComponent(cwd))
    try {
        const { stdout, stderr } = await exec(decodeURIComponent(cmd), {
            cwd: decodeURIComponent(cwd)
        });

        let out = await new Promise((resolve, reject) => {
            let data = '';
            stdout.on('data', chunk => { data += chunk; });
            stdout.on('end', () => { resolve(data.trim()); });
            stdout.on('error', err => { reject(err); });
        });

        let err = await new Promise((resolve, reject) => {
            let data = '';
            stderr.on('data', chunk => { data += chunk; });
            stderr.on('end', () => { resolve(data.trim()); });
            stderr.on('error', err => { reject(err); });
        });

        res.status(200).json({ err: err, data: out, fd: out?.split('\n') });
    } catch (error) {
        console.error('Error fetching Git branch:', error);
        res.status(429).json({ err: error });
    }
}
