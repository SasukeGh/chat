async function loadMessages() {
    try {
        const response = await fetch("/api/getMessages");
        const data = await response.json();

        const messagesContainer = document.getElementById("chat-box");
        if (messagesContainer) {
            // Format the timestamp to display only hours and minutes (HH:MM)
            messagesContainer.innerHTML = data.messages.map(msg => {
                const timestamp = new Date(msg.timestamp);
                const formattedTime = timestamp.toISOString().substr(11, 5); // Get the time part (HH:MM)
                return `<p><strong>${msg.sender}:</strong> ${msg.message} <em>${formattedTime}</em></p>`;
            }).join("");
        } else {
            console.error("Messages container not found");
        }
    } catch (error) {
        console.error("Error fetching messages:", error);
    }
}
