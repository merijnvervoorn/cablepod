self.addEventListener('install', (event) => {
    self.skipWaiting();
});

self.addEventListener('activate', (event) => {
    event.waitUntil(self.clients.claim());
});

self.addEventListener('fetch', (event) => {
    const req = event.request;
    if (req.method !== 'GET') return;

    event.respondWith(
        caches.match(req).then(cachedResponse => {
            // If it's not in the cache, fetch it from the internet normally
            if (!cachedResponse) {
                return fetch(req);
            }

            // If it IS cached and the browser is seeking (Range Request)
            if (req.headers.has('range')) {
                return cachedResponse.blob().then(blob => {
                    const rangeHeader = req.headers.get('range');
                    const match = rangeHeader.match(/bytes=(\d+)-(?:\d+)?/);
                    if (!match) return cachedResponse;

                    const start = parseInt(match[1], 10);
                    // If no end byte is specified, send the rest of the file
                    const end = match[2] ? parseInt(match[2], 10) : blob.size - 1;
                    
                    const slicedBlob = blob.slice(start, end + 1);
                    
                    // Return a 206 Partial Content response so the player accepts the seek
                    return new Response(slicedBlob, {
                        status: 206,
                        statusText: 'Partial Content',
                        headers: {
                            'Content-Type': cachedResponse.headers.get('Content-Type') || 'audio/mpeg',
                            'Content-Range': `bytes ${start}-${end}/${blob.size}`,
                            'Content-Length': slicedBlob.size,
                            'Accept-Ranges': 'bytes'
                        }
                    });
                });
            }

            // If it's just a normal play request from the start, return the whole file
            return cachedResponse;
        })
    );
});