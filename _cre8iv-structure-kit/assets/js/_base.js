//@codekit-prepend '../uikit/dist/js/uikit.js'
//@codekit-prepend '../uikit/dist/js/uikit-icons.js'

var arrowDownButton = document.querySelector('.hero-arrow-down');

var viewportWidth = window.innerWidth || document.documentElement.clientWidth;
if (viewportWidth < 960) {
  UIkit.scroll(arrowDownButton, {offset: 50})
} else {
  UIkit.scroll(arrowDownButton, {offset: 80})
}

window.addEventListener('resize', function () {
  viewportWidth = window.innerWidth || document.documentElement.clientWidth;
  if (viewportWidth < 960) {
  UIkit.scroll(arrowDownButton, {offset: 50})
} else {
  UIkit.scroll(arrowDownButton, {offset: 80})
}
}, false);