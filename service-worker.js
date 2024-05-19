const CACHE_NAME = 'cache_test';
// List of files which are store in cache.
let filesToCache = [
 '/',
 '/css/style.css',
 '/js/script.js'
];
self.addEventListener('install', function (evt) {
 evt.waitUntil(
 caches.open(CACHE_NAME).then(function (cache) {
 return cache.addAll(filesToCache);
 }).catch(function (err) {
 //console.error(err);
 })
 );
});

function isSuccessful(response) {
    return response &&
    response.status === 200 &&
    response.type === 'basic';
   }
   self.addEventListener('fetch', function (event) {
    event.respondWith(
        caches.match(event.request)
            .then(function (response) {
                if (response) {
                    return response; // Cache hit
                }
                return fetch(event.request.clone())
                    .then(function (response) {
                        let responseClone = response.clone(); // Clone the response immediately
                        if (!isSuccessful(responseClone)) {
                            return response;
                        }
                        caches.open(CACHE_NAME)
                            .then(function (cache) {
                                cache.put(event.request, responseClone);
                            });
                        return response;
                    }
                    );
            })
    );
});
