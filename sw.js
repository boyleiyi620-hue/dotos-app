// DostOS Service Worker v4.0 (iOS düzeltme + fonksiyon hataları)
const CACHE_NAME = 'dostos-v5';
const STATIC_ASSETS = [
  './',
  './index.html',
  './manifest.json?v=2',
  './icons/icon-192_v2.png',
  './icons/icon-512_v2.png',
  'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css',
  'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap'
];

// Install event – cache static assets (force reload)
self.addEventListener('install', (event) => {
  // Skip waiting immediately to activate new SW
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll([
        './',
        './index.html?v=2',
        './manifest.json?v=2',
        './icons/icon-192_v2.png',
        './icons/icon-512_v2.png'
      ]);
    }).then(() => self.skipWaiting())
  );
});

// Activate event – clean old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((name) => name !== CACHE_NAME)
          .map((name) => caches.delete(name))
      );
    }).then(() => self.clients.claim())
  );
});

// Fetch event – network first, fallback to cache
self.addEventListener('fetch', (event) => {
  // Skip non-GET requests and Firebase requests
  if (event.request.method !== 'GET') return;
  if (event.request.url.includes('firebase') || event.request.url.includes('googleapis.com/identitytoolkit')) return;

  event.respondWith(
    fetch(event.request)
      .then((response) => {
        // Cache successful responses for same-origin requests
        if (response.ok && event.request.url.startsWith(self.location.origin)) {
          const responseClone = response.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseClone);
          });
        }
        return response;
      })
      .catch(() => {
        // Fallback to cache when offline
        return caches.match(event.request).then((cached) => {
          if (cached) return cached;
          // Return index.html for navigation requests
          if (event.request.mode === 'navigate') {
            return caches.match('./index.html');
          }
        });
      })
  );
});

// SKIP_WAITING support – new SW immediately activates
self.addEventListener('message', (event) => {
  if (event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});

// Push notification support (for future Firebase integration)
self.addEventListener('push', (event) => {
  if (!event.data) return;
  const data = event.data.json();
  const options = {
    body: data.body || 'Yeni bir bildirim var!',
    icon: '/icons/icon-192_v2.png',
    badge: '/icons/icon-72_v2.png',
    vibrate: [100, 50, 100],
    data: { url: data.url || '/' },
    actions: [
      { action: 'open', title: 'Aç' },
      { action: 'close', title: 'Kapat' }
    ]
  };
  event.waitUntil(
    self.registration.showNotification(data.title || 'DostOS', options)
  );
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  if (event.action === 'open' || !event.action) {
    event.waitUntil(
      clients.openWindow(event.notification.data.url || '/')
    );
  }
});
