import fs from 'fs';
import path from 'path';

const filePath = path.resolve('./data/images.json');

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { name, content } = req.body;
  const apiKey = "f477ec52a8c28cb90e3039386703cc08";

  try {
    const response = await fetch(`https://api.imgbb.com/1/upload?key=${apiKey}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        image: content,
        name,
      }),
    });

    const result = await response.json();

    if (result.success) {
      const viewkey = Math.random().toString(16).substring(2, 14);
      const newEntry = { viewkey, url: result.data.url };

      let current = [];
      if (fs.existsSync(filePath)) {
        const data = fs.readFileSync(filePath);
        current = JSON.parse(data);
      }
      current.push(newEntry);
      fs.writeFileSync(filePath, JSON.stringify(current, null, 2));

      res.status(200).json({ url: result.data.url, viewkey });
    } else {
      res.status(500).json({ error: "Upload failed", details: result });
    }
  } catch (err) {
    res.status(500).json({ error: "Failed to upload", details: err.message });
  }
}
