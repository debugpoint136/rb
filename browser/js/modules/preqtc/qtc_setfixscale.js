/**
 * ===BASE===// preqtc // qtc_setfixscale.js
 * @param 
 */

function qtc_setfixscale() {
// need to show beyond threshold color blobs
    var min = parseFloat(menu.c51.fix.min.value);
    if (isNaN(min)) {
        print2console('Invalid minimum value', 2);
        return;
    }
    var max = parseFloat(menu.c51.fix.max.value);
    if (isNaN(max)) {
        print2console('Invalid maximum value', 2);
        return;
    }
    if (min >= max) {
        print2console('min >= max', 2);
        return;
    }
    menu_update_track(6);
}


