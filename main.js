(function () {
  'use strict';

  var badge = document.getElementById('network-badge');
  var statusText = document.getElementById('status-text');
  var progressBar = document.getElementById('progress-bar');
  var checkButton = document.getElementById('check-button');
  var restartButton = document.getElementById('restart-button');

  function setNetworkStatus() {
    var online = navigator.onLine;
    badge.textContent = online ? 'آنلاین' : 'حالت آفلاین';
    badge.className = 'badge ' + (online ? 'online' : 'offline');
  }

  function checkOfflineReady() {
    checkButton.disabled = true;
    progressBar.style.width = '35%';
    statusText.textContent = 'در حال بررسی حافظهٔ آفلاین...';

    if (!('serviceWorker' in navigator) || !('caches' in window)) {
      progressBar.style.width = '100%';
      statusText.textContent = 'این مرورگر از Service Worker پشتیبانی نمی‌کند.';
      checkButton.disabled = false;
      return;
    }

    caches.has('gameland-shell-v1').then(function (ready) {
      progressBar.style.width = '100%';
      statusText.textContent = ready ? 'رابط گیم‌لند برای استفادهٔ آفلاین آماده است.' : 'کش هنوز آماده نیست؛ صفحه را یک‌بار تازه‌سازی کنید.';
      checkButton.disabled = false;
    }).catch(function () {
      progressBar.style.width = '100%';
      statusText.textContent = 'بررسی حافظه انجام نشد. دوباره تلاش کنید.';
      checkButton.disabled = false;
    });
  }

  setNetworkStatus();
  window.addEventListener('online', setNetworkStatus);
  window.addEventListener('offline', setNetworkStatus);
  checkButton.addEventListener('click', checkOfflineReady);
  restartButton.addEventListener('click', function () { window.location.reload(); });

  if ('serviceWorker' in navigator) {
    window.addEventListener('load', function () {
      navigator.serviceWorker.register('./service-worker.js', { scope: './' }).then(function () {
        statusText.textContent = 'سامانه آماده است؛ ذخیره‌سازی آفلاین فعال شد.';
      }).catch(function () {
        statusText.textContent = 'ثبت حالت آفلاین ناموفق بود؛ سایت باید از HTTPS یا localhost باز شود.';
      });
    });
  }
}());
