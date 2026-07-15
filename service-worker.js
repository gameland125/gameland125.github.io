const CACHE_NAME = 'gameland-v1';

const APP_SHELL = [
  './',
  './index.html',
  './manifest.webmanifest',
  './style.css',
  './main.js',
  './icon-192.png',
  './icon-512.png',
  './hen/',

  './includes/css/colors/default.css',
  './includes/css/colors/vibrant.css',
  './includes/css/layouts/compact.css',
  './includes/css/layouts/index.css',

  './includes/js/HENs.js',
  './includes/js/autoJbRetry.js',
  './includes/js/checkFw.js',
  './includes/js/design.js',
  './includes/js/events.js',
  './includes/js/exploits/bundle.js',
  './includes/js/index-legacy.js',
  './includes/js/index.js',
  './includes/js/language.js',
  './includes/js/languages/ar.js',
  './includes/js/languages/en.js',
  './includes/js/languages/es.js',
  './includes/js/languages/fa.js',
  './includes/js/languages/ru.js',
  './includes/js/languages/tr.js',
  './includes/js/languages/zh-cn.js',
  './includes/js/payloadsList.js',
  './includes/payloads/payloads.js',

  './src/alert.mjs',
  './src/config.mjs',
  './src/lapse.mjs',
  './src/lapse/ps4/900.mjs',
  './src/lapse/ps4/903.mjs',
  './src/module/chain.mjs',
  './src/module/int64.mjs',
  './src/module/mem.mjs',
  './src/module/memtools.mjs',
  './src/module/offset.mjs',
  './src/module/rw.mjs',
  './src/module/utils.mjs',
  './src/module/view.mjs',
  './src/psfree.mjs',
  './src/rop/ps4/900.mjs',
  './src/send.mjs'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(APP_SHELL))
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.map((key) => {
        if (key !== CACHE_NAME) return caches.delete(key);
      }))
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  const req = event.request;

  if (req.method !== 'GET') return;

  event.respondWith(
    caches.match(req).then((cached) => {
      if (cached) return cached;

      return fetch(req)
        .then((res) => {
          const clone = res.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(req, clone));
          return res;
        })
        .catch(() => caches.match('./index.html'));
    })
  );
});
