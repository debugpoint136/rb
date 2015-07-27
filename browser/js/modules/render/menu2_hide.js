/**
 * ===BASE===// render // menu2_hide.js
 * @param 
 */

function menu2_hide() {
    menu2.style.display = 'none';
    document.body.removeEventListener('mousedown', menu2_hide, false);
}
