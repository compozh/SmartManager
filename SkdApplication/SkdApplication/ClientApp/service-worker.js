var cacheName = 'SkdCach3';
var dataCacheusersPhoto = 'usersPhoto3';
var avalaible = [cacheName, dataCacheusersPhoto];
var staticFiles=['/skd/',
'/skd/dist/main.js',
'/skd/dist/site.css',
'/skd/dist/vendor.js',
'/skd/dist/vendor-manifest.json',
'https://cdn.jsdelivr.net/npm/vuetify/dist/vuetify.min.css',
'https://fonts.googleapis.com/css?family=Material+Icons',
'https://fonts.googleapis.com/css?family=Roboto:100,300,400,500,700,900%7CRoboto+Mono:500'
]
self.addEventListener('install', function(e) {
  e.waitUntil(
    caches.open(cacheName).then(function(cache) {
      return cache.addAll(staticFiles);
    })
  );
});

self.addEventListener('activate', function(e) {
  e.waitUntil(
    caches.keys().then(function(keyList) {
      return Promise.all(keyList.filter(function(key) {
          return avalaible.indexOf(key) == -1 
        }).map(function(key){
          console.log("cashe delated = "+ key)
          return caches.delete(key)
        }));
    })
  );
});

self.addEventListener('fetch', function(e) {
  var dataUrl = 'https://m.it.ua/ws/GetFile.ashx';
  var cacheName1 = ""
  if (e.request.url.indexOf(dataUrl)>-1){
    debugger
    cacheName1=dataCacheusersPhoto
  }
    else if(staticFiles.filter(function(file){
      return e.request.url.indexOf(file)>-1
    })){
      cacheName1=cacheName;
    } 
  if(e.request.url!="https://m.it.ua/skd/api/SkdApi/GetUsers"){
  e.respondWith(
      caches.match(e.request).then(function(response) {
        return response || fetch(e.request).then(function(response){
          caches.open(cacheName1).then(function(cache) {
             cache.put(e.request.url, response.clone());
              return response;
          }); 
        });
      })
      .catch(function(){ e.respondWith(
      fetch(e.request)
    );})
    );
  }
});