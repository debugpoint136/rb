/**
 * ===BASE===// render // menu_barplotbg_change.js
 * @param 
 */

function menu_barplotbg_change() {
// from config menu
    var usebg = menu.c29.checkbox.checked;
    var bg = null;
    if (usebg) {
        menu.c29.color.style.display = 'block';
        bg = menu.c29.color.style.backgroundColor;
    } else {
        menu.c29.color.style.display = 'none';
    }
    menu_update_track(37);
}

