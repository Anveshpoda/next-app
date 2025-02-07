import { slackLog } from "@/utils/fun";
import { exec } from 'child_process';
const scriptPath = 'El_new_dev_update.sh';

export default async function handler(req, res) {
    const { query = {}, body = {} } = req
    // slackLog(JSON.stringify({ Msg: 'Webhook received successfully!', body, query }));

    let data = {...query, ...body}
    console.log('data >> ', data)
    if (!query.force && req.method !== 'POST') return res.status(405).json({ message: 'Only POST requests are allowed' });

    if (query.force && query.branch) { data.ref = data.ref ?? ('refs/heads/' + query.branch); data.event_name = data.event_name ?? 'push' }
    try {
        await handlePushToBranch(data);
        return res.status(200).json({ message: 'Webhook handled successfully' });
    } catch (error) {
        console.error('Error handling webhook:', error);
        // slackLog(JSON.stringify({ Msg: 'Error processing the webhook', error: error}));
        return res.status(500).json({ message: 'Error processing the webhook', error: error });
    }
    // res.status(200).json({ state: 'success', message: 'Webhook received successfully!' });
}


async function handlePushToBranch(data) {
    const branch = data.ref.replace('refs/heads/', '');

    if (data.event_name !== 'push') { console.log('Not a push event, ignoring.'); return "Not a push event, ignoring." }

    console.log(`Push detected for branch: ${branch}`);

    const TARGET_DIR = "/home/anveshpoda/sandbox/EL";
    const PM2_APP_NAME = "EL";

    if (branch === 'dev') {
        const DESIRED_BRANCH = 'dev';
        await runShellScript(TARGET_DIR, DESIRED_BRANCH, PM2_APP_NAME);
    } if (branch === 'sandbox') {
        const DESIRED_BRANCH = 'sandbox';
        await runShellScript(TARGET_DIR, DESIRED_BRANCH, PM2_APP_NAME);
    } else {
        console.log(`Push to non-dev branch: ${branch}, ignoring.`);
    }

}

// This function calls another API with data from the webhook payload
async function callAnotherAPI(data) {
    const apiUrl = 'http://127.0.0.1:4321/api/';

    const requestBody = {
        commitMessage: data.commits[0].message,
        commitId: data.after,
        author: data.commits[0].author.name,
        repository: data.project.name,
    };

    try {
        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(requestBody),
        });

        return response;
    } catch (error) {
        console.error('Error calling another API:', error);
        throw new Error('Error calling API');
    }
}


async function runShellScript(targetDir, desiredBranch, pm2AppName) {

    return new Promise((resolve, reject) => {
        exec(`bash ${scriptPath} ${targetDir} ${desiredBranch} ${pm2AppName}`, (error, stdout, stderr) => {
            if (error) {
                console.error(`Error executing script: ${error.message}`);
                slackLog(JSON.stringify({ Msg: `Error executing script: ${error.message}` }));
                reject(new Error(`Error executing script: ${error.message}`));
            }
            if (stderr) {
                console.error(`stderr: ${stderr}`);
                slackLog(JSON.stringify({ Msg: `stderr: ${stderr}` }));
                reject(new Error(`stderr: ${stderr}`));
            }
            console.log(`stdout: ${stdout}`);
            resolve(stdout);
        });
    });
}