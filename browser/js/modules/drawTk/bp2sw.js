/**
 * ===BASE===// drawTk // bp2sw.js
 * @param __Browser.prototype__
 * @param 
 */

Browser.prototype.bp2sw = function (rid, bpw) {
// do not consider gaps
    if (this.entire.atbplevel) return bpw * this.entire.bpwidth;
    return bpw / this.regionLst[rid][7];
};

