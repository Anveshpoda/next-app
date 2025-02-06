import { slackLog } from "@/utils/fun";

export default async function handler(req, res) {
  slackLog('Webhook received successfully!');
  res.status(200).json({state: 'success', message: 'Webhook received successfully!'});
}