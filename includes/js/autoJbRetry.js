(function () {
  'use strict';

  if (typeof window.autoJailbreak === 'undefined') {
    window.autoJailbreak = false;
  }

  if (typeof window.autoJbInterval === 'undefined') {
    window.autoJbInterval = 0;
  }

  function persist(enabled) {
    try {
      localStorage.setItem('autoJbRetry', String(!!enabled));
    } catch (e) {}
  }

  window.setAutoJbRetry = function (enabled) {
    window.autoJailbreak = !!enabled;
    persist(window.autoJailbreak);
    return window.autoJailbreak;
  };

  window.loadSettings = function () {
    try {
      var saved = localStorage.getItem('autoJbRetry');
      if (saved !== null) {
        window.autoJailbreak = saved === 'true';
      }
    } catch (e) {}

    var checkbox = document.getElementById('autoJbRetry');
    if (checkbox) {
      checkbox.checked = !!window.autoJailbreak;
    }
  };
})();
