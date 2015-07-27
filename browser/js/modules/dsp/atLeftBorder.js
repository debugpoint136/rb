/**
 * ===BASE===// dsp // atLeftBorder.js
 * @param __Browser.prototype__
 * @param 
 */

Browser.prototype.atLeftBorder = function () {
// see if leftmost point in regionLst is at left border
    var b = this.border;
    var r = this.regionLst[0];
    if (this.is_gsv()) return (r[6] == b.lname) && (r[3] <= b.lpos);
    return (r[0] == b.lname) && (r[3] <= b.lpos);
};

