/* eslint-disable no-undef */
/* eslint-disable no-console */

const BASE_URL = self.registration.scope
console.log(`Service Worker registration scope: ${BASE_URL}`)

self.__precacheManifest = [].concat(self.__precacheManifest || [])
//workbox.precaching.suppressWarnings();
workbox.precaching.precacheAndRoute(self.__precacheManifest, {})

const baseUrlCacheKey = workbox.precaching.getCacheKeyForURL ? workbox.precaching.getCacheKeyForURL(BASE_URL) : null

workbox.routing.registerNavigationRoute(baseUrlCacheKey ? baseUrlCacheKey : `${BASE_URL}index.html`)

workbox.routing.setCatchHandler(({ event }) => {
  switch (event.request.destination) {
    case 'document':
      return caches.match(baseUrlCacheKey ? baseUrlCacheKey : `${BASE_URL}index.html`)
    default:
      return Response.error()
  }
})

const showNotification = (storableRequestArray) => {
  if (Notification
    && Notification.permission === 'granted'
    && storableRequestArray.length
    && storableRequestArray.some(value => !value.error)) {
    self.registration.showNotification('Background sync success!', {
      body: 'Values transferred: '
        + storableRequestArray.filter(value => !value.error).length
    })
  }
}

const queue = new workbox.backgroundSync.Queue('setInspections', {
  maxRetentionTime: 5 * 24 * 60, // Retry for max of 5 Days
  callbacks: {
    queueDidReplay: showNotification
  }
})

self.addEventListener('message', (event) => {
  if (event.data === 'replayRequests') {
    queue.replayRequests()
  }
})

workbox.routing.registerRoute(
  new RegExp('(.*)/ws/GetFile.ashx(.*)'),
  new workbox.strategies.CacheFirst({
    cacheName: 'eam-files',
  })
)

workbox.routing.registerRoute(
  new RegExp('/img/.*.svg'),
  new workbox.strategies.CacheFirst({
    cacheName: 'eam-images-cache',
  })
)

workbox.routing.registerRoute(
  new RegExp('(.*)/ws/webcalc/Execute'),
  workbox.strategies.networkOnly({
    cacheName: 'api',
    plugins: [{
      fetchDidFail: async ({ request }) => {
        await queue.addRequest(request)
      },
    }]
  }),
  'POST'
)

workbox.routing.registerRoute(
  new RegExp('https://fonts.(?:googleapis|gstatic).com/(.*)'),
  workbox.strategies.cacheFirst({
    cacheName: 'googleapis',
    plugins: [
      new workbox.expiration.Plugin({
        maxEntries: 30,
      }),
    ],
  }),
)

self.addEventListener('install', function () {
  self.skipWaiting()  
})

self.addEventListener('activate', event => {
  event.waitUntil(self.clients.claim())
  self.clients.matchAll().then((clients) => {
    clients.forEach((client) => client.postMessage('reload-window'))
  })
})

if (workbox.precaching.cleanupOutdatedCaches) {
  workbox.precaching.cleanupOutdatedCaches()
}