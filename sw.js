const CACHE_NAME = 'POEM_CACHE';
const URLS_TO_CACHE = ['/', '/src.main.jsx', '/src/App.css', 'index.html'];

// install event
self.addEventListener('install', (event) => {
    console.log("Starting Service worker");
   event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
        console.log("Caching files");
        cache.addAll(URLS_TO_CACHE);
    })
   )
})

//fetch event
self.addEventListener('fetch', (event) => {
    if(event.request.url.includes('poetrydb.org')){
      event.respondWith(caches.open(CACHE_NAME).then(cache => {
        return fetch(event.request)
        .then(res => {
            cache.put(event.request, res.clone());
            return res;
        })
        .catch(()=>caches.match(event.request))
      }))
    }
    else{ 
        event.respondWith(caches.match(event.request).then(res => {
        return res || fetch(event.request)
        }))
    }
})