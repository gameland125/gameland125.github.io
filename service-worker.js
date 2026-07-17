const CACHE_NAME = 'gameland-v1';
const ASSETS = [
  './',
  './index.html',
  './style.css',
  './main.js',
  './service-worker.js',
  './manifest.webmanifest'
];

// اضافه کردن خودکار تمام فایل‌های ضروری به لیست کش
// این بخش در نسخه نهایی پوشه‌های src و includes را هم شامل می‌شود
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS);
    })
  );
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request);
    })
  );
});
