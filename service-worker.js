'use strict';

const CACHE_NAME = 'gameland-shell-v1';

const APP_SHELL = [
  './',
  './index.html',
  './style.css',
  './main.js',
  './manifest.webmanifest',
  './icon-192.png',
  './icon-512.png',

  './PSFree.manifest',

  './includes/css/layouts/index.css',
  './includes/css/layouts/compact.css',
  './includes/css/colors/default.css',
  './includes/css/colors/vibrant.css',

  './includes/js/HENs.js',
  './includes/js/autoJbRetry.js',
  './includes/js/checkFw.js',
  './includes/js/design.js',
  './includes/js/events.js',
  './includes/js/index-legacy.js',
  './includes/js/index.js',
  './includes/js/language.js',
  './includes/js/payloadsList.js',
  './includes/js/exploits/bundle.js',

  './includes/js/languages/ar.js',
  './includes/js/languages/en.js',
  './includes/js/languages/es.js',
  './includes/js/languages/fa.js',
  './includes/js/languages/ru.js',
  './includes/js/languages/tr.js',
  './includes/js/languages/zh-cn.js',

  './includes/payloads/payloads.js',

  './src/alert.mjs',
  './src/config.mjs',
  './src/lapse.mjs',
  './src/psfree.mjs',
  './src/send.mjs',

  './src/module/chain.mjs',
  './src/module/int64.mjs',
  './src/module/mem.mjs',
  './src/module/memtools.mjs',
  './src/module/offset.mjs',
  './src/module/rw.mjs',
  './src/module/utils.mjs',
  './src/module/view.mjs',

  './src/lapse/ps4/900.mjs',
  './src/lapse/ps4/903.mjs',
  './src/rop/ps4/900.mjs'
];

self.addEventListener('install', function (event) {
  event.waitUntil(
    caches.open(CACHE_NAME).then(function (cache) {
      return cache.addAll(APP_SHELL);
    }).then(function () {
      return self.skipWaiting();
    })
  );
});

self.addEventListener('activate', function (event) {
  event.waitUntil(
    caches.keys().then(function (keyList) {
      return Promise.all(
        keyList.map(function (key) {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      );
    }).then(function () {
      return self.clients.claim();
    })
  );
});

self.addEventListener('fetch', function (event) {
  if (event.request.method !== 'GET') return;

  event.respondWith(
    caches.match(event.request).then(function (cached) {
      if (cached) return cached;

      return fetch(event.request).then(function (response) {
        if (
          response &&
          response.status === 200 &&
          response.type === 'basic'
        ) {
          const responseClone = response.clone();
          caches.open(CACHE_NAME).then(function (cache) {
            cache.put(event.request, responseClone);
          });
        }
        return response;
      }).catch(function () {
        if (event.request.mode === 'navigate') {
          return caches.match('./index.html');
        }
        return new Response('', { status: 504, statusText: 'Offline' });
      });
    })
  );
});
