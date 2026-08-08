/* Gameland safe retry guard: prevents browser deadlock and offers recovery after 3 failures. */
(function () {
  window.GAMELAND_MAX_FAILURES = 3;
  var key = 'gameland_jb_failures';
  window.gamelandRecordFailure = function () {
    var n = Number(sessionStorage.getItem(key) || 0) + 1;
    sessionStorage.setItem(key, String(n));
    if (n >= 3) {
      var retry = window.confirm('اجرای جیل‌بریک سه بار ناموفق بود. مرورگر را دوباره راه‌اندازی و تلاش شود؟');
      if (retry) { sessionStorage.removeItem(key); window.location.reload(); }
      return true;
    }
    return false;
  };
  window.gamelandClearFailures = function () { sessionStorage.removeItem(key); };
})();

function setAutoJbRetry(checked) {
    localStorage.setItem('autoJbRetry', checked);
    sessionStorage.setItem('autoJbRetry', checked);

    if (!checked) return;
    if (confirm(window.lang.autoJbRetryConfirm)) {
        // close settings popup
        settingsPopup();

        jailbreak();
    }
}

// When jailbreak succeds, this will be stopped
function autoJailbreak() {
    // used for 6.7x jailbreak when userland is loaded on jailbreak only.
    if (sessionStorage.getItem('jailbreakNow') == "true") {
        jailbreak();
        return;
    }
    var checked = (localStorage.getItem('autoJbRetry') || 'true') === 'true'; // default to true if not set
    var sessionChecked = sessionStorage.getItem('autoJbRetry') == 'true';
    ui.autoJbRetry.checked = checked;
    // check if supported ps4
    if (window.ps4Fw < 6.70 || window.ps4Fw > 9.60 || !window.ps4Fw) return;

    // If auto jb is checked and previous jailbreak attempt was unsuccessful, retry jailbreak with a timer
    if (checked && sessionChecked) {
        autoJailbreakTimer();
    }
}

// localStorage retry value true but no sessionStorage value? use timer.
function autoJailbreakTimer() {
    var timer = 3; // Start a longer countdown immediately
    ui.stopAutoJbBtn.classList.toggle('hidden');
    autoJbInterval = setInterval(() => {

        ui.clickToStartText.textContent = window.lang.jailbreakCountDown.replace('{seconds}', timer);
        ui.clickToStartText.style.fontSize = "15px";
        if (timer <= 0) {
            clearInterval(autoJbInterval);
            jailbreak();
        }
        timer--;
    }, 1000);
}
