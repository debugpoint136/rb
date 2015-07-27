/**
 * ===BASE===// dsp // menu_changehmspan.js
 * @param 
 */

function menu_changehmspan(event) {
// called by pushing button, show indicator3 for how hmspan would be adjusted
    var bbj = gflag.menu.bbj;
    var t = indicator6;
    var w;
    if (t.style.display == 'none') {
        var pos = absolutePosition(bbj.hmdiv.parentNode);
        t.style.display = 'block';
        t.style.left = pos[0];
        t.style.top = pos[1];
        t.style.height = bbj.hmdiv.parentNode.clientHeight + bbj.ideogram.canvas.parentNode.parentNode.clientHeight + bbj.decordiv.parentNode.clientHeight;
        w = bbj.hmSpan;
    } else {
        w = parseInt(t.style.width);
    }
    switch (event.target.which) {
        case 1:
            w += 100;
            break;
        case 2:
            if (w <= min_hmspan) {
                print2console('Cannot shrink width any further', 2);
                w = min_hmspan;
            } else {
                w = Math.max(w - 100, min_hmspan);
            }
            break;
        case 3:
            w += 10;
            break;
        case 4:
            if (w <= min_hmspan) {
                print2console('Cannot shrink width any further', 2);
                w = min_hmspan;
            } else {
                w = Math.max(w - 10, min_hmspan);
            }
            break;
    }
    t.style.width = w;
    var b = menu.bbjconfig.setbutt;
    b.style.display = 'table-cell';
    b.disabled = false;
}

