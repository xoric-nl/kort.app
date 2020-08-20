self.addEventListener('install', (event) => {
    if (event.request) {
        if (event.request.cache === 'only-if-cached' && event.request.mode !== 'same-origin') {
            return;
        }
    }
    // console.log('👷', 'install', event);
    self.skipWaiting();
});

self.addEventListener('activate', (event) => {
    if (event.request) {
        if (event.request.cache === 'only-if-cached' && event.request.mode !== 'same-origin') {
            return;
        }
    }
    // console.log('👷', 'activate', event);
    return self.clients.claim();
});

self.addEventListener('fetch', function(event) {
    if (event.request) {
        if (event.request.cache === 'only-if-cached' && event.request.mode !== 'same-origin') {
            return;
        }
    }
    // console.log('👷', 'fetch', event);
    event.respondWith(fetch(event.request));
});