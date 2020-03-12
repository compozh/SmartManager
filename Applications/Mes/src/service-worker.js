/* eslint-disable no-undef */
/* eslint-disable no-console */
importScripts('https://cdnjs.cloudflare.com/ajax/libs/crypto-js/3.1.2/rollups/md5.js')
importScripts('https://cdn.jsdelivr.net/npm/idb-keyval@3/dist/idb-keyval-iife.min.js')

const BASE_URL = self.registration.scope
const queryToCache = [

]

// const store = new idbKeyval.Store('Cache', 'PostResponses')
// const queue = new idbKeyval.Store('Request-queue', 'Queue')

console.log(`Service Worker registration scope: ${BASE_URL}`)

self.__precacheManifest = [].concat(self.__precacheManifest || [])
workbox.precaching.precacheAndRoute(self.__precacheManifest, {})

const baseUrlCacheKey = workbox.precaching.getCacheKeyForURL ? workbox.precaching.getCacheKeyForURL(BASE_URL) : null

workbox.routing.registerNavigationRoute(baseUrlCacheKey ? baseUrlCacheKey : `${BASE_URL}index.html`)

self.addEventListener('install', (event) => {
  console.log(event)
  console.log('Catched: Installing')
})

self.addEventListener('activate', event => {
  event.waitUntil(self.clients.claim())
  self.clients.matchAll().then((clients) => {
    clients.forEach((client) => client.postMessage('reload-window'))
  })
})

// //TODO
// workbox.routing.registerRoute(
//   new RegExp('/authentication/user(/)?'),
//   async ({
//     event
//   }) => {
//     console.log('Catched:user request')
//     console.log(event)
//     return staleWhileRevalidate(event,false)
//   },
//   'POST'
// )

//TODO
workbox.routing.registerRoute(
  new RegExp('(.*)/ws/GetFile.ashx(.*)'),
  new workbox.strategies.CacheFirst({
    cacheName: 'images',
    plugins: [
      new workbox.expiration.Plugin({
        maxEntries: 100,
        maxAgeSeconds: 24 * 60 * 60,
      }),
      new workbox.cacheableResponse.Plugin({
        statuses: [0, 200],
      })
    ],
  })
)

//TODO
// workbox.routing.registerRoute(
//   new RegExp('/graphql(/)?'),
//   async ({
//     event
//   }) => {
//     console.log('Catched: POST gql')
//     console.log(event)
//     return handleGraphRequest(event)
//   },
//   'POST'
// )

/* FUNCTIONS */
// async function isMutation(request) {
//   try {
//     let body = await request.json()
//     let isMutation = body.query.slice(0, 8) == 'mutation'
//     return isMutation
//   } catch (error) {
//     return false
//   }
// }

// async function isCacheQuery(request) {
//   try {
//     let body = await request.json()
//     let result = false
//     queryToCache.forEach(x => {
//       if (body.query.indexOf(x) >= 0) {
//         result =  true
//       }
//     })
//     return result
//   } catch (error) {
//     return false
//   }
// }

// async function handleGraphRequest(event) {
//   try {
//     let is_c_query = await isCacheQuery(event.request.clone())
//     if (is_c_query) {
//       return staleWhileRevalidate(event, true)
//     }
//     let is_mutation = await isMutation(event.request.clone())
//     if (is_mutation) {
//       return fetch(event.request.clone()).catch( () => {
//         addToRequestQueue(event.request.clone())
//         return new Response(null, {'status': 503, 'statusText': 'No connection. Request will be sent automatically'})
//       })
//     }
//     if (!is_c_query && !is_mutation) {
//       return fetch(event.request.clone()).catch( () => {
//         return new Response(null, {'status': 503, 'statusText': 'No connection'})
//       })
//     }
//   } catch (error) {
//     console.log(error)
//     return null
//   }
// }

// async function staleWhileRevalidate(event, isGql) {
//   let cachedResponse = await getCache(event.request.clone(), isGql)
  
//   let fetchPromise = fetch(event.request.clone())
//     .then((response) => {
//       setCache(event.request.clone(), response.clone(), isGql)
      
//       return response
//     })
//     .catch((err) => {
//       console.error(err)
//     })

//   return cachedResponse ? Promise.resolve(cachedResponse) : fetchPromise
// }

// async function serializeResponse(response) {
//   try {
//     let serializedHeaders = {}
//     for (var entry of response.headers.entries()) {
//       serializedHeaders[entry[0]] = entry[1]
//     }
//     let serialized = {
//       headers: serializedHeaders,
//       status: response.status,
//       statusText: response.statusText
//     }
//     serialized.body = await response.json()
//     return serialized
//   } catch (error) {
//     console.log(error)
//   }
// }

// async function setCache(request, response, isGql) {
//   try {
//     let id = await createId(request, isGql)
//     let serialized = await serializeResponse(response)
//     var entry = {
//       response: serialized,
//       timestamp: Date.now()
//     }
//     idbKeyval.set(id, entry, store)
//   } catch (error) {
//     console.log(error)
//   }  
// }

// async function getCache(request, isGql) {
//   let data
//   try {
//     let id = await createId(request, isGql)
//     data = await idbKeyval.get(id, store)
//     if (!data) { return null }

//     let cacheControl = request.headers.get('Cache-Control')
//     let maxAge = cacheControl ? parseInt(cacheControl.split('=')[1]) : 3600
//     if (Date.now() - data.timestamp > maxAge * 1000) {
//       console.log('Cache expired. Load from API endpoint.')
//       return null
//     }

//     console.log('Load response from cache.')
//     return new Response(JSON.stringify(data.response.body), data.response)
//   } catch (err) {
//     return null
//   }
// }

// async function createId(request, graphql) {
//   try {
//     let id = ''
//     if (graphql) {
//       let body = await request.json()
//       body = JSON.stringify(body)
//       id = CryptoJS.MD5(body).toString()
//     } else {
//       id = CryptoJS.MD5(request.url).toString()
//     }
//     return id
//   } catch (error) {
//     return null
//   }
// }

// async function addToRequestQueue(request) {
//   try {
//     let id = await createId(request.clone(), true)
//     let cloned = request.clone()
//     let parsed = await cloned.json()
//     var entry = {
//       query: parsed.query,
//       variables: parsed.variables,
//       timestamp: Date.now()
//     }
//     idbKeyval.set(id, entry, queue)
//   } catch (error) {
//     console.log(error)
//   }
// }