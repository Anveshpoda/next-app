export const runCmd = async (cmd, cwd, ser) => {
    try {
        let url = ser ? process.env.API_DOMAIN_SERVER + 'run-cmd' : '/api/run-cmd'
        const response = await fetch(url, {
            method: 'POST', headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ cmd: encodeURIComponent(cmd), cwd: encodeURIComponent(cwd) })
        })
        let res = await response.json()
        return res
    } catch (err) {
        console.log('err >> ', err);
        return 'Err'
    }
}