self.addEventListener('install', (event) => {
    self.skipWaiting();
});

self.addEventListener('fetch', (event) => {
    // Check if the browser is asking for a URL we have saved in our audio cache
    event.respondWith(
        caches.open('cablepod-audio').then(cache => {
            return cache.match(event.request).then(response => {
                // If we have it saved offline, serve it! Otherwise, use the network.
                return response || fetch(event.request);
            });
        })
    );
});