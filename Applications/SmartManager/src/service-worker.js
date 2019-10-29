/**
 * Welcome to your Workbox-powered service worker!
 *
 * You'll need to register this file in your web app and you should
 * disable HTTP caching for this file too.
 * See https://goo.gl/nhQhGp
 *
 * The rest of the code is auto-generated. Please don't update this file
 * directly; instead, make changes to your Workbox build configuration
 * and re-run your build process.
 * See https://goo.gl/2aRDsh
 */

importScripts("https://storage.googleapis.com/workbox-cdn/releases/3.6.3/workbox-sw.js")
importScripts('https://cdnjs.cloudflare.com/ajax/libs/crypto-js/3.1.2/rollups/md5.js')
importScripts('https://cdn.jsdelivr.net/npm/idb-keyval@3/dist/idb-keyval-iife.min.js')

importScripts("/webapps/SmartManager/precache-manifest.abf9f663b20e92853fbd9f5e993a47f3.js")

workbox.core.setCacheNameDetails({prefix: "webapp"});

// Init indexedDB using idb-keyval, https://github.com/jakearchibald/idb-keyval
const store = new idbKeyval.Store('GraphQL-Cache', 'SmResponses');

if (workbox) {
  console.log(`Workbox is loaded`);
} else {
  console.log(`Workbox didn't load`);
}
/**
 * The workboxSW.precacheAndRoute() method efficiently caches and responds to
 * requests for URLs in the manifest.
 * See https://goo.gl/S9QRab
 */
self.__precacheManifest = [].concat(self.__precacheManifest || []);
workbox.precaching.suppressWarnings();
workbox.precaching.precacheAndRoute(self.__precacheManifest, {});

workbox.skipWaiting()

workbox.routing.registerRoute(/\/webapps\/SmartManager\//, workbox.strategies.networkFirst(), 'GET');

workbox.routing.registerRoute(
  /\/GraphQlServer\/api\//,
  async ({event}) => {
    return staleWhileRevalidate(event);
  },
  'POST'
);

self.addEventListener('fetch', async event => {
  if (event.request.method === 'POST') {
    console.log(event.requestl)
    event.responseWith(staleWhileRevalidate(event))
  }
})

async function staleWhileRevalidate(event) {

  let cachedResponse = await getCache(event.request.clone())
  let fetchPromise = fetch(event.request.clone())
    .then(response => {
      setCache(event.request.clone(), response.clone())
      return response
    })
    .catch((err) => {
      console.error(err)
    });
  return cachedResponse ? Promise.resolve(cachedResponse) : fetchPromise
}

async function serializeResponse(response) {
  let serializedHeaders = {};
  for (let entry of response.headers.entries()) {
    serializedHeaders[entry[0]] = entry[1]
  }
  let serialized = {
    headers: serializedHeaders,
    status: response.status,
    statusText: response.statusText
  };
  serialized.body = await response.json()
  return serialized;
}

async function setCache(request, response) {
  try {
    const id = await getPostKey(request)
    const entry = {
      query: await request.json(),
      response: await serializeResponse(response),
      timestamp: Date.now()
    }
    idbKeyval.set(id, entry, store);
  } catch (error) {
    console.log(error.message)
  }
}

async function getCache(request) {
  try {
    const id = await getPostKey(request)
    data = await idbKeyval.get(id, store);
    if (!data) return null;

    // Check cache max age.
    let cacheControl = request.headers.get('Cache-Control');
    let maxAge = cacheControl ? parseInt(cacheControl.split('=')[1]) : 3600;
    if (Date.now() - data.timestamp > maxAge * 1000) {
      console.log(`Cache expired. Load from API endpoint.`);
      return null;
    }

    console.log(`Load response from cache.`);
    return new Response(JSON.stringify(data.response.body), data.response);
  } catch (err) {
    return null;
  }
}

async function getPostKey(request) {
  try {
    const req = await request.clone().json()
    const query = req.query
    const variables = JSON.stringify(req.variables)
    const key = query + variables
    return CryptoJS.MD5(key).toString()
  } catch (error) {
    console.log(error.message)
  }
}