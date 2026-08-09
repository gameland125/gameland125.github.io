const CACHE_NAME = 'gameland-safe-clean-v1';
const ASSETS = [
  './',
  './index.html',
  './about.html',
  './cache.html',
  './PSplus.manifest',
  './src/alert.mjs',
  './src/config.mjs',
  './psfree.mjs',
  './config.mjs',
  './includes/payloads/payloads.js',
  './includes/js/payloadsList.js',
  './includes/js/design.js',
  './includes/js/language.js',
  './includes/js/HENs.js',
  './includes/js/checkFw.js',
  './includes/js/autoJbRetry.js',
  './includes/js/events.js',
  './includes/js/cacheGate.js',
  './includes/js/index.js',
  './includes/js/exploits/bundle.js'
];

self.addEventListener('install', event => {
  event.waitUntil(caches.open(CACHE_NAME).then(cache => cache.addAll(ASSETS)));
  self.skipWaiting();
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys => Promise.all(
      keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k))
    ))
  );
  self.clients.claim();
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(cached => cached || fetch(event.request).catch(() => caches.match('./cache.html')))
  );
});
