const ticTacToe = "Tic Tac Toe"
const assets = [
  "/TicTacToe/",
  "/TicTacToe/index.html",
  "/TicTacToe/pages/about.html",
  "/TicTacToe/pages/contact.html",
  "/TicTacToe/css/style.css",
  "/TicTacToe/css/prism.css",
  "/TicTacToe/js/app.js",
  "/TicTacToe/js/jquery-3.6.0.min.js",
  "/TicTacToe/js/prism.js",
  "/TicTacToe/js/navigation.js",
  "/TicTacToe/js/ttt.js",
  "/TicTacToe/imgs/diagram.png",
  "/TicTacToe/imgs/avatar.png",
  "/TicTacToe/sound/pencil_o.mp3",
  "/TicTacToe/sound/pencil_x.mp3"
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