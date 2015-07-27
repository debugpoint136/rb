/**
 * ===BASE===// dsp // browser_ruler_mover.js
 * @param 
 */

function browser_ruler_mover(event) {
    var bbj = gflag.browser;
    var h = bbj.sx2rcoord(event.clientX + document.body.scrollLeft - absolutePosition(bbj.hmdiv.parentNode)[0] - bbj.move.styleLeft, true);
    if (!h) return;
    pica_go(event.clientX, absolutePosition(event.target)[1] + event.target.clientHeight - 10 - document.body.scrollTop);
    if (h.gap) {
        picasays.innerHTML = bbj.tellsgap(h);
    } else {
        picasays.innerHTML = h.str + ' <span style="font-size:10px;">drag to zoom in</span>';
    }
}

