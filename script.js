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
document.getElementById("image-input").addEventListener("change", async (event) => {
  const file = event.target.files[0];
  if (!file) return;

  const reader = new FileReader();

  reader.onloadend = async () => {
    const base64 = reader.result.split(",")[1];

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
  };

  reader.readAsDataURL(file);
});

// Start polling every second
loadMessages();
setInterval(loadMessages, 1000);
chatBox.scrollTop = chatBox.scrollHeight;

