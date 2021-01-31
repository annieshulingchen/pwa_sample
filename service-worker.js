var cacheName = 'helloPWA-v1';
const offlineUrl = 'offline-page.html';

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(cacheName)
    .then(cache => cache.addAll([
      './js/script.js',
      './images/hello.png'
    ]))
  );
});

// self.addEventListener('fetch', function(event) {
//   event.respondWith(
//     caches.match(event.request)
//     .then(function(response) {
//       if (response) {
//         return response;
//       }
//       return fetch(event.request);
//     })
//   );
// });

self.addEventListener('fetch', function(event) {
  event.respondWith(
    caches.match(event.request)
    .then(function(response) {
      if (response) {
        return response;
      }

      var fetchRequest = event.request.clone();

      // Cache First !!
      return fetch(fetchRequest).then(
        function(fetchResponse) {
          if(!fetchResponse || fetchResponse.status !== 200) {
            return fetchResponse;
          }

          var responseToCache = fetchResponse.clone();

          caches.open(cacheName)
          .then(function(cache) {
            cache.put(event.request, responseToCache);
          });

          return fetchResponse;
        }
      ).catch(error => {
        // Check if the user is offline first and is trying to navigate to a web page
        if (event.request.method === 'GET' && event.request.headers.get('accept').includes('text/html')) {
        // Return the offline page
        return caches.match(offlineUrl);
      }
      });
    })
  );
}
