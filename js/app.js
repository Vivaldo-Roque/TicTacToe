window.addEventListener("load", () => {

  main();

});

function main(){
  var myScope = "/TicTacToe/";
  //var myScope = "/";

  var deferredPrompt;
  var installButton;

  installButton = document.getElementById("install-button");

  if (navigator.serviceWorker) {
    navigator.serviceWorker.register(`${myScope}serviceWorker.js`, { scope: `${myScope}` })
      .then(res => console.log("service worker registered"))
      .catch(err => console.log("service worker not registered", err))
  }

  window.addEventListener('beforeinstallprompt', function (e) {
    console.log('before install prompt!');
    e.preventDefault();
    deferredPrompt = e;

    installButton.style.display = "block";
  });

  window.addEventListener('appinstalled', () => {
    console.log('app installed!');
    deferredPrompt.preventDefault();
    hideButton();
    deferredPrompt = null;

  });

  installButton.addEventListener('click', async () => {
    if (deferredPrompt !== null) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        hideButton();
        deferredPrompt = null;
      }
    }
  });

  function hideButton() {
    installButton.remove();
  }
};