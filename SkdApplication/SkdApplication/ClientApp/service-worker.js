var cacheName = 'SkdCach';
var dataCacheusersPhoto = 'usersPhoto';
self.addEventListener('install', function(e) {
  e.waitUntil(
    caches.open(cacheName).then(function(cache) {
      return cache.addAll(['/',
      '/dist/main.js',
      '/dist/main.js.map',
      '/dist/site.css',
      '/dist/vendor.css',
      '/dist/vendor.js',
      '/dist/vendor-manifest.json',
      'https://cdn.jsdelivr.net/npm/vuetify/dist/vuetify.min.css',
      'https://fonts.googleapis.com/css?family=Material+Icons',
      'https://fonts.googleapis.com/css?family=Roboto:100,300,400,500,700,900%7CRoboto+Mono:500'
  ]);
    })
  );
});

self.addEventListener('activate', function(e) {
  e.waitUntil(
    caches.keys().then(function(keyList) {
      return Promise.all(keyList.map(function(key) {
        if (key !== cacheName && key !== dataCacheusersPhoto) {
          return caches.delete(key);
        }
      }));
    })
  );
  return self.clients.claim();
});

self.addEventListener('fetch', function(e) {
  var dataUrl = 'https://m.it.ua/ws/GetFile.ashx';
  if (e.request.url.indexOf(dataUrl) > -1) {
    e.respondWith(
      caches.open(dataCacheusersPhoto).then(function(cache) {
        return fetch(e.request).then(function(response){
          cache.put(e.request.url, response.clone());
          return response; 
        });
      })
    );
  } 
  else {
    e.respondWith(
      caches.match(e.request).then(function(response) {
        return response || fetch(e.request);
      })
    );
  }

});
