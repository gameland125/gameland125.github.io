(function () {
  'use strict';

  window.checkCacheAndRun = function (runner) {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('./sw.js').catch(function () {});
    }
    if (typeof runner === 'function') {
      runner();
    }
  };
})();
