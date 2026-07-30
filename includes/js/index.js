
// Gameland Premium - Qassem Akbarzadeh
window.user = {
    jailbreakSuccessDone: false,
    attempts: parseInt(sessionStorage.getItem('jbAttempts') || '0'),
    maxAttempts: 3
};

// Inject Pink UI
function injectGamelandUI() {
    const style = document.createElement('style');
    style.innerHTML = `
        #gameland-overlay {
            position: fixed; top: 0; left: 0; width: 100%; height: 100%;
            background: radial-gradient(circle, #fce4ec 0%, #f8bbd0 100%);
            z-index: 99999; display: flex; flex-direction: column;
            align-items: center; justify-content: center; font-family: sans-serif; color: #880e4f;
        }
        .g-card {
            background: rgba(255, 255, 255, 0.4); padding: 30px; border-radius: 25px;
            box-shadow: 0 10px 30px rgba(0,0,0,0.1); text-align: center; width: 450px;
            border: 2px solid rgba(255,255,255,0.6);
        }
        .g-logo { font-size: 80px; font-weight: bold; margin-bottom: 10px; color: #ec407a; }
        .g-brand { font-size: 32px; font-weight: bold; margin-bottom: 20px; }
        .g-info { font-size: 18px; line-height: 1.8; border-top: 1px solid rgba(136, 14, 79, 0.2); pt: 15px; }
        .g-status { margin-top: 25px; font-weight: bold; font-size: 22px; color: #d81b60; }
        #settings, .settings, #panel, .modal { display: none !important; visibility: hidden !important; }
    `;
    document.head.appendChild(style);

    const overlay = document.createElement('div');
    overlay.id = 'gameland-overlay';
    overlay.innerHTML = `
        <div class="g-card">
            <div class="g-logo">G</div>
            <div class="g-brand">گیم لند (Gameland)</div>
            <div class="g-info">
                <div>👨‍💼 قاسم اکبرزاده</div>
                <div>📍 کاشمر، خیابان ترابی ۱۵</div>
                <div>📞 ۰۹۳۶۴۲۲۹۷۴۸</div>
            </div>
            <div id="jb-status" class="g-status">منتظر بمانید...</div>
        </div>
    `;
    document.body.appendChild(overlay);
}

document.addEventListener('DOMContentLoaded', () => {
    injectGamelandUI();
    
    // Check for 3 failures
    if (window.user.attempts >= window.user.maxAttempts) {
        sessionStorage.setItem('jbAttempts', '0');
        document.getElementById('jb-status').innerText = "تلاش بیش از حد؛ ریستارت دستگاه...";
        setTimeout(() => { location.reload(); }, 2000);
        return;
    }

    // Auto-start Jailbreak after a small delay
    setTimeout(() => {
        document.getElementById('jb-status').innerText = "در حال اجرای GoldHEN...";
        if (typeof jailbreak === 'function') jailbreak();
    }, 1500);
});

function jailbreakSuccess() {
    window.user.jailbreakSuccessDone = true;
    sessionStorage.setItem('jbAttempts', '0');
    document.getElementById('jb-status').innerText = "GoldHEN با موفقیت اجرا شد";
    setTimeout(() => { showExitScreen(); }, 1000);
}

function jailbreakError() {
    let current = window.user.attempts + 1;
    sessionStorage.setItem('jbAttempts', current.toString());
    document.getElementById('jb-status').innerText = "خطا! تلاش مجدد (" + current + "/3)";
    setTimeout(() => { location.reload(); }, 2000);
}

function showExitScreen() {
    document.getElementById('jb-status').innerText = "عملیات موفق؛ اکنون خارج شوید";
    // window.close() is blocked during cache, so we just stay here.
}
