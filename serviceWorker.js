const ticTacToe = "Tic Tac Toe"
const assets = [
  "/",
  "/index.html",
  "/pages/about.html",
  "/pages/contact.html",
  "/css/style.css",
  "/css/prism.css",
  "/js/app.js",
  "/js/jquery-3.6.0.min.js",
  "/js/prism.js",
  "/js/navigation.js",
  "/js/ttt.js",
  "/imgs/diagram.png",
  "/imgs/avatar.png",
  "/sound/pencil_o.mp3",
  "/sound/pencil_x.mp3"
]

self.addEventListener("install", installEvent => {
  installEvent.waitUntil(
    caches.open(ticTacToe).then(cache => {
      cache.addAll(assets)
    })
  )
})

self.addEventListener("fetch", fetchEvent => {
    fetchEvent.respondWith(
      caches.match(fetchEvent.request).then(res => {
        return res || fetch(fetchEvent.request)
      })
    )
  })