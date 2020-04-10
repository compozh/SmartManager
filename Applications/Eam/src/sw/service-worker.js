/* eslint-disable no-undef */
/* eslint-disable no-console */

const BASE_URL = self.registration.scope
console.log(`Service Worker registration scope: ${BASE_URL}`)

self.__precacheManifest = [].concat(self.__precacheManifest || [])
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


self.addEventListener('install', function () {
  self.skipWaiting()
})

self.addEventListener('activate', event => {
  event.waitUntil(self.clients.claim())
  self.clients.matchAll().then((clients) => {
    clients.forEach((client) => client.postMessage('reload-window'))
  })
})


try {
  importScripts('https://www.gstatic.com/firebasejs/7.2.0/firebase-app.js')
  importScripts('https://www.gstatic.com/firebasejs/7.2.0/firebase-messaging.js')

  firebase.initializeApp({
    'messagingSenderId': '821491675335' // 4. Get Firebase Configuration
  })

  self.addEventListener('push', function (e) {
    if (e.data) {
      debugger
      const message = JSON.parse(e.data.text())

      const actions = [{
        action: 'close',
        title: 'Закрыть'
      }]

      const additionalData = message.data.additional ? JSON.parse(message.data.additional) : {}

      const title = additionalData && additionalData.title
        ? additionalData.title
        : 'Уведомление IT-Enterprise'

      if (additionalData && additionalData.link) {
        actions.push({
          action: 'explore',
          title: additionalData.linkTitle || 'Открыть'
        })
      }

      const options = {
        body: message.data.alert,
        icon: `${BASE_URL}img/icons/android-chrome-192x192.png`,
        vibrate: [100, 50, 100],
        data: {
          dateOfArrival: Date.now(),
          ...additionalData
        },
        actions
      }

      e.waitUntil(
        self.registration.showNotification(title, options)
      )
    }
  })

  self.addEventListener('notificationclick', function (e) {
    var notification = e.notification
    var action = e.action

    if (action === 'explore') {
      clients.openWindow(notification.data.link)
    } else if (action !== 'close') {
      clients.openWindow(BASE_URL)
    }
    notification.close()
  })
} catch (error) {
  console.log(error)
}