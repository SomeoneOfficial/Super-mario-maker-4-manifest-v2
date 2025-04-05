const CACHE_NAME = 'Super-Mario-Maker-4-v1';
const urlsToCache = [
  '/Super-mario-maker-4-manifest/',
  '/Super-mario-maker-4-manifest/index.html',
  '/Super-mario-maker-4-manifest/manifest.json',
  '/Super-mario-maker-4-manifest/icon-192x192.png',
  '/Super-mario-maker-4-manifest/icon-512x512.png',
  '/Super-mario-maker-4-manifest/script.js'
];

// Install event
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(urlsToCache))
  );
  self.skipWaiting();
});

// Activate event
self.addEventListener('activate', event => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then(names =>
      Promise.all(names.map(name => {
        if (!cacheWhitelist.includes(name)) {
          return caches.delete(name);
        }
      }))
    )
  );
  self.clients.claim();
});

// Fetch event
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        return response || fetch(event.request)
          .then(networkResponse => {
            // Optionally cache new requests
            return caches.open(CACHE_NAME).then(cache => {
              cache.put(event.request, networkResponse.clone());
              return networkResponse;
            });
          }).catch(() => {
            // If offline and file not cached, fallback
            if (event.request.destination === 'document') {
              return caches.match('/Super-mario-maker-4-manifest/index.html');
            }
          });
      })
  );
});
