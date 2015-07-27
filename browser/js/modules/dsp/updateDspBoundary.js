/**
 * ===BASE===// dsp // updateDspBoundary.js
 * @param __Browser.prototype__
 * @param 
 */

Browser.prototype.updateDspBoundary = function () {
    /* call after zoom level might have been changed
     updates .dspBoundary and .entire
     requires:
     move.styleLeft
     regionLst, where [5] region plot width must be ready
     */
    var d = this.dspBoundary;
    var t = this.sx2rcoord(-this.move.styleLeft);
// must not fail!
    if (!t) fatalError('null vstart for ' + this.horcrux);
    d.vstartr = t.rid;
    d.vstarts = t.sid;
    d.vstartc = parseInt(t.coord);
    t = this.sx2rcoord(this.hmSpan - this.move.styleLeft);
    if (!t) {
        d.vstopr = this.regionLst.length - 1;
        var r = this.regionLst[d.vstopr];
        d.vstops = r[5];
        d.vstopc = r[4];
    } else {
        d.vstopr = t.rid;
        d.vstops = t.sid;
        d.vstopc = parseInt(t.coord);
    }
    this.updateDspstat();
};


