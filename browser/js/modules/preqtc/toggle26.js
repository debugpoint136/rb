/**
 * ===BASE===// preqtc // toggle26.js
 * @param 
 */

function toggle26(event) {
// toggle select, change Y axis scale type
    menu.c51.fix.style.display =
        menu.c51.percentile.style.display = 'none';
    var v = parseInt(menu.c51.select.options[menu.c51.select.selectedIndex].value);
    if (v == scale_fix) {
        menu.c51.fix.style.display = 'block';
        // do not apply until user push button
        return;
    }
    if (v == scale_auto) {
        menu.c50.color1_1.style.display = menu.c50.color2_1.style.display = 'none';
    } else if (v == scale_percentile) {
        menu.c51.percentile.style.display = 'block';
        menu.c51.percentile.says.innerHTML = '95 percentile';
    }
    menu_update_track(5);
}

