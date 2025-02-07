import { slackLog } from "@/utils/fun";
import { runScript } from "@/utils/serverFun";
import { exec } from 'child_process';
const scriptPath = 'El_new_dev_update.sh';

export default async function handler(req, res) {
    const { query = {}, body = {} } = req;
    // slackLog(JSON.stringify({ Msg: 'Webhook received successfully!', body, query }));

    let data = { ...query, ...body };
    console.log('data >> ', data);
    if (!query.force && req.method !== 'POST') return res.status(405).json({ message: 'Only POST requests are allowed' });

    if (query.force && query.branch) { data.ref = data.ref ?? ('refs/heads/' + query.branch); data.event_name = data.event_name ?? 'push'; }

    try {
        await handlePushToBranch(req, res, data);
        // return res.status(200).json({ message: 'Webhook handled successfully' });
    } catch (error) {
        console.error('Error handling webhook:', error);
        // Send only error.message to ensure it is a string
        return res.status(500).json({ message: 'Error processing the webhook', error: error.message });
    }
}

async function handlePushToBranch(req, res, data) {
    const branch = String(data.ref).replace('refs/heads/', '');

    if (data.event_name !== 'push') {
        console.log('Not a push event, ignoring.');
        return "Not a push event, ignoring.";
    }

    console.log(`Push detected for branch: ${branch}`);

    const TARGET_DIR = "/home/anveshpoda/sandbox/EL";
    const PM2_APP_NAME = "EL";

    if (branch === 'dev') {
        const DESIRED_BRANCH = 'dev';
        // await runScript(req, res, true, scriptPath, TARGET_DIR, DESIRED_BRANCH, PM2_APP_NAME);
    } else if (branch === 'sandbox') {
        const DESIRED_BRANCH = 'sandbox';
        await runScript(req, res, true, scriptPath, TARGET_DIR, DESIRED_BRANCH, PM2_APP_NAME);
        console.log('Script execution finished');
    } else {
        console.log(`Push to non-dev branch: ${branch}, ignoring.`);
    }
}
