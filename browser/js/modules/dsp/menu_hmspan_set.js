/**
 * ===BASE===// dsp // menu_hmspan_set.js
 * @param 
 */

function menu_hmspan_set(event) {
    var newhmspan = parseInt(indicator6.style.width);
    var bbj = gflag.menu.bbj;
    if (newhmspan == bbj.hmSpan) {
        print2console('Same as current width', 2);
        return;
    }
    bbj.sethmspan_refresh(newhmspan);
}

