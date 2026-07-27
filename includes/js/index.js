(function () {
  const status = document.getElementById('cacheStatus');
  const setStatus = (msg) => { if (status) status.textContent = msg; };

  function updateOnlineState() {
    setStatus(navigator.onLine ? 'آنلاین - پوسته آماده است' : 'آفلاین - پوسته در دسترس است');
  }

  window.addEventListener('online', updateOnlineState);
  window.addEventListener('offline', updateOnlineState);
  updateOnlineState();

  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('./includes/js/sw.js')
      .then(() => setStatus((navigator.onLine ? 'آنلاین' : 'آفلاین') + ' - کش PWA فعال شد'))
      .catch(() => setStatus('پوسته لود شد، اما ثبت Service Worker ناموفق بود'));
  } else {
    setStatus('مرورگر از Service Worker پشتیبانی نمی‌کند');
  }
})();
