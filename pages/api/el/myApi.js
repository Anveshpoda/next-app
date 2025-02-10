export default async function handler(req, res) {
    const queryString = new URLSearchParams(req.query).toString();
    const targetUrl = `https://staging2.justdial.com/online-consult/api/compDataByMobile?${queryString}`;
  
    try {
      const response = await fetch(targetUrl, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Basic ZGV2ZWxvcG1lbnQ6bEJZeGx0R1E5NVZBcw=='
        }
      });

      if (!response.ok) {
        res.status(response.status).json({ error: 'Error fetching data from external API' });
        return;
      }
  
      const data = await response.json();
  
      res.status(200).json(data);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
  