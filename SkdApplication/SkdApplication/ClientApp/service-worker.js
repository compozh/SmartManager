var cacheName = 'SkdCach';
var dataCacheusersPhoto = 'usersPhoto';
self.addEventListener('install', function(e) {
  e.waitUntil(
    caches.open(cacheName).then(function(cache) {
      return cache.addAll(['/skd/',
      '/skd/dist/main.js',
      '/skd/dist/main.js.map',
      '/skd/dist/site.css',
      '/skd/dist/vendor.js',
      '/skd/dist/vendor-manifest.json',
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
      return Promise.all(keyList.filter(function(key) {
          return key.startsWith('/dist') && key !=cacheName
        }).map(function(key){
          return caches.delete(key)
        }));
    })
  );
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
