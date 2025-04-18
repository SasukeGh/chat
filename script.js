// Define loadMessages function first
async function loadMessages() {
    try {
        const response = await fetch("/api/getMessages");
        const data = await response.json();

        const messagesContainer = document.getElementById("chat-box");
        if (messagesContainer) {
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

// Add event listener to handle form submission
document.getElementById("chat-form").addEventListener("submit", async (e) => {
    e.preventDefault();  // Prevent the page from refreshing

    const sender = document.getElementById("sender").value;
    const message = document.getElementById("message").value;

    if (sender && message) {
        try {
            // Send the message to the API
            const response = await fetch("/api/sendMessage", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ sender, message }),
            });

            // Check if the response was successful
            if (response.ok) {
                console.log("Message sent successfully");
                // Clear the input fields after sending
                document.getElementById("sender").value = "";
                document.getElementById("message").value = "";

                // Reload messages
                loadMessages();  // This should now work
            } else {
                console.error("Failed to send message");
            }
        } catch (error) {
            console.error("Error sending message:", error);
        }
    }
});
