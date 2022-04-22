window.addEventListener("load", () => {

  if (navigator.serviceWorker) {
    navigator.serviceWorker.register ('/TicTacToe/js/serviceWorker.js', {scope: '/TicTacToe/'})
    .then(res => console.log("service worker registered"))
    .catch(err => console.log("service worker not registered", err))
  }

});