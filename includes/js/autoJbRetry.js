function setAutoJbRetry(checked) {
  localStorage.setItem('autoJbRetry', checked);
  sessionStorage.setItem('autoJbRetry', checked);
}
function autoJailbreak() { if (typeof jailbreak === 'function') jailbreak(); }
function autoJailbreakTimer() { setTimeout(autoJailbreak, 3000); }
