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

const selectUsr = (usr) => {
    switch (usr) {
        case 'anvesh': return "T02PB994V/B06NB93NJTB/uaGpWdGX6lJjzxvJEYb9MzWx"
        default: return "T02PB994V/B076SQJDD60/FCpS05ujUbyGju0tRspm0aMx"
    }
}

export const slackLog = async (debug, user) => {
    let data = { 'text': debug }
    let usr = selectUsr(user)
    try {
        if (debug) {
            // let tgApi = 'https://api.telegram.org/bot6143440023:AAHNwkKZiuRqiArlX1nsoE-01RPRo2sKzt4/sendMessage?chat_id=@JustdialDev&text=' + encodeURIComponent(debug);
            let tgApi = await fetch('https://hooks.slack.com/services/' + usr, {
                method: 'post',
                body: JSON.stringify(data),
            })
            // let docResString = await tgApi.json()
            return tgApi
        } else return "Some Technical Error"
    } catch (e) { console.log('Error  >> ', e); }
}

export const createMr = async (repo, source, target, title, desc) => {
    if (!repo || !source || !target || !title) return ({ code: 0, err: "Invalid Data To Create MR" })
    let dt = {
        "id": "root%2F" + repo,
        "source_branch": source,
        "target_branch": target,
        "title": title,
        "description": desc
    }

    try {
        let gitApi = await fetch(`http://192.168.12.250:900/api/v4/projects/root%2F${repo}/merge_requests`, {
            method: 'post',
            headers: {
                'Content-Type': 'application/json',
                'Private-Token': 'glpat-3HTzB_U5qXvHthA5ACqr'
            },
            body: JSON.stringify(dt),
        })
        let res = await gitApi.json()
        return ({ code: 1, msg: "Success", data: res })
    } catch (e) { console.log('Error  >> ', e); }
}