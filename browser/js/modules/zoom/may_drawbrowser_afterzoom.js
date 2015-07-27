/**
 * ===BASE===// zoom // may_drawbrowser_afterzoom.js
 * @param 
 */

function may_drawbrowser_afterzoom(hrx) {
    var bbj = horcrux[hrx];
    if (bbj.animate_zoom_stat == 1) {
        bbj.cloak();
        // data from ajax not ready yet
        setTimeout('may_drawbrowser_afterzoom(' + hrx + ')', 100);
        return;
    }
    bbj.zoom_dom_movable(1, bbj.move.styleLeft);
    bbj.drawRuler_browser(false);
    bbj.drawTrack_browser_all();
    bbj.drawIdeogram_browser(false);
    bbj.unveil();
    bbj.shieldOff();
}


