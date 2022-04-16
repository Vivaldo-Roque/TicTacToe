var GHPATH = '${./TicTacToe}';
 
var APP_PREFIX = 'TicTacToe_';

var VERSION = 'version_01';

var CACHE_NAME = APP_PREFIX + VERSION;

var URLS = [
  `${GHPATH}/`,
  `${GHPATH}/index.html`,
  `${GHPATH}/pages/about.html`,
  `${GHPATH}/pages/contact.html`,
  `${GHPATH}/css/style.css`,
  `${GHPATH}/css/prism.css`,
  `${GHPATH}/js/app.js`,
  `${GHPATH}/js/jquery-3.6.0.min.js`,
  `${GHPATH}/js/prism.js`,
  `${GHPATH}/js/navigation.js`,
  `${GHPATH}/js/ttt.js`,
  `${GHPATH}/imgs/diagram.png`,
  `${GHPATH}/imgs/avatar.png`,
  `${GHPATH}/sound/pencil_o.mp3`,
  `${GHPATH}/sound/pencil_x.mp3`
]

// Respond with cached resources
self.addEventListener('fetch', function (e) {
  console.log('fetch request : ' + e.request.url)
  e.respondWith(
    caches.match(e.request).then(function (request) {
      if (request) { // if cache is available, respond with cache
        console.log('responding with cache : ' + e.request.url)
        return request
      } else {       // if there are no cache, try fetching request
        console.log('file is not cached, fetching : ' + e.request.url)
        return fetch(e.request)
      }

      // You can omit if/else for console.log & put one line below like this too.
      // return request || fetch(e.request)
    })
  )
})

// Cache resources
self.addEventListener('install', function (e) {
  e.waitUntil(
    caches.open(CACHE_NAME).then(function (cache) {
      console.log('installing cache : ' + CACHE_NAME)
      return cache.addAll(URLS)
    })
  )
})

// Delete outdated caches
self.addEventListener('activate', function (e) {
  e.waitUntil(
    caches.keys().then(function (keyList) {
      // `keyList` contains all cache names under your username.github.io
      // filter out ones that has this app prefix to create white list
      var cacheWhitelist = keyList.filter(function (key) {
        return key.indexOf(APP_PREFIX)
      })
      // add current cache name to white list
      cacheWhitelist.push(CACHE_NAME)

      return Promise.all(keyList.map(function (key, i) {
        if (cacheWhitelist.indexOf(key) === -1) {
          console.log('deleting cache : ' + keyList[i] )
          return caches.delete(keyList[i])
        }
      }))
    })
  )
})