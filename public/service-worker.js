const CACHE_NAME = 'my-pwa-cache-v1';
const urlsToCache = [
   '/manifest.json',
   '/icon-192.png',
   '/icon-512.png',
   '/offline.html',
];

this.addEventListener('install', (event) => {
   event.waitUntil(
      caches.open(CACHE_NAME).then((cache) => cache.addAll(urlsToCache))
   );
});

this.addEventListener('fetch', (event) => {
   if (event.request.mode === 'navigate') {
      event.respondWith(
         fetch(event.request)
            .then((response) => {
               return response;
            })
            .catch(() => {
               return caches.match('/offline.html');
            })
      );
   } else {
      event.respondWith(
         caches
            .match(event.request)
            .then((response) => response || fetch(event.request))
      );
   }
});
