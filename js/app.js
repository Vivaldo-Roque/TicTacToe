window.addEventListener("load", () => {
  if (navigator.serviceWorker) {
    navigator.serviceWorker.register ('/tictactoe/serviceWorker.js', {scope: '/tictactoe/'})
    .then(res => console.log("service worker registered"))
    .catch(err => console.log("service worker not registered", err))
  }
});