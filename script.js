// === Cookie Utilities ===
function setCookie(name, value, days) {
  const expires = new Date(Date.now() + days * 864e5).toUTCString();
  document.cookie = `${name}=${encodeURIComponent(value)}; expires=${expires}; path=/`;
}

function getCookie(name) {
  return document.cookie.split('; ').reduce((r, v) => {
    const parts = v.split('=');
    return parts[0] === name ? decodeURIComponent(parts[1]) : r
  }, '');
}

// === Format Timestamp (HH:MM) ===
function formatTime(timestamp) {
  const date = new Date(timestamp);
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

// === Load Messages ===
async function loadMessages() {
  try {
    const res = await fetch('/api/getMessages');
    const data = await res.json();
    const chatBox = document.getElementById('chat-box');

    if (!chatBox) return;

    chatBox.innerHTML = '';
    data.messages.forEach(msg => {
      const time = formatTime(msg.timestamp);
      const div = document.createElement('div');
      div.textContent = `${msg.sender} (${time}): ${msg.message}`;
      chatBox.appendChild(div);
    });

    // Scroll to bottom
    chatBox.scrollTop = chatBox.scrollHeight;

    // Notify if new message
    if (Notification.permission === "granted" && data.messages.length > 0) {
      const lastMsg = data.messages[data.messages.length - 1];
      if (lastMsg.sender !== getCookie("sender")) {
        showNotification(lastMsg.sender, lastMsg.message);
      }
    }

  } catch (err) {
    console.error("Error fetching messages:", err);
  }
}

// === Show Notification ===
function showNotification(sender, message) {
  new Notification(`New message from ${sender}`, {
    body: message,
    icon: "https://cdn-icons-png.flaticon.com/512/1384/1384031.png" // optional icon
  });
}

// === Request Notification Permission ===
if ("Notification" in window && Notification.permission !== "granted") {
  Notification.requestPermission();
}

// === Form Submission ===
document.getElementById("chat-form").addEventListener("submit", async (e) => {
  e.preventDefault();

  const senderInput = document.getElementById("sender");
  const messageInput = document.getElementById("message");

  const sender = senderInput.value.trim();
  const message = messageInput.value.trim();

  if (!sender || !message) return;

  setCookie("sender", sender, 365); // Save sender name in cookie

  try {
    const res = await fetch('/api/sendMessages', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ sender, message }),
    });

    if (res.ok) {
      messageInput.value = '';
      loadMessages();
    } else {
      console.error("Error sending message:", res.statusText);
    }
  } catch (err) {
    console.error("Error sending message:", err);
  }
});

// === On Page Load ===
window.onload = () => {
  const savedSender = getCookie("sender");
  if (savedSender) document.getElementById("sender").value = savedSender;
  loadMessages();
  setInterval(loadMessages, 1000); // Refresh every 1 second
};
