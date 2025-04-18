let lastMessageTime = null;

// Load name from cookie
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

    // Show notification for new message
    if (messages.length > 0) {
      const latestMsg = messages[messages.length - 1];

      if (lastMessageTime !== latestMsg.timestamp) {
        if (Notification.permission === "granted") {
          new Notification(`${latestMsg.sender}: ${latestMsg.message}`);
        }
        lastMessageTime = latestMsg.timestamp;
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

// Start polling messages every 1 second
loadMessages();
setInterval(loadMessages, 1000);
