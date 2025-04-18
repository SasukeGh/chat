async function loadMessages() {
    try {
        const response = await fetch("/api/getMessages");
        const data = await response.json();

        const messagesContainer = document.getElementById("chat-box"); // Change this to 'chat-box'
        if (messagesContainer) {
            // Ensure the element exists before setting innerHTML
            messagesContainer.innerHTML = data.messages.map(msg => 
                `<p><strong>${msg.sender}:</strong> ${msg.message} <em>${msg.timestamp}</em></p>`
            ).join("");
        } else {
            console.error("Messages container not found");
        }
    } catch (error) {
        console.error("Error fetching messages:", error);
    }
}
