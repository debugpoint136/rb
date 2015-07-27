/**
 * ===BASE===// dsp // updateEntire.js
 * @param __Browser.prototype__
 * @param 
 */

Browser.prototype.updateEntire = function () {
    /* only called in jsonDsp
     entire.atbplevel must be determined
     !! only updates entire, do not meddle with region attributes !!
     r[5] and r[7] is not to be affected by weaver.insert
     r[5] is determined by cgi
     r[7] is calculated when new region is added
     */
    this.entire.length = 0;
    var actualsp = 0;
    for (var i = 0; i < this.regionLst.length; i++) {
        var r = this.regionLst[i];
        this.entire.length += r[4] - r[3];
        actualsp += r[5];
    }
    var i = this.regionLst.length - 1;
    this.entire.spnum = this.cumoffset(i, this.regionLst[i][4]);
    this.entire.summarySize = this.entire.length / actualsp;
};

