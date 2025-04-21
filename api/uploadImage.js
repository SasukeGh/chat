export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { name, content, type } = req.body;

  try {
    const buffer = Buffer.from(content, 'base64');

    const blob = new Blob([buffer], { type });
    const formData = new FormData();
    formData.append('file', blob, name);

    const upload = await fetch('https://telegra.ph/upload', {
      method: 'POST',
      body: formData,
    });

    const result = await upload.json();

    if (Array.isArray(result) && result[0]?.src) {
      return res.status(200).json({ url: 'https://telegra.ph' + result[0].src });
    }

    return res.status(500).json({ error: 'Failed to upload', details: result });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}
