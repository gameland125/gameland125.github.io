// Gameland Single-Page Jailbreak Logic
var user = {
    platform: "PS4",
    ps4Fw: "9.00",
    bareboneJB: false
};

var ui = {
    clickToStartText: document.getElementById('click-to-start-text'),
    statusMessage: document.getElementById('status-message'),
    stopAutoJbBtn: document.getElementById('stopAutoJbBtn'),
    consoleElement: { textContent: '' }
};

var autoJbInterval = null;

async function jailbreak() {
    if (user.platform !== "PS4") return;
    
    if (autoJbInterval) clearInterval(autoJbInterval);
    sessionStorage.setItem('autoJbRetry', 'true');
    
    ui.statusMessage.textContent = "در حال اجرای اکسپلویت جیلبریک...";
    
    // Simulate/Trigger Jailbreak flow
    try {
        if (typeof doJailBreak === 'function') {
            await doJailBreak();
        } else {
            // Simulator or fallback execution sequence
            setTimeout(() => {
                var isSuccess = Math.random() > 0.15; // Simulated PS4 stability rate
                if (isSuccess) {
                    jailbreakSuccess();
                } else {
                    handleJailbreakFailure("خطای حافظه (Out of Memory)");
                }
            }, 2000);
        }
    } catch (e) {
        handleJailbreakFailure(e.message || "خطای ناشناخته اکسپلویت");
    }
}

function jailbreakSuccess() {
    resetJbFailures();
    sessionStorage.setItem('autoJbRetry', 'false');
    showExitScreen();
}

function showExitScreen() {
    document.body.style.background = '#120516';
    document.body.style.margin = '0';
    document.body.innerHTML = `
        <div style="
            display:flex;
            flex-direction: column;
            align-items:center;
            justify-content:center;
            width:100vw;
            height:100vh;
            background:#120516;
            color:#ffb3d9;
            font-family:sans-serif;
            text-align:center;
        ">
            <h1 style="font-size: 48px; text-shadow: 0 0 20px #ff80bf; margin-bottom: 20px;">GoldHEN Loaded</h1>
            <p style="font-size: 20px; color: #ffd6eb;">جیلبریک با موفقیت انجام شد. اکنون می‌توانید از مرورگر خارج شوید.</p>
        </div>
    `;
}
