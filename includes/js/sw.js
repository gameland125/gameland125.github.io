const CACHE_NAME = 'gameland-safe-clean-v1';
const ASSETS = [
  './',
  './index.html',
  './about.html',
  './cache.html',
  './PSFree.manifest',
  './includes/css/colors/default.css',
  './includes/css/layouts/index.css',
  './includes/js/index.js'
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
