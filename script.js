document.getElementById("webhookButton").addEventListener("click", function() {
    fetch("https://discord.com/api/webhooks/1345338419219267664/yU2pUdB2V4FJDrN1CPd5cHJUHY3B1OCxoihp2nSAkeHwxj7QJNCy-5zNgERi5HqTYbKM", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: "Button is working" })
    })
    .then(response => {
        if (response.ok) {
            alert("Message sent!");
        } else {
            alert("Failed to send message.");
        }
    })
    .catch(error => {
        alert("Error: " + error);
    });
});
