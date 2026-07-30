// Smart Retry Logic with 3 Failure Modal limit
const MAX_JB_FAILURES = 3;
const RETRY_DELAY_SECONDS = 3;

function getJbFailures() {
    return Number(sessionStorage.getItem('jbFailures') || '0');
}

function resetJbFailures() {
    sessionStorage.removeItem('jbFailures');
}

function recordJbFailure() {
    const failures = getJbFailures() + 1;
    sessionStorage.setItem('jbFailures', String(failures));
    return failures;
}

function showRetryLimitModal() {
    const modal = document.getElementById('retry-limit-modal');
    if (modal) modal.classList.remove('hidden');
}

function restartAfterRetryLimit() {
    resetJbFailures();
    sessionStorage.setItem('autoJbRetry', 'true');
    const modal = document.getElementById('retry-limit-modal');
    if (modal) modal.classList.add('hidden');
    autoJailbreak();
}

function handleJailbreakFailure(message) {
    const failures = recordJbFailure();
    if (failures >= MAX_JB_FAILURES) {
        showRetryLimitModal();
        return;
    }
    
    ui.statusMessage.textContent = message + " | تلاش مجدد " + failures + " از " + MAX_JB_FAILURES;
    autoJailbreakTimer();
}

function autoJailbreak() {
    var checked = (localStorage.getItem('autoJbRetry') || 'true') === 'true';
    var sessionChecked = (sessionStorage.getItem('autoJbRetry') || 'true') === 'true';

    if (checked && sessionChecked) {
        autoJailbreakTimer();
    }
}

function autoJailbreakTimer() {
    let timer = RETRY_DELAY_SECONDS;
    ui.stopAutoJbBtn.classList.remove('hidden');
    ui.clickToStartText.className = 'countdown-text';

    if (autoJbInterval) clearInterval(autoJbInterval);
    
    autoJbInterval = setInterval(() => {
        ui.clickToStartText.textContent = timer;
        
        if (timer <= 0) {
            clearInterval(autoJbInterval);
            jailbreak();
        }
        timer -= 1;
    }, 1000);
}

// Stop functionality
if (ui.stopAutoJbBtn) {
    ui.stopAutoJbBtn.addEventListener('click', () => {
        if (autoJbInterval) clearInterval(autoJbInterval);
        sessionStorage.setItem('autoJbRetry', 'false');
        ui.clickToStartText.textContent = "متوقف شد";
        ui.statusMessage.textContent = "اجرای خودکار متوقف شد. برای شروع دستی صفحه را رفرش کنید.";
        ui.stopAutoJbBtn.classList.add('hidden');
    });
}
