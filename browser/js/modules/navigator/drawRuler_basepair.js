/**
 * ===BASE===// navigator // drawRuler_basepair.js
 * @param 
 */

function drawRuler_basepair(ctx, bplen, plotwidth, x, y) {
    /* draw horizontal basepair ruler
     canvas height is fixed to 20px
     color must already been set
     */
    var sf = plotwidth / bplen;
    var ulst = ['', '0', '00', 'K', '0K', '00K', 'M', '0M', '00M'];
    var k = -1;
    for (var i = ulst.length - 1; i >= 0; i--) {
        if (Math.pow(10, i) * 2 < bplen) {
            k = i;
            break;
        }
    }
    if (k == -1) {
        print2console('cannot draw ideogram ruler', 2);
        return;
    }
    var ulen = Math.pow(10, k); // unit bp length
    var unum = parseInt(bplen / ulen);
    var uplot = ulen * sf; // unit plot width
    ctx.fillRect(0, y, uplot * unum, 1);
    ctx.fillRect(0, y, 1, 5);
    ctx.fillText(0, 0, y + 15);
    var x = 0;
    var lasttextpos = 0;
    for (i = 1; i <= unum; i++) {
        ctx.fillRect(x + uplot / 4, y, 1, 4); // 1st quarter
        ctx.fillRect(x + uplot / 2, y, 1, 4); // half
        ctx.fillRect(x + uplot * 3 / 4, y, 1, 4); // 3rd quarter
        ctx.fillRect(x + uplot, y, 1, 5);
        var w = i.toString() + ulst[k];
        var ww = ctx.measureText(w).width;
        x += uplot;
        if (x > lasttextpos + ww + 3) {
            ctx.fillText(w, i == unum ? x - ww + 1 : x - ww / 2, 15 + y);
            lasttextpos = x;
        }
    }
}


