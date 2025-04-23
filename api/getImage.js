import fs from 'fs';
import path from 'path';

const filePath = path.resolve('./data/images.json');

export default async function handler(req, res) {
  const { viewkey } = req.query;

  if (!viewkey) {
    return res.status(400).json({ error: "Missing viewkey" });
  }

  try {
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ error: "Image not found" });
    }

    const data = fs.readFileSync(filePath);
    const entries = JSON.parse(data);
    const match = entries.find(entry => entry.viewkey === viewkey);

    if (match) {
      res.status(200).json({ url: match.url });
    } else {
      res.status(404).json({ error: "Image not found" });
    }
  } catch (err) {
    res.status(500).json({ error: "Failed to load image", details: err.message });
  }
}
