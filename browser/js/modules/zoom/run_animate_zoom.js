/**
 * ===BASE===// zoom // run_animate_zoom.js
 * @param 
 */

function run_animate_zoom(hrx) {
    var z = gflag.animate_zoom[hrx];
    var bbj = horcrux[hrx];
    if (z.count <= 0) {
        may_drawbrowser_afterzoom(hrx);
        return;
    }
    bbj.zoom_dom_movable(z.xzoom, z.xleft);
    z.xzoom += z.foldchange;
    z.xleft += z.x_shift;
    z.count--;
    setTimeout('run_animate_zoom(' + hrx + ')', 5);
}

