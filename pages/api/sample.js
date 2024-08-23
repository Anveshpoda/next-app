import { createMr, slackLog } from "@/utils/fun"

export default async function handler(req, res) {


  if (req.query.live = 1) { await takeLive(res) }


  res.status(200).json({ name: 'John Doe' })
}

const takeLive = async (res) => {
  let dt = await createMr("mpa_app", "development", "pre-prod", "JIRA-ELWM-6955")
  if (dt.code == 0 || dt.data.message) return res.status(500).json(dt)

  // slackLog(dt.data.web_url)
  slackLog(dt.data.web_url, "anvesh")

  // res.write(`\n${dt.data.web_url}`);
  res.write(`\n${JSON.stringify(dt)}`);
  res.end();
}