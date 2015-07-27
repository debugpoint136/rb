/**
 * ===BASE===// zoom // zoomin_MU.js
 * @param 
 */

function zoomin_MU(event) {
    indicator2.style.display = "none";
    indicator2.leftarrow.style.display = "none";
    indicator2.rightarrow.style.display = "none";
    document.body.removeEventListener("mousemove", zoomin_M, false);
    document.body.removeEventListener("mouseup", zoomin_MU, false);
    if (bbjisbusy()) return;
    var z = gflag.zoomin;
    z.bbj.shieldOff();
    if (event.clientX == z.oldx) return;
    if (z.beyondfinest) return;
    indicator2.veil.firstChild.firstChild.firstChild.innerHTML = '';
    var x1 = parseInt(indicator2.style.left) - z.holderx;
    var x2 = x1 + parseInt(indicator2.style.width);
    if (z.stitch) {
        x1 -= z.bbj.move.styleLeft;
        x2 -= z.bbj.move.styleLeft;
        var chr2pos = {};
        for (var i = 0; i < z.stitch.lst.length; i++) {
            var h = z.stitch.lst[i];
            var w = h.targetstop - h.targetstart;
            var a = b = -1;
            if (h.strand == '+') {
                if (Math.max(h.q1, x1) < Math.min(h.q2, x2)) {
                    a = h.targetstart + parseInt((Math.max(x1, h.q1) - h.q1) * w / (h.q2 - h.q1));
                    b = h.targetstop - parseInt((h.q2 - Math.min(x2, h.q2)) * w / (h.q2 - h.q1));
                }
            } else {
                if (Math.max(h.q2, x1) < Math.min(h.q1, x2)) {
                    a = h.targetstart + parseInt((h.q1 - Math.min(x2, h.q1)) * w / (h.q1 - h.q2));
                    b = h.targetstop - parseInt((Math.max(x1, h.q2) - h.q2) * w / (h.q1 - h.q2));
                }
            }
            if (a != -1) {
                var c = z.bbj.regionLst[h.targetrid][0];
                if (c in chr2pos) {
                    chr2pos[c][0] = Math.min(a, chr2pos[c][0]);
                    chr2pos[c][1] = Math.max(b, chr2pos[c][1]);
                } else {
                    chr2pos[c] = [a, b];
                }
            }
        }
        var maxlen = 0, maxchr;
        for (var n in chr2pos) {
            var a = chr2pos[n][1] - chr2pos[n][0];
            if (a > maxlen) {
                maxchr = n;
                maxlen = a;
            }
        }
        z.bbj.weavertoggle(maxlen);
        z.bbj.cgiJump2coord(maxchr + ':' + chr2pos[maxchr][0] + '-' + chr2pos[maxchr][1]);
        return;
    }
    z.bbj.ajaxZoomin(x1, x2, true);
}

