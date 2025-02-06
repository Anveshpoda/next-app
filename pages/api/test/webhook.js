import { slackLog } from "@/utils/fun";

export default async function handler(req, res) {
    const { query , body } = req
  slackLog(JSON.stringify({ Msg: 'Webhook received successfully!', body, query}));
  res.status(200).json({state: 'success', message: 'Webhook received successfully!'});
}