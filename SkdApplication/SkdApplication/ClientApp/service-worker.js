var cacheName = 'SkdCach8';
var dataCacheusersPhoto = 'usersPhoto8';
var avalaible = [cacheName, dataCacheusersPhoto];
var staticFiles = ['/skd/',
	'/skd/dist/main.js',
	'/skd/dist/site.css',
	'/skd/dist/vendor.js',
	'/skd/dist/vendor-manifest.json',
	'https://cdn.jsdelivr.net/npm/vuetify/dist/vuetify.min.css',
	'https://fonts.googleapis.com/css?family=Material+Icons',
	'https://fonts.googleapis.com/css?family=Roboto:100,300,400,500,700,900%7CRoboto+Mono:500'
]
self.addEventListener('install', function (e) {
	e.waitUntil(
		caches.open(cacheName).then(function (cache) {
			return cache.addAll(staticFiles);
		})
	);
});

self.addEventListener('activate', function (e) {
	e.waitUntil(
		caches.keys().then(function (keyList) {
			return Promise.all(keyList.filter(function (key) {
				return avalaible.indexOf(key) == -1
			}).map(function (key) {
				return caches.delete(key)
			}));
		})
	);
});

self.addEventListener('fetch', function (e) {

	if (!getCashName(e.request.url)) {
		e.respondWith(
			fetch(e.request)
		);
		return
	}
	e.respondWith(
		caches.match(e.request).then(function (resp) {
			return resp || fetch(e.request).then(function (response) {

				caches.open(getCashName(e.request.url)).then(function (cache) {
					if (getCashName(e.request.url)) {
						cache.put(e.request, response);
					}
				});
				return response.clone();
			});
		})
	);
});

checkCash = function (url) {
		return (staticFiles.some(function (file) {
			return url.endsWith(file)
		}))
}

getCashName = function (url) {
	var dataUrl = '/ws/GetFile.ashx';
	if (url.indexOf(dataUrl) > -1) {
		return dataCacheusersPhoto
	} else if (checkCash(url)) {
		return cacheName;
	}
}
