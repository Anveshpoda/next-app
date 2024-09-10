import fs from 'fs';

export default async function handler(req, res) {

  const { fileName, type } = req.query

  const logFileName = `logs/${type ? type + '/' : ''}${fileName}`;

  if (!fs.existsSync(logFileName)) {
    return res.status(500).json({ error: 1, msg: `Log file not found for fileName: ${fileName}` })
  }
  let data = fs.readFileSync(logFileName, 'utf-8');

  res.status(200).json({ name: 'Anvesh', content: data })
}
