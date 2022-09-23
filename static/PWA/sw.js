let cacheName = 'TIMEISAPPCACHE';
let filesToCache = [
    '/css/bulma.css',
    '/css/bulma-rtl.css',
    '/css/mycss.css',
];
/* Start the service worker and cache all the app's content */
self.addEventListener('install', function (e) {
    e.waitUntil(
        caches.open(cacheName).then(function (cache) {
            return cache.addAll(filesToCache);
        })
    );
});

self.addEventListener('fetch', function (e) {
    e.respondWith(
        caches.match(e.request).then(function (response) {
            return response || fetch(e.request);
        })
    );
});
