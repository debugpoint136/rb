/**
 * ===BASE===// weaver // weaver_cotton_dspboundary.js
 * @param __Browser.prototype__
 * @param 
 */

Browser.prototype.weaver_cotton_dspboundary = function () {
// cottonbbj dspBoundary, use with care!
    var r0 = this.regionLst[0],
        r9 = this.regionLst[this.regionLst.length - 1];
    this.dspBoundary = {
        vstartr: 0,
        vstarts: 0,
        vstartc: r0[8].item.hsp.strand == '+' ? r0[3] : r0[4],
        vstopr: this.regionLst.length - 1,
        vstops: r9[5],
        vstopc: r9[8].item.hsp.strand == '+' ? r9[4] : r9[3]
    };
    if (r0[8].canvasxoffset < -this.move.styleLeft) {
        // vstart in hsp
        var x = this.sx2rcoord(-this.move.styleLeft);
        if (x) {
            this.dspBoundary.vstartc = parseInt(x.coord);
            this.dspBoundary.vstarts = x.sid;
        }
    }
    if (r9[8].canvasxoffset + r9[5] > this.hmSpan - this.move.styleLeft) {
        // vstop in hsp
        var x = this.sx2rcoord(this.hmSpan - this.move.styleLeft);
        if (x) {
            this.dspBoundary.vstopc = parseInt(x.coord);
            this.dspBoundary.vstops = x.sid;
        }
    }
};

