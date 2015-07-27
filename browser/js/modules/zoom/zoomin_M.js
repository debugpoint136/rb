/**
 * ===BASE===// zoom // zoomin_M.js
 * @param 
 */

function zoomin_M(event) {
// mouse move, only process horizontal move
    var z = gflag.zoomin;
    var currx = event.clientX + document.body.scrollLeft;
    var bpw = 0;
    if (currx > z.x) {
        if (currx < z.holderx + (z.stitch ? z.stitch.canvasstop + z.bbj.move.styleLeft : z.bbj.hmSpan)) {
            var pxw = currx - z.x;
            indicator2.style.width = pxw;
            bpw = z.bbj.pixelwidth2bp(pxw);
            if (bpw < z.bbj.hmSpan / MAXbpwidth_bold) {
                indicator2.veil.style.backgroundColor = 'red';
                z.beyondfinest = true;
            } else {
                indicator2.veil.style.backgroundColor = 'blue';
                z.beyondfinest = false;
            }
        }
    } else {
        if (currx > z.holderx + (z.stitch ? z.stitch.canvasstart + z.bbj.move.styleLeft : 0)) {
            var pxw = z.x - currx;
            indicator2.style.width = pxw;
            indicator2.style.left = currx;
            bpw = z.bbj.pixelwidth2bp(pxw);
            if (bpw < z.bbj.hmSpan / MAXbpwidth_bold) {
                indicator2.veil.style.backgroundColor = 'red';
                z.beyondfinest = true;
            } else {
                indicator2.veil.style.backgroundColor = 'blue';
                z.beyondfinest = false;
            }
        }
    }
    indicator2.veil.firstChild.firstChild.firstChild.innerHTML = '';
    if (bpw != 0) {
        var str = parseInt(bpw) + ' bp';
        if (parseInt(indicator2.style.width) > (str.length * 15)) {
            indicator2.veil.firstChild.firstChild.firstChild.innerHTML = str;
        }
    }
}
