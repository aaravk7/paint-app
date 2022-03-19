let cacheData = "appV1";
this.addEventListener("install", (event) => {
    event.waitUntil(
        caches.open(cacheData).then((cache) => {
            cache.addAll([
                '/static/js/main.chunk.js',
                '/static/js/0.chunk.js',
                '/static/js/bundle.js',
                '/index.html',
                '/',
                '/login',
                '/paint',
                '/favicon.ico',
                '/maskable.png',
                '/192.png',
                '/manifest.json',
                'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.1.0/css/all.min.css',
                'https://fonts.googleapis.com/css2?family=Poppins:wght@100;300;400;500;600;700;900&display=swap',
            ])
        })
    )
})

this.addEventListener("fetch", (event) => {
    if (navigator.onLine) {
        return;
    }
    event.respondWith(
        caches.match(event.request).then((resp) => {
            if (resp) {
                return resp;
            }
        })
    )
})