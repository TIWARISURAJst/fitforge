/* ============================================================
   FitForge — Service Worker
   Offline-first caching with hybrid strategies
   ============================================================ */

const CACHE_NAME = 'fitforge-cache-v6';
const STATIC_ASSETS = [
  './',
  'index.html',
  'css/styles.css',
  'manifest.json',
  'icons/icon-192.png',
  'icons/icon-512.png',
  'js/app.js',
  'js/db.js',
  'js/icons.js',
  'js/router.js',
  'js/store.js',
  'js/data/exerciseDatabase.js',
  'js/data/foodDatabase.js',
  'js/services/bodyFatEstimator.js',
  'js/services/dataExport.js',
  'js/services/macroCalculator.js',
  'js/services/notifications.js',
  'js/ml/adaptiveCoach.js',
  'js/ml/foodClassifier.js',
  'js/ml/poseEstimator.js',
  'js/ml/trendPredictor.js',
  'js/views/Dashboard.js',
  'js/views/MealTracker.js',
  'js/views/WorkoutLogger.js',
  'js/views/BodyMetrics.js',
  'js/views/SleepTracker.js',
  'js/views/Hydration.js',
  'js/views/Schedule.js',
  'js/views/ProgressPhotos.js',
  'js/views/Settings.js',
  'js/views/Onboarding.js'
];

// Install: Cache only essential HTML/CSS
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(STATIC_ASSETS))
      .then(() => self.skipWaiting())
  );
});

// Activate: Clean old caches
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys()
      .then(keys => Promise.all(
        keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k))
      ))
      .then(() => self.clients.claim())
  );
});

// Fetch: Network-first for JS (always fresh), cache-first for CSS/images
self.addEventListener('fetch', event => {
  const { request } = event;

  // Skip non-GET requests
  if (request.method !== 'GET') return;

  // Skip external requests (CDN libraries)
  if (!request.url.startsWith(self.location.origin)) return;

  // ALWAYS network-first for JavaScript modules — never serve stale JS
  if (request.url.match(/\.js(\?.*)?$/)) {
    event.respondWith(
      fetch(request)
        .then(response => {
          if (response.ok) {
            const clone = response.clone();
            caches.open(CACHE_NAME).then(cache => cache.put(request, clone));
          }
          return response;
        })
        .catch(() => caches.match(request))
    );
    return;
  }

  // Cache-first for static assets (CSS, images, fonts)
  if (request.url.match(/\.(css|png|jpg|svg|woff2|json)$/)) {
    event.respondWith(
      caches.match(request).then(cached => {
        if (cached) return cached;
        return fetch(request).then(response => {
          if (response.ok) {
            const clone = response.clone();
            caches.open(CACHE_NAME).then(cache => cache.put(request, clone));
          }
          return response;
        });
      })
    );
    return;
  }

  // Network-first for HTML pages
  event.respondWith(
    fetch(request)
      .then(response => {
        if (response.ok) {
          const clone = response.clone();
          caches.open(CACHE_NAME).then(cache => cache.put(request, clone));
        }
        return response;
      })
      .catch(() => caches.match(request).then(cached => cached || caches.match('index.html')))
  );
});

