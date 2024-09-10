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

export const createMr = async (repo, source, target, title, desc, path) => {
    if (!repo || !source || !target || !title) return ({ code: 0, err: "Invalid Data To Create MR" })

    let Jid = await getJiraId(title, source, path || '/home/anveshpoda/sandbox/El_staging')
    if (!Jid) return ({ code: 0, msg: "Error", err: "Jira Id Not Found" })

    let dt = {
        "id": "root%2F" + repo,
        "source_branch": source,
        "target_branch": target,
        "title": Jid,
        "description": desc.replace(/\n/g, '<br>'),
        "reviewer_ids": [424],
        "assignee_id": 424
    }

    console.log('createMr dt >> ', dt, Jid)

    try {
        // let gitApi = await fetch(`http://192.168.12.250:900/api/v4/projects/root%2F${repo}/merge_requests`, {
        //     method: 'post',
        //     headers: {
        //         'Content-Type': 'application/json',
        //         'Private-Token': 'glpat-3HTzB_U5qXvHthA5ACqr'
        //     },
        //     body: JSON.stringify(dt),
        // })
        // let res = await gitApi.json()
        // if (!gitApi.ok) return ({ code: 0, msg: "Error creating merge request ", data: res })
        return ({ code: 1, msg: "Success", data: res || '' })
    } catch (e) { console.log('Error  >> ', e); return ({ code: 0, msg: "Error", err: e }) }
}

const isValidJiraId = (id) => /^JIRA-[A-Za-z0-9]{1,8}-\d{1,10}$/.test(id);

export const getJiraId = async (title, branch, path) => {
    const titleMatch = title.match(/JIRA-[A-Za-z0-9]{1,8}-\d{1,10}/);
    if (titleMatch && isValidJiraId(titleMatch[0])) return title;

    try {
        if (!branch || typeof branch !== 'string') throw new Error('Invalid branch name');
        const commitMessage = await runCmd(`git show -s --format=%B $(git rev-parse origin/${branch})`, path);
        console.log('commitMessage >> ',commitMessage)
        const match = commitMessage.match(/JIRA-[A-Za-z0-9]{1,8}-\d{1,10}/);
        return match ? `JIRA-${match[0]} ${title || ''}` : null;

    } catch (error) { console.error('Error fetching JIRA ID from commit:', error); return null; }

};