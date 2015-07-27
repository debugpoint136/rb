/**
 * ===BASE===// render // menu_smoothwindow_change.js
 * @param 
 */

function menu_smoothwindow_change(event) {
    var v = parseInt(menu.c46.says.innerHTML);
    if (isNaN(v)) {
        v = 5;
    } else {
        v = Math.max(3, v + event.target.change);
    }
    menu.c46.says.innerHTML = v + '-pixel window';
    menu_update_track(8);
}


