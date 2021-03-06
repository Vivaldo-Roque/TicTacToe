// Runs when page get full loaded
// Será executado quando a página estiver carregada
window.addEventListener("load", () => {

    // Get all elements from navbar
    // Pegar os elementos da barra de navegação
    var homeElement = document.getElementById("home");
    var contactElement = document.getElementById("contact");
    var aboutElement = document.getElementById("about");

    // Get file name from current page
    // Pegar o nome do ficheiro html da página corrente
    var path = window.location.pathname;
    var page = path.split("/").pop();

    // console.log(page);

    // If we are at home page
    // Se estivermos na página principal
    if (path === '/' || path === '/TicTacToe/') {
        homeElement.classList.add("right");
        homeElement.children[0].classList.add("active");
    } else {

        /*
            If the page I want to access to the index.html page add to it the classes with the necessary CSS,
            otherwise remove the classes with the necessary CSS.
         */

        /*
            Se a página que eu quero aceder for a página index.html adiciona a ela as classes com o CSS necessário,
            caso contrário remove as classes com o CSS necessário.
        */
        if (page === "index.html") {
            homeElement.classList.add("right");
            homeElement.children[0].classList.add("active");
        } else {
            homeElement.classList.remove("right");
            homeElement.children[0].classList.remove("active");
        }

        if (page === "contact.html") {
            contactElement.classList.add("right");
            contactElement.children[0].classList.add("active");
        } else {
            contactElement.classList.remove("right");
            contactElement.children[0].classList.remove("active");
        }

        if (page === "about.html") {
            aboutElement.classList.add("right");
            aboutElement.children[0].classList.add("active");
        } else {
            aboutElement.classList.remove("right");
            aboutElement.children[0].classList.remove("active");
        }
    }
});