// /api/uploadImage.js
export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { name, content, type } = req.body;
  const apiKey = "YOUR_IMGBB_API_KEY";

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
      // generate a viewkey and save it with the image URL
      const viewkey = Math.random().toString(16).substring(2, 14);
      // Save this viewkey + URL in a file or DB (we can use Neon for this)

      // For now, return the image URL and viewkey
      res.status(200).json({ url: result.data.url, viewkey });
    } else {
      res.status(500).json({ error: "Upload failed", details: result });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to upload", details: err.message });
  }
}
