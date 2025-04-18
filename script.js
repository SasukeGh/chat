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

                // Reload messages (you can adjust the interval for automatic refreshing)
                loadMessages();
            } else {
                console.error("Failed to send message");
            }
        } catch (error) {
            console.error("Error sending message:", error);
        }
    }
});
