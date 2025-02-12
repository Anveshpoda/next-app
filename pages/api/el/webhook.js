import { runScript } from "@/utils/serverFun";

export default async function handler(req, res) {
    const { query = {}, body = {} } = req;
    let data = { ...query, ...body };
    console.log("Webhook data >>", data);
    if (!query.force && req.method !== "POST") return res.status(405).json({ message: "Only POST requests are allowed" });


    if (query.force && query.branch) {
        data.ref = data.ref || `refs/heads/${query.branch}`;
        data.event_name = data.event_name || "push";
    }

    try {
        await handlePushToBranch(req, res, data);
    } catch (error) {
        console.error("Error handling webhook:", error);
        return res.status(500).json({ message: "Error processing the webhook", error: error.message });
    }
}

async function handlePushToBranch(req, res, data) {
    const { dir, pm2name } = req.query;
    const branch = String(data.ref).replace("refs/heads/", "");
    if (data.event_name !== "push") {
        console.log("Not a push event, ignoring.");
        return "Not a push event, ignoring.";
    }
    console.log(`Push detected for branch: ${branch}`);

    // Deployment parameters (customize as needed)
    const TARGET_DIR = dir // || "/home/anveshpoda/sandbox/EL";
    const PM2_APP_NAME = pm2name || "EL";

    const script = "El_new_dev_update.sh";

    await runScript(req, res, true, script, TARGET_DIR, branch, PM2_APP_NAME);
    console.log("Script execution finished");

    // if (branch === "sandbox") {
    //     await runScript(req, res, true, script, TARGET_DIR, branch, PM2_APP_NAME);
    //     console.log("Script execution finished");
    // } else {
    //     console.log(`Push to branch ${branch} ignored.`);
    //     return res.status(200).json({ message: `Push to branch ${branch} ignored.` });
    // }
}
