// uploadImage.js
export default async function handler(req, res) {
  if (req.method === "POST") {
    const { content, name, type } = req.body;

    const apiKey = "your_imgbb_api_key"; // Replace with your IMGBB API key

    // Create a form data object to send the image to IMGBB
    const formData = new FormData();
    formData.append("image", content); // The base64 string of the image

    try {
      const response = await fetch(`https://api.imgbb.com/1/upload?key=${apiKey}`, {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (data.success) {
        const imageUrl = data.data.url; // The image URL returned by IMGBB
        return res.json({ url: imageUrl });
      } else {
        return res.status(400).json({ error: "Image upload failed", details: data });
      }
    } catch (error) {
      console.error("Error uploading image:", error);
      return res.status(500).json({ error: "Internal Server Error" });
    }
  } else {
    return res.status(405).json({ error: "Method Not Allowed" });
  }
}
