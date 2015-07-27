/**
 * ===BASE===// dsp // atRightBorder.js
 * @param __Browser.prototype__
 * @param 
 */

Browser.prototype.atRightBorder = function () {
// see if rightmost point in regionLst is at right border
    var b = this.border;
    var r = this.regionLst[this.regionLst.length - 1];
    if (this.is_gsv()) return (r[6] == b.rname) && (r[4] >= b.rpos);
    return (r[0] == b.rname) && (r[4] >= b.rpos);
};

