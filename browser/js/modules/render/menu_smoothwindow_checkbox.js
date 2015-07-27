/**
 * ===BASE===// render // menu_smoothwindow_checkbox.js
 * @param 
 */

function menu_smoothwindow_checkbox() {
// change checkbox on the menu
    var bbj = gflag.menu.bbj;
    var tklst = bbj.tklstfrommenu();
    if (menu.c46.checkbox.checked) {
        menu.c46.div.style.display = 'block';
        menu.c46.says.innerHTML = '5-pixel window';
    } else {
        menu.c46.div.style.display = 'none';
    }
    menu_update_track(8);
}

