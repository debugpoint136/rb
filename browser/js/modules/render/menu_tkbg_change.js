/**
 * ===BASE===// render // menu_tkbg_change.js
 * @param 
 */

function menu_tkbg_change() {
// from config menu
    var usebg = menu.c44.checkbox.checked;
    var bg = null;
    if (usebg) {
        menu.c44.color.style.display = 'block';
        bg = menu.c44.color.style.backgroundColor;
    } else {
        menu.c44.color.style.display = 'none';
    }
    menu_update_track(38);
}

