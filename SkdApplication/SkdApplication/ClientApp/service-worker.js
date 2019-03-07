var cacheName = 'SkdCach';
var filesToCache = [
'/',
'/dist/main.js',
'/dist/main.js.map',
'/dist/site.css',
'/dist/vendor.css',
'/dist/vendor.js',
'/dist/vendor-manifest.json'
];
var test=[];
var dataCacheusersPhoto = 'usersPhoto';
var dataUsersInformation = 'TokenUser';
var dataAllUsers = 'allUsers';
self.addEventListener('install', function(e) {
  console.log('[ServiceWorker] Install');
  e.waitUntil(
    caches.open(cacheName).then(function(cache) {
      console.log('[ServiceWorker] Caching app shell');
      return cache.addAll(['/',
      '/dist/main.js',
      '/dist/main.js.map',
      '/dist/site.css',
      '/dist/vendor.css',
      '/dist/vendor.js',
      '/dist/vendor-manifest.json']);
    })
  );
});

self.addEventListener('activate', function(e) {
  console.log('[ServiceWorker] Activate');
  e.waitUntil(
    caches.keys().then(function(keyList) {
      return Promise.all(keyList.map(function(key) {
        if (key !== cacheName && key !== dataCacheusersPhoto) {
          console.log('[ServiceWorker] Removing old cache', key);
          return caches.delete(key);
        }
      }));
    })
  );
  return self.clients.claim();
});



self.addEventListener('fetch', function(e) {
  console.log('[Service Worker] Fetch', e.request.url);
  var dataUrl = 'https://m.it.ua/ws/GetFile.ashx';
var dataUsers = '/api/SkdApi/GetUsers'
if (e.request.url.indexOf(dataUsers) > -1) {
  e.respondWith(
    caches.open(dataAllUsers).then(function(cache) {
      return fetch(e.request).then(function(response){
        cache.put(e.request.url, response.clone());
        return response;
      });
    })
  );
  }   
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
        console.log("что-то сюда приходит" + e.request)
        return response || fetch(e.request);
      })
    );
  }

});
