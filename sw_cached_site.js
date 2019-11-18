const cacheName = 'v1';

self.addEventListener('install', event => {
    console.log('Service worker: Installed')
})

self.addEventListener('activate', event => {
    console.log('Service worker: Activated')

    // Remove unwanted caches
    event
    .waitUntil(
        caches
            .keys()
            .then(cacheNames => {
                return Promise.all(
                    cacheNames.map(cache => {
                        if (cache !== cacheName) {
                            console.log('Service worker: Clearing old caches')

                            return caches.delete(cache)
                        }
                    })
                )
            })
    )
})

self.addEventListener('fetch', event => {
    console.log('Service worker: fetched')

    event
        .respondWith(
            fetch(event.request)
                .then(res => {
                    // Make copy/clone of response
                    const resClone = res.clone();

                    caches
                        .open(cacheName)
                        .then(cache => {
                            cache.put(event.request, resClone)
                        })
                    return res;
                })
                .catch(err => {
                    caches.match(event.request)
                        .then(res => res)
                })
        )
})
