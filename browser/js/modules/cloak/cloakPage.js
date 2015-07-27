/**
 * ===BASE===// cloak // cloakPage.js
 * @param 
 */

function cloakPage() {
// cast shadow over entire page
    pagecloak.style.display = 'block';
    pagecloak.style.height = Math.max(window.innerHeight, document.body.offsetHeight);
    pagecloak.style.width = Math.max(window.innerWidth, document.body.offsetWidth);
}

