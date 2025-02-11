import { spawn } from "child_process";
import path from "path";
import fs from "fs";
import compression from "compression";

export const runScript = (req, res, end, script, ...args) => {
    return new Promise((resolve, reject) => {
        const compressionMiddleware = compression();

        compressionMiddleware(req, res, () => {
            const { host, user, pass } = req.query;
            let child;

            if (host) {
                const target = user ? `${user}@${host}` : host;
                const remoteCmd = ["bash", "-s", ...args];
                if (pass) child = spawn("sshpass", ["-p", pass, "ssh", target, ...remoteCmd]);
                else child = spawn("ssh", [target, ...remoteCmd]);

                console.log(`Executing remote script from local file: ${script} on ${target} with args: ${args.join(" ")}`);

                // Pipe the local script file's content into the remote bash via stdin.
                const localScriptPath = path.resolve(script);
                const scriptStream = fs.createReadStream(localScriptPath);
                scriptStream.pipe(child.stdin);
            } else {
                const localScript = path.resolve(script);
                child = spawn("bash", [localScript, ...args]);
                console.log(`Executing local script: ${localScript} with args: ${args.join(" ")}`);
            }

            child.stdout.on("data", (data) => {
                res.write(data);
                if (res.flush) res.flush();
            });

            child.stderr.on("data", (data) => {
                res.write(data);
                if (res.flush) res.flush();
            });

            child.on("close", (code) => {
                if (code === 0) {
                    console.log("Script ran successfully");
                    res.write("\nScript ran successfully");
                    resolve();
                } else {
                    console.error(`Script exited with code ${code}`);
                    res.write(`\nScript exited with code ${code}`);
                    reject(new Error(`Script exited with code ${code}`));
                }
                if (end) res.end();
            });

            child.on("error", (error) => {
                console.error(`Error executing script: ${error.message}`);
                res.status(500).end(`Failed to run script: ${error.message}`);
                reject(error);
            });

            res.on("close", () => child.kill());
        });
    });
};
