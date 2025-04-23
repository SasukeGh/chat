document.getElementById("image-input").addEventListener("change", async (event) => {
  const file = event.target.files[0];
  if (!file) return;

  const formData = new FormData();
  formData.append("file", file); // "file" is the key expected by your server
  
  try {
    const response = await fetch("/api/uploadImage", {
      method: "POST",
      body: formData,  // Send the file as FormData
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
});
