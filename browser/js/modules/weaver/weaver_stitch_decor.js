/**
 * ===BASE===// weaver // weaver_stitch_decor.js
 * @param __Browser.prototype__
 * @param 
 */

Browser.prototype.weaver_stitch_decor = function (tk, targetlst, qpoint, qx1, qx2, qstr) {
    glasspane.style.display = 'block';
    glasspane.width = this.hmSpan;
    glasspane.height = tk.canvas.height - fullStackHeight;
    glasspane.style.left = absolutePosition(this.hmdiv.parentNode)[0];
    glasspane.style.top = absolutePosition(tk.canvas)[1];
    var ctx = glasspane.getContext('2d');
    ctx.font = '10pt Arial';

    ctx.fillStyle = weavertkcolor_target;
    for (var i = 0; i < targetlst.length; i++) {
        var targetpoint = targetlst[i][0],
            t1 = targetlst[i][1],
            t2 = targetlst[i][2],
            tstr = targetlst[i][3];
        ctx.fillStyle = weavertkcolor_target;
        if (t1 > 0 && t2 > t1) {
            ctx.fillRect(t1 + this.move.styleLeft, 3, t2 - t1, 2);
        }
        var w = ctx.measureText(tstr).width;
        var y0 = 5, y1 = 8;
        var m = targetpoint + this.move.styleLeft;
        if (this.hmSpan - m > w + 10) {
            ctx.beginPath();
            ctx.moveTo(m, y0);
            ctx.lineTo(m + 4, y1);
            ctx.lineTo(m + w, y1);
            ctx.lineTo(m + w, y1 + 14);
            ctx.lineTo(m - 10, y1 + 14);
            ctx.lineTo(m - 10, y1);
            ctx.lineTo(m - 4, y1);
            ctx.closePath();
            ctx.fill();
            ctx.fillStyle = 'white';
            ctx.fillText(tstr, m - 3, y1 + 11);
        } else {
            ctx.beginPath();
            ctx.moveTo(m, y0);
            ctx.lineTo(m + 4, y1);
            ctx.lineTo(m + 10, y1);
            ctx.lineTo(m + 10, y1 + 14);
            ctx.lineTo(m - w, y1 + 14);
            ctx.lineTo(m - w, y1);
            ctx.lineTo(m - 4, y1);
            ctx.closePath();
            ctx.fill();
            ctx.fillStyle = 'white';
            ctx.fillText(tstr, m - w + 4, y1 + 11);
        }
    }
// stroke query
    ctx.fillStyle = tk.qtc.bedcolor;
    if (qx1 > 0 && qx2 > 0) {
        ctx.fillRect(qx1 + this.move.styleLeft, glasspane.height - 4, qx2 - qx1, 2);
    }
    w = ctx.measureText(qstr).width;
    y0 = glasspane.height - 4;
    y1 = y0 - 3;
    var m = qpoint + this.move.styleLeft;
    if (this.hmSpan - m > w + 10) {
        ctx.beginPath();
        ctx.moveTo(m, y0);
        ctx.lineTo(m + 4, y1);
        ctx.lineTo(m + w, y1);
        ctx.lineTo(m + w, y1 - 14);
        ctx.lineTo(m - 10, y1 - 14);
        ctx.lineTo(m - 10, y1);
        ctx.lineTo(m - 4, y1);
        ctx.closePath();
        ctx.fill();
        ctx.fillStyle = 'white';
        ctx.fillText(qstr, m - 3, y1 - 3);
    } else {
        ctx.beginPath();
        ctx.moveTo(m, y0);
        ctx.lineTo(m + 4, y1);
        ctx.lineTo(m + 10, y1);
        ctx.lineTo(m + 10, y1 - 14);
        ctx.lineTo(m - w, y1 - 14);
        ctx.lineTo(m - w, y1);
        ctx.lineTo(m - 4, y1);
        ctx.closePath();
        ctx.fill();
        ctx.fillStyle = 'white';
        ctx.fillText(qstr, m - w + 4, y1 - 3);
    }
};

