let lastNotifiedMessageId = null;

// Load sender name from cookie
const senderInput = document.getElementById("sender");
const cookieMatch = document.cookie.match(/sender=([^;]+)/);
if (cookieMatch) {
  senderInput.value = decodeURIComponent(cookieMatch[1]);
}

// Ask for notification permission
if (Notification.permission !== "granted" && Notification.permission !== "denied") {
  Notification.requestPermission();
}

async function loadMessages() {
  try {
    const res = await fetch("/api/getMessages");
    const data = await res.json();
    const messages = data.messages;

    const chatBox = document.getElementById("chat-box");
    if (!chatBox) return;

    chatBox.innerHTML = "";

    messages.forEach((msg) => {
      const time = new Date(msg.timestamp).toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
      });
      const div = document.createElement("div");
      div.textContent = `${msg.sender} [${time}]: ${msg.message}`;
      chatBox.appendChild(div);
    });

    // Show notification for new message (only once per message)
    if (messages.length > 0) {
      const latest = messages[messages.length - 1];
      const uniqueMsgId = `${latest.sender}-${latest.timestamp}-${latest.message}`;

      if (lastNotifiedMessageId !== uniqueMsgId) {
        if (Notification.permission === "granted") {
          new Notification(`${latest.sender}: ${latest.message}`);
        }
        lastNotifiedMessageId = uniqueMsgId;
      }
    }
  } catch (err) {
    console.error("Error fetching messages:", err);
  }
}

document.getElementById("chat-form").addEventListener("submit", async (e) => {
  e.preventDefault();

  const sender = senderInput.value.trim();
  const message = document.getElementById("message").value.trim();

  if (!sender || !message) return;

  // Save sender to cookie (expires in 1 year)
  document.cookie = `sender=${encodeURIComponent(sender)}; path=/; max-age=${60 * 60 * 24 * 365}`;

  try {
    const res = await fetch("/api/sendMessage", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ sender, message }),
    });

    if (res.ok) {
      document.getElementById("message").value = "";
      loadMessages();
    } else {
      console.error("Failed to send message");
    }
  } catch (err) {
    console.error("Error sending message:", err);
  }
});

//image stuff
document.getElementById('image-upload').addEventListener('change', async (event) => {
  const file = event.target.files[0];
  if (!file) return;

  const formData = new FormData();
  formData.append('file', file);

  try {
    const res = await fetch('https://telegra.ph/upload', {
      method: 'POST',
      body: formData,
    });

    const data = await res.json();
    if (data[0]?.src) {
      const imageUrl = `https://telegra.ph${data[0].src}`;
      console.log("Image uploaded:", imageUrl);

      // Auto-fill the message box with the link
      document.getElementById('message').value = imageUrl;

      // Optionally auto-send it
      document.getElementById('chat-form').dispatchEvent(new Event('submit'));
    }
  } catch (err) {
    console.error("Image upload failed", err);
    alert("Image upload failed.");
  }

  // Clear the file input so same file can be uploaded again
  event.target.value = '';
});

// Start polling every second
loadMessages();
setInterval(loadMessages, 1000);
