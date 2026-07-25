function canRunAutoJailbreak() {
    if (!window.applicationCache) return true;

    const st = window.applicationCache.status;
    return (
        st === window.applicationCache.UNCACHED ||
        st === window.applicationCache.IDLE ||
        st === window.applicationCache.UPDATEREADY
    );
}

function setAutoJbRetry(checked) {
    localStorage.setItem('autoJbRetry', checked);
    sessionStorage.setItem('autoJbRetry', checked);

    if (!checked) return;
    if (confirm(window.lang.autoJbRetryConfirm)) {
        settingsPopup();
        jailbreak();
    }
}

function autoJailbreak() {
    // Gate: never run while cache is still building/downloading
    if (!canRunAutoJailbreak()) {
        if (window.applicationCache) {
            const appCache = window.applicationCache;
            const once = () => {
                if (!window.__gamelandAutoJbDelayed) {
                    window.__gamelandAutoJbDelayed = true;
                    autoJailbreak();
                }
            };

            appCache.addEventListener('cached', once, { once: true });
            appCache.addEventListener('updateready', once, { once: true });
            appCache.addEventListener('noupdate', once, { once: true });
        }
        return;
    }

    // used for 6.7x jailbreak when userland is loaded on jailbreak only.
    if (sessionStorage.getItem('jailbreakNow') == "true") {
        jailbreak();
        return;
    }

    var checked = (localStorage.getItem('autoJbRetry') || 'true') === 'true';
    var sessionChecked = sessionStorage.getItem('autoJbRetry') == 'true';
    ui.autoJbRetry.checked = checked;

    if (window.ps4Fw < 6.70 || window.ps4Fw > 9.60 || !window.ps4Fw) return;

    if (checked && sessionChecked) {
        jailbreak();
    }
}

function autoJailbreakTimer() {
    let retry = 3;
    let timer = setInterval(function () {
        retry--;
        if (retry <= 0) {
            clearInterval(timer);
            if (canRunAutoJailbreak()) {
                jailbreak();
            } else {
                autoJailbreak();
            }
        }
    }, 1000);
}
