const ui = {
  jbStatus: document.getElementById('jbStatus'),
  modeSelect: document.getElementById('modeSelect'),
  langSelect: document.getElementById('langSelect'),
  startBtn: document.getElementById('startBtn'),
  retryBtn: document.getElementById('retryBtn'),
  loaderBox: document.getElementById('loaderBox'),
  loaderMsg: document.getElementById('loader-msg'),
  body: document.body
};

const state = {
  mode: localStorage.getItem('gamelandMode') || 'classic',
  lang: localStorage.getItem('gamelandLang') || 'fa'
};

const texts = {
  fa: {
    ready: 'آماده',
    loading: 'در حال بارگذاری...',
    success: 'بارگذاری با موفقیت انجام شد',
    failure: 'خطا در بارگذاری',
    retry: 'بازآغاز'
  },
  en: {
    ready: 'Ready',
    loading: 'Loading...',
    success: 'Loaded successfully',
    failure: 'Load failed',
    retry: 'Restart'
  }
};

function applyMode(mode) {
  state.mode = mode;
  localStorage.setItem('gamelandMode', mode);
  ui.body.dataset.mode = mode;
}

function applyLanguage(lang) {
  state.lang = lang;
  localStorage.setItem('gamelandLang', lang);
  ui.body.lang = lang;
  ui.jbStatus.textContent = texts[lang].ready;
  ui.loaderMsg.textContent = texts[lang].loading;
  ui.retryBtn.textContent = texts[lang].retry;
}

function showLoader() {
  ui.loaderBox.hidden = false;
}

function hideLoader() {
  ui.loaderBox.hidden = true;
}

function simulateStart() {
  ui.jbStatus.textContent = texts[state.lang].loading;
  showLoader();
  ui.loaderMsg.textContent = texts[state.lang].loading;

  window.setTimeout(() => {
    ui.loaderMsg.textContent = texts[state.lang].success;
    ui.jbStatus.textContent = texts[state.lang].success;

    window.setTimeout(() => {
      hideLoader();
      ui.jbStatus.textContent = texts[state.lang].ready;
    }, 1200);
  }, 1800);
}

function restartApp() {
  localStorage.removeItem('gamelandMode');
  localStorage.removeItem('gamelandLang');
  window.location.reload();
}

ui.modeSelect.value = state.mode;
ui.langSelect.value = state.lang;

applyMode(state.mode);
applyLanguage(state.lang);

ui.modeSelect.addEventListener('change', (e) => {
  applyMode(e.target.value);
});

ui.langSelect.addEventListener('change', (e) => {
  applyLanguage(e.target.value);
});

ui.startBtn.addEventListener('click', simulateStart);
ui.retryBtn.addEventListener('click', restartApp);

if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('./service-worker.js').catch(() => {
    ui.jbStatus.textContent = state.lang === 'fa'
      ? 'ثبت Service Worker ناموفق بود'
      : 'Service Worker registration failed';
  });
}
