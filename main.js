(function () {
  'use strict';

  var CACHE_NAME = 'gameland-shell-v1';

  var badge = document.getElementById('network-badge');
  var statusText = document.getElementById('status-text');
  var progressBar = document.getElementById('progress-bar');
  var checkButton = document.getElementById('check-button');
  var restartButton = document.getElementById('restart-button');

  function setStatus(message) {
    if (statusText) {
      statusText.textContent = message;
    }
  }

  function setProgress(value) {
    if (progressBar) {
      progressBar.style.width = value;
    }
  }

  function setButtonState(button, disabled) {
    if (button) {
      button.disabled = disabled;
    }
  }

  function setNetworkStatus() {
    if (!badge) {
      return;
    }

    var online = navigator.onLine;
    badge.textContent = online ? 'آنلاین' : 'حالت آفلاین';
    badge.className = 'badge ' + (online ? 'online' : 'offline');
  }

  function checkOfflineReady() {
    setButtonState(checkButton, true);
    setProgress('35%');
    setStatus('در حال بررسی حافظهٔ آفلاین...');

    if (!('serviceWorker' in navigator) || !('caches' in window)) {
      setProgress('100%');
      setStatus('این مرورگر از Service Worker پشتیبانی نمی‌کند.');
      setButtonState(checkButton, false);
      return;
    }

    caches
      .has(CACHE_NAME)
      .then(function (ready) {
        setProgress('100%');
        setStatus(
          ready
            ? 'رابط گیم‌لند برای استفادهٔ آفلاین آماده است.'
            : 'کش هنوز آماده نیست؛ صفحه را یک‌بار تازه‌سازی کنید.'
        );
      })
      .catch(function () {
        setProgress('100%');
        setStatus('بررسی حافظه انجام نشد. دوباره تلاش کنید.');
      })
      .finally(function () {
        setButtonState(checkButton, false);
      });
  }

  function registerServiceWorker() {
    if (!('serviceWorker' in navigator)) {
      return;
    }

    window.addEventListener('load', function () {
      navigator.serviceWorker
        .register('./service-worker.js', { scope: './' })
        .then(function () {
          setStatus('سامانه آماده است؛ ذخیره‌سازی آفلاین فعال شد.');
        })
        .catch(function () {
          setStatus('ثبت حالت آفلاین ناموفق بود؛ سایت باید از HTTPS یا localhost باز شود.');
        });
    });
  }

  function bindEvents() {
    window.addEventListener('online', setNetworkStatus);
    window.addEventListener('offline', setNetworkStatus);

    if (checkButton) {
      checkButton.addEventListener('click', checkOfflineReady);
    }

    if (restartButton) {
      restartButton.addEventListener('click', function () {
        window.location.reload();
      });
    }
  }

  setNetworkStatus();
  bindEvents();
  registerServiceWorker();
}());
