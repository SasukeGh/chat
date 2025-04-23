document.getElementById("image-input").addEventListener("change", async (event) => {
  const file = event.target.files[0];
  if (!file) return;

  const reader = new FileReader();

  reader.onloadend = async () => {
    const base64 = reader.result.split(",")[1]; // Extract the base64 string from the data URI

    try {
      const response = await fetch("/api/uploadImage", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: file.name,
          content: base64,
          type: file.type,
        }),
      });

      const data = await response.json();

      if (data.url) {
        // Send the image link as a message
        document.getElementById("message").value = data.url;
        document.getElementById("chat-form").dispatchEvent(new Event("submit"));
      } else {
        alert("Image upload failed!");
        console.error(data);
      }
    } catch (err) {
      console.error("Error uploading image:", err);
    }
  };

  reader.readAsDataURL(file); // Read the image as base64
});
