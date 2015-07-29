/**
 * ===BASE===// render // seq2ideogram .js
 * @param __Browser.prototype__
 * @param 
 */

Browser.prototype.seq2ideogram = function (data) {
    if (!data) {
        data = {abort: 'Server error when fetching sequence'};
    }
    var svgdata = [];
    var canvas = this.ideogram.canvas;
    canvas.height = canvas.parentNode.parentNode.parentNode.style.height = ideoHeight + cbarHeight;
    var ctx = canvas.getContext('2d');
    if (data.abort) {
        var s = data.abort;
        var sp = this.hmSpan / 2 - this.move.styleLeft - ctx.measureText(s).width / 2;
        ctx.fillText(s, sp, 14);
        return;
    }
    if (!data.lst) fatalError('.lst missing');
    var seqlst = data.lst;
    for (var i = 0; i < this.regionLst.length; i++) {
        var r = this.regionLst[i];
        var s = data.lst[i];
        if (!s || s == 'ERROR') {
            ctx.fillStyle = 'black';
            ctx.fillRect(this.cumoffset(i, r[3]), 0, this.bp2sw(i, r[4] - r[3]), ideoHeight);
            continue;
        }
        for (var j = 0; j < s.length; j++) {
            var _x = this.cumoffset(i, r[3] + j);
            // beware that cumoffset treats gap to be after the coord, but need to flip it!!
            if (this.weaver) {
                var _g = this.weaver.insert[i][r[3] + j];
                if (_g) _x += _g * this.entire.bpwidth;
            }
            if (_x >= 0) {
                var _s = printbp_scrollable(ctx, s[j], _x, 0, this.entire.bpwidth, ideoHeight, true);
                svgdata = svgdata.concat(_s);
            }
        }
    }
    if (this.basepairlegendcanvas) {
        this.basepairlegendcanvas.style.display = 'block';
        this.drawATCGlegend(false);
    }
    this.draw_coordnote();
    this.ideogram.svgdata = svgdata;
};


