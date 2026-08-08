
(function (global) {
  'use strict';

  const state = {
    ready: false,
    started: false,
    queue: [],
    cache: null
  };

  function getCache() {
    return global.applicationCache || null;
  }

  function isCacheBusy(cache) {
    if (!cache) return false;
    return cache.status === cache.CHECKING || cache.status === cache.DOWNLOADING;
  }

  function markReady() {
    if (state.ready) return;
    state.ready = true;

    const queue = state.queue.splice(0, state.queue.length);
    for (const fn of queue) {
      try {
        fn();
      } catch (e) {
        console.error('[cacheGate] queued task failed:', e);
      }
    }
  }

  function bindCacheEvents(cache) {
    if (!cache || state.started) return;
    state.started = true;

    const onReady = () => {
      markReady();
    };

    const onError = () => {
      // اگر cache fail شود، gate را باز می‌کنیم تا پروژه قفل نشود
      markReady();
    };

    cache.addEventListener('cached', onReady, false);
    cache.addEventListener('updateready', onReady, false);
    cache.addEventListener('error', onError, false);
    cache.addEventListener('noupdate', onReady, false);
  }

  function init() {
    state.cache = getCache();

    if (!state.cache) {
      state.ready = true;
      return true;
    }

    bindCacheEvents(state.cache);

    if (!isCacheBusy(state.cache)) {
      state.ready = true;
      return true;
    }

    return false;
  }

  function whenReady(fn) {
    if (typeof fn !== 'function') return;

    if (state.ready || !state.cache) {
      fn();
      return;
    }

    state.queue.push(fn);
  }

  function run(fn) {
    whenReady(fn);
  }

  function forceReady() {
    markReady();
  }

  global.cacheGate = {
    init,
    whenReady,
    run,
    forceReady,
    isReady: () => state.ready
  };

  // auto init
  if (global.document && global.document.readyState !== 'loading') {
    init();
  } else if (global.document) {
    global.document.addEventListener('DOMContentLoaded', init, { once: true });
  } else {
    init();
  }
})(window);
