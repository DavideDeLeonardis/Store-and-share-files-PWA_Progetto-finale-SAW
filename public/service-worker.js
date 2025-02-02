const CACHE_NAME = 'Store-and-share files PWA';
const urlsToCache = [
   '/manifest.json',
   '/icon-192.png',
   '/icon-512.png',
   '/offline.html',
];

// Al momento dell'installazione del service worker, apriamo la cache e aggiungiamo le risorse in urlsToCache.
this.addEventListener('install', (event) =>
   event.waitUntil(
      caches.open(CACHE_NAME).then((cache) => cache.addAll(urlsToCache))
   )
);

/**
 * Intercetta tutte le richieste di rete.
 * - Se la richiesta è di tipo navigazione di pagina,
 *   tenta di recuperare la risorsa dalla rete e, in caso di errore, mostra la pagina offline.
 * - Per tutte le altre richieste, cerca prima una corrispondenza nella cache e, se non trovata,
 *   effettua il fetch dalla rete.
 */
this.addEventListener('fetch', (event) => {
   if (event.request.mode === 'navigate')
      event.respondWith(
         fetch(event.request).catch(() => caches.match('/offline.html'))
      );
   else
      event.respondWith(
         caches
            .match(event.request)
            .then((cachedResponse) => cachedResponse || fetch(event.request))
      );
});
