import { slackLog } from "@/utils/fun";

export default async function handler(req, res) {
    const { query , body } = req
  slackLog(JSON.stringify({ Msg: 'Webhook received successfully!', body, query}));
  res.status(200).json({state: 'success', message: 'Webhook received successfully!'});
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