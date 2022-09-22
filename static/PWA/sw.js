let cacheName = 'TIMEISAPPCACHE';
// @TODO: queste vanno servite da flask con route?
let filesToCache = [
    'static/css/bulma.css',
    '/css/bulma-rtl.css',
    '/css/mycss.css',
    'app.js'
];
/* Start the service worker and cache all of the app's content */
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
