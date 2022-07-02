var selectedLanguage;

var languages;

window.addEventListener("load", () => {

  var xmlhttp = new XMLHttpRequest();
  var url = "./languages.json";
  var url1 = "../languages.json";

  xmlhttp.onreadystatechange = function () {
    if (this.readyState == 4 && this.status == 200) {
      languages = JSON.parse(this.responseText);

      selectedLanguage = localStorage.getItem("lang") ?? navigator.languages.lastChild;

      setLanguage(selectedLanguage);
      initList();
      //refreshLabels();
    }
  };

  xmlhttp.open("GET", url1, true);
  xmlhttp.send();

  sw();

});

function sw() {
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

function setLanguage(langcode) {

  // check if language code <langcode> does not exist in available translations in json file
  // For example, available translated texts in json are 'en' and 'fr', but client language is 'es'
  if (!languages.hasOwnProperty(langcode)) {
    // doesn't exist so default to the first available language, i.e. the top-most language in json file

    // NOTE: the order of properties in a JSON object are not *guaranteed* to be the same as loading time,
    // however in practice all browsers do return them in order
    for (var key in languages) {
      if (languages.hasOwnProperty(key)) {
        langcode = key; // take the first language code
        break;
      };
    };
  };

  // set as selected language code
  selectedLanguage = langcode;
  localStorage.setItem("lang", selectedLanguage);
};

function getLanguage(key) {
  // get key phrase
  var str;

  // check if any languages were loaded
  if (languages[selectedLanguage]) str = languages[selectedLanguage][key];

  // if key does not exist, return the literal key
  str = (str || null);

  return str;
};

function langSelectChange(value) {
  // switch to selected language code
  setLanguage(value);

  // refresh labels
  refreshLabels();
}

function initList() {
  // get language list element
  var list = document.getElementById("listLanguages");
  // clear all options
  list.options.length = 0;

  // add all available languages
  for (var key in languages) {
    // create new language option
    var lang = document.createElement("option");
    lang.value = key;
    lang.innerHTML = languages[key]['langdesc'];

    // append to select element
    list.appendChild(lang);
  }

  list.value = selectedLanguage;

  $(document).ready(function () {
    $("#listLanguages").change(function () {
      langSelectChange($(this).val());
    });
  });

  refreshLabels();
}

function refreshLabels() {

  // Basically do the following for all document elements:
  //document.getElementById("Options").textContent = multilang.get("Options");

  // loop through all document elements
  var allnodes = document.body.getElementsByTagName("*");

  for (var i = 0, max = allnodes.length; i < max; i++) {
    // get id current elements
    var idname = allnodes[i].id;
    // if id exists, set get id current elements
    if (idname != '' && getLanguage(idname) != null) {
      allnodes[i].lastChild.textContent = getLanguage(idname);
    };
  };
}