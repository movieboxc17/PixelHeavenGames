// Service Worker for PixelHeavenGames
const CACHE_NAME = 'pixelheavengames-v19.4';
const urlsToCache = [
  './',
  './index.html',
  './styles.css',
  './settings.css',
  './scripts.js',
  './settings.js',
  './manifest.json',
  './icon.png',
  './sounds/click.mp3',
  './Images/tic-tac-toe.jpg',
  './Images/snake.jpg',
  './Images/game3.jpg',
  './Images/game4.jpg',
  './Images/game5.jpg',
  './Images/game6.jpg',
  './Images/game7.jpg',
  './Images/game8.jpg',
  'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css'
];

// Install event - cache assets
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
  );
});

// Fetch event - serve from cache, fall back to network
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Cache hit - return response
        if (response) {
          return response;
        }
        return fetch(event.request);
      })
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', event => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

// Listen for messages from clients
self.addEventListener('message', event => {
  if (event.data && event.data.action === 'updateCache') {
    // Force update of cache
    self.skipWaiting();
    
    // Re-cache all resources
    caches.open(CACHE_NAME)
      .then(cache => {
        return cache.addAll(urlsToCache);
      });
  }
});
