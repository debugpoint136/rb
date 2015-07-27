/**
 * ===BASE===// qtc // qtc_percentile.js
 * @param 
 */

function qtc_percentile(event) {
// clicking button to change y scale percentile
    var v = parseInt(menu.c51.percentile.says.innerHTML);
    v += event.target.change;
    if (v < 0) v = 0;
    else if (v > 100) v = 100;
    menu.c51.percentile.says.innerHTML = v + ' percentile';
    menu_update_track(7);
}


