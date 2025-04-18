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
