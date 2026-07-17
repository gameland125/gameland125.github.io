(function () {
  'use strict';

  var statusElement = document.getElementById('jbStatus');
  var messageElement = document.getElementById('loader-msg');
  var installButton = document.getElementById('installBtn');
  var refreshButton = document.getElementById('refreshBtn');
  var deferredInstallPrompt = null;

  function setStatus(text, state) {
    if (!statusElement) return;
    statusElement.textContent = text;
    statusElement.setAttribute('data-state', state || 'ready');
  }

  function setMessage(text) {
    if (messageElement) messageElement.textContent = text;
  }

  function updateConnectionStatus() {
    if (navigator.onLine) {
      setStatus('ONLINE', 'online');
      setMessage('برنامه آماده است و فایل‌های ضروری برای استفاده آفلاین ذخیره می‌شوند.');
    } else {
      setStatus('OFFLINE', 'offline');
      setMessage('حالت آفلاین فعال است؛ برنامه از حافظه محلی اجرا می‌شود.');
    }
  }

  window.addEventListener('online', updateConnectionStatus);
  window.addEventListener('offline', updateConnectionStatus);

  window.addEventListener('beforeinstallprompt', function (event) {
    event.preventDefault();
    deferredInstallPrompt = event;
    if (installButton) {
      installButton.hidden = false;
      installButton.disabled = false;
    }
  });

  window.addEventListener('appinstalled', function () {
    deferredInstallPrompt = null;
    if (installButton) installButton.hidden = true;
    setStatus('INSTALLED', 'online');
    setMessage('Gameland با موفقیت نصب شد.');
  });

  if (installButton) {
    installButton.addEventListener('click', function () {
      if (!deferredInstallPrompt) {
        setMessage('برای نصب، گزینه افزودن به صفحه اصلی را از منوی مرورگر انتخاب کنید.');
        return;
      }

      installButton.disabled = true;
      deferredInstallPrompt.prompt();
      deferredInstallPrompt.userChoice.then(function (choice) {
        setMessage(choice.outcome === 'accepted' ? 'درخواست نصب پذیرفته شد.' : 'نصب لغو شد.');
        deferredInstallPrompt = null;
        installButton.disabled = false;
      });
    });
  }

  if (refreshButton) {
    refreshButton.addEventListener('click', function () {
      refreshButton.disabled = true;
      setStatus('UPDATING', 'updating');
      setMessage('در حال بررسی فایل‌های برنامه…');

      var task = Promise.resolve();
      if ('serviceWorker' in navigator) {
        task = navigator.serviceWorker.getRegistration('./').then(function (registration) {
          return registration ? registration.update() : null;
        });
      }

      task.then(function () {
        setMessage('بررسی انجام شد؛ صفحه دوباره بارگذاری می‌شود…');
        window.setTimeout(function () { window.location.reload(); }, 700);
      }).catch(function () {
        setStatus('ERROR', 'error');
        setMessage('تازه‌سازی انجام نشد؛ اتصال شبکه را بررسی کنید.');
        refreshButton.disabled = false;
      });
    });
  }

  updateConnectionStatus();

  if ('serviceWorker' in navigator) {
    window.addEventListener('load', function () {
      navigator.serviceWorker.register('./service-worker.js', { scope: './' })
        .then(function (registration) {
          setMessage(navigator.onLine
            ? 'برنامه آماده است؛ پشتیبانی آفلاین فعال شد.'
            : 'حالت آفلاین فعال است؛ برنامه از حافظه محلی اجرا می‌شود.');
          return registration.update();
        })
        .catch(function () {
          setStatus('LIMITED', 'error');
          setMessage('برنامه اجرا شده است، اما ذخیره آفلاین در دسترس نیست.');
        });
    });
  } else {
    setStatus('LIMITED', 'error');
    setMessage('این مرورگر از ذخیره آفلاین استاندارد پشتیبانی نمی‌کند.');
  }
}());
