/**
 * ===BASE===// render // menu2_show.js
 * @param 
 */

function menu2_show() {
    menu2.style.display = 'block';
    document.body.addEventListener('mousedown', menu2_hide, false);
}
