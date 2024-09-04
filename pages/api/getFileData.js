import fs from 'fs';

export default async function handler(req, res) {
  let data
  if (req.query.fileName) {
    data = await getLogByTimestamp(res, req.query.fileName, req.query.type)
  }
  res.status(200).json({ name: 'Anvesh', content: data })
}



export const getLogByTimestamp = async (res, fileName, type) => {
  const logFileName = `logs/${type}/${fileName}`;
  if (!fs.existsSync(logFileName)) {
    // throw new Error(`Log file not found for fileName: ${fileName}`);
    res.write(`Log file not found for fileName: ${fileName}`);
    res.end();
  }
  return fs.readFileSync(logFileName, 'utf-8');
};