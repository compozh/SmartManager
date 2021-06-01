importScripts('https://cdnjs.cloudflare.com/ajax/libs/crypto-js/3.1.2/rollups/md5.js')
importScripts('https://cdn.jsdelivr.net/npm/idb-keyval@3/dist/idb-keyval-iife.min.js')

workbox.core.setCacheNameDetails({ prefix: 'SmartManager' })

// Init indexedDB using idb-keyval, https://github.com/jakearchibald/idb-keyval
const store = new idbKeyval.Store('SmartManager', new Date().toLocaleDateString())

if (workbox) {
  console.log('Workbox is loaded')
} else {
  console.log('Workbox didn\'t load')
}

self.__precacheManifest = [].concat(self.__precacheManifest || [])
workbox.precaching.precacheAndRoute(self.__precacheManifest, {})

workbox.routing.registerRoute(/\/webapps\/SmartManager\//,
  new workbox.strategies.CacheFirst({
    plugins: [
      new workbox.cacheableResponse.Plugin({
        statuses: [0, 200]
      })
    ]
  })
)

workbox.routing.registerRoute(
  /\/GraphQlServer\/api\//,
  ({ event }) => postHandler(event),
  'POST'
)

self.addEventListener('fetch', event => {
  try {
    if (event.request.method === 'POST') {
      event.respondWith(postHandler(event))
    }
  } catch (error) {
    console.log(error.message)
  }
})

async function postHandler (event) {
  // Запросы связанные с авторизацией не кешируем
  if (event.request.url.includes('authentication')) {
    return await fetch(event.request.clone())
  }
  // Запросы с мутациями не кешируем
  const reqJson = await event.request.clone().json()
  if (reqJson.query.includes('mutation')) {
    return await fetch(event.request.clone())
  }
  try {
    const fetchResponse = await fetch(event.request.clone())
    await setCache(event.request.clone(), fetchResponse.clone())
    return fetchResponse
  } catch (e) {
    return await getCache(event.request.clone())
  }
}

async function serializeResponse (response) {
  const serializedHeaders = {}
  for (const entry of response.headers.entries()) {
    serializedHeaders[entry[0]] = entry[1]
  }
  const serialized = {
    headers: serializedHeaders,
    status: response.status,
    statusText: response.statusText
  }
  serialized.body = await response.json()
  return serialized
}

async function setCache (request, response) {
  try {
    const id = await getPostKey(request)
    const reqJson = await request.clone().json()
    const entry = {
      query: reqJson.query,
      response: await serializeResponse(response),
      timestamp: Date.now()
    }
    idbKeyval.set(id, entry, store)
  } catch (error) {
    console.log(error)
  }
}

async function getCache (request) {
  try {
    const id = await getPostKey(request)
    const data = await idbKeyval.get(id, store)
    if (!data) {
      return null
    }
    // Check cache max age.
    const cacheControl = request.headers.get('Cache-Control')
    const maxAge = cacheControl ? parseInt(cacheControl.split('=')[1]) : 3600
    if (Date.now() - data.timestamp > maxAge * 1000) {
      console.log('Cache expired. Load from API endpoint.')
      return null
    }
    console.log('Load response from cache.')
    return new Response(JSON.stringify(data.response.body), data.response)
  } catch (err) {
    return null
  }
}

async function getPostKey (request) {
  try {
    const userId = request.headers.get('X-User-Id')
    const reqJson = await request.clone().json()
    const query = reqJson.query
    const variables = JSON.stringify(reqJson.variables)
    const key = CryptoJS.MD5(query + variables).toString()
    return `${key}/${userId}`
  } catch (error) {
    console.log(error)
  }
}
