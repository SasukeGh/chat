// Function to load all messages from the database and display them
const loadMessages = async () => {
  try {
    const response = await fetch('/api/getMessages');  // Fetch all messages
    const data = await response.json();

    if (response.ok) {
      const messages = data.messages;
      const messagesContainer = document.getElementById('messages-container');
      messagesContainer.innerHTML = '';  // Clear existing messages

      // Loop through the messages and append them to the container
      messages.forEach(message => {
        const messageElement = document.createElement('div');
        messageElement.classList.add('message');
        messageElement.innerHTML = `
          <strong>${message.sender}</strong>: ${message.message} <small>${new Date(message.timestamp).toLocaleString()}</small>
        `;
        messagesContainer.appendChild(messageElement);
      });
    } else {
      console.error('Error loading messages:', data.error);
    }
  } catch (error) {
    console.error('Error fetching messages:', error);
  }
};

// Function to send a new message and store it in the database
const sendMessage = async () => {
  const sender = 'User1';  // You can change this to the actual sender's name
  const message = document.getElementById('message-input').value;

  if (!message.trim()) return;  // Don't send an empty message

  try {
    const response = await fetch('/api/sendMessage', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ sender, message }),  // Send the message to the backend
    });

    const data = await response.json();

    if (response.ok) {
      console.log('Message sent:', data.success);
      loadMessages();  // Reload messages after sending a new one
    } else {
      console.error('Error sending message:', data.error);
    }

    // Clear the input field after sending the message
    document.getElementById('message-input').value = '';
  } catch (error) {
    console.error('Error sending message:', error);
  }
};

// Call the loadMessages function when the page loads
window.onload = () => {
  loadMessages();  // Initial load of messages
  // Set up an interval to load messages every 1 second (1000 milliseconds)
  setInterval(loadMessages, 1000);
};
