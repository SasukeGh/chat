async function loadMessages() {
  const res = await fetch('/api/getMessages');
  const data = await res.json();
  const chatBox = document.getElementById('chat-box');
  chatBox.innerHTML = data.messages
    .map(msg => `<p><strong>${msg.sender}:</strong> ${msg.message}</p>`)
    .join('');
  chatBox.scrollTop = chatBox.scrollHeight;
}

document.getElementById('chat-form').addEventListener('submit', async (e) => {
  e.preventDefault();
  const sender = document.getElementById('sender').value;
  const message = document.getElementById('message').value;

  await fetch('/api/sendMessage', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ sender, message })
  });

  document.getElementById('message').value = '';
  loadMessages();
});

setInterval(loadMessages, 3000);
loadMessages();

