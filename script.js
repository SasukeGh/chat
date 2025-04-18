// Request permission for notifications when the page loads
if (Notification.permission !== "granted") {
    // Request permission if not granted already
    Notification.requestPermission().then(permission => {
        if (permission === "granted") {
            console.log("Notification permission granted");
        } else {
            console.log("Notification permission denied");
        }
    });
}

// Load messages when the page is loaded
window.onload = loadMessages;

async function loadMessages() {
    try {
        const response = await fetch("/api/getMessages");
        const data = await response.json();

        const messagesContainer = document.getElementById("chat-box");
        if (messagesContainer) {
            const messages = data.messages;
            // Format the timestamp to display only hours and minutes (HH:MM)
            messagesContainer.innerHTML = messages.map(msg => {
                const timestamp = new Date(msg.timestamp);
                const formattedTime = timestamp.toISOString().substr(11, 5); // Get the time part (HH:MM)
                return `<p><strong>${msg.sender}:</strong> ${msg.message} <em>${formattedTime}</em></p>`;
            }).join("");

            // Show notifications for new messages
            if (Notification.permission === "granted" && messages.length > 0) {
                // Show notification for the last message
                const lastMessage = messages[messages.length - 1];
                showNotification(lastMessage);
            }
        } else {
            console.error("Messages container not found");
        }
    } catch (error) {
        console.error("Error fetching messages:", error);
    }
}

// Function to show a browser notification
function showNotification(message) {
    const notification = new Notification("New Message", {
        body: `${message.sender}: ${message.message}`,
        icon: "/path/to/icon.png",  // Optional: set an icon here
    });
}

// Adding event listener for form submission
document.getElementById("chat-form").addEventListener("submit", async (event) => {
    event.preventDefault(); // Prevent page refresh on submit

    const sender = document.getElementById("sender").value;
    const message = document.getElementById("message").value;

    // Send the message
    const response = await fetch("/api/sendMessage", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ sender, message }),
    });

    if (response.ok) {
        console.log("Message sent successfully");
        loadMessages(); // Reload messages after sending one
    } else {
        console.error("Error sending message:", response.statusText);
    }

    // Clear the input fields
    document.getElementById("sender").value = '';
    document.getElementById("message").value = '';
});
