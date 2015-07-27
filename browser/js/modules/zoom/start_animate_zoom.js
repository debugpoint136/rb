/**
 * ===BASE===// zoom // start_animate_zoom.js
 * @param 
 */

function start_animate_zoom(hrx) {
    var z = gflag.animate_zoom[hrx];
    var bbj = horcrux[hrx];
    bbj.shieldOn();
    z.xzoom = 1;
    z.xleft = bbj.move.styleLeft;
// total # of frame in the little film
    z.count = Math.min(Math.ceil(bbj.hmSpan / (z.x2 - z.x1)), 10) * 10;
// change scale in each frame
    if (z.zoomin) {
        z.foldchange = bbj.hmSpan / (z.x2 - z.x1) - 1;
    } else {
        z.foldchange = (z.x2 - z.x1) / bbj.hmSpan - 1;
    }
    z.foldchange /= z.count;
// x offset adjustment
    var c0 = (z.x2 + z.x1) / 2 - bbj.move.styleLeft;
    var c1 = bbj.entire.spnum / 2;
    z.x_shift = (c1 - c0) * z.foldchange + ((bbj.hmSpan - z.x1 - z.x2) / 2) / z.count;
// TODO .style.left
    run_animate_zoom(hrx);
}

