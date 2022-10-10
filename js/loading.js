//paste this code under the head tag or in a separate js file.
// Wait for window load

window.addEventListener("load", function() { 
    // Animate loader off screen
    fadeOut(document.getElementsByClassName("se-pre-con")[0]);
});

function fadeOut(el){
  el.style.opacity = 1;

  (function fade() {
    if ((el.style.opacity -= .1) < 0) {
      el.style.display = "none";
    } else {
      requestAnimationFrame(fade);
    }
  })();
};