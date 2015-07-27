/**
 * ===BASE===// dsp // displayedRegionParamPrecise.js
 * @param __Browser.prototype__
 * @param 
 */

Browser.prototype.displayedRegionParamPrecise = function () {
    /* use in operations that doesn't change dsp
     - add tracks
     - htest
     - ajax correlation
     - get data
     */
    var jt = this.juxtaposition.type;
    if (this.is_gsv()) {
        // only need to pass spnum of each item, but no need to pass item name, start/stop
        // as that's already in database
        var sizelst = []; // spnum in each item
        for (var i = 0; i < this.regionLst.length; i++) {
            sizelst.push(this.regionLst[i][5]);
        }
        var lastr = this.regionLst[this.regionLst.length - 1];
        return "itemlist=on&startChr=" + this.regionLst[0][6] +
            "&startCoord=" + this.regionLst[0][3] +
            "&stopChr=" + lastr[6] +
            "&stopCoord=" + lastr[4] +
            "&sptotalnum=" + (this.entire.atbplevel ? this.entire.length : (this.entire.spnum - i)) +
            "&allrss=" + sizelst.join(',');
    }
// by passing exact information on each region in collation mode (chr, start/stop, spnum)
// it saves a lot of computing on server side, so it's necessary
    var lst = [];
    for (var i = 0; i < this.regionLst.length; i++) {
        var r = this.regionLst[i];
        lst.push(r[0] + ',' + r[1] + ',' + r[2] + ',' + (this.entire.atbplevel ? (r[4] - r[3]) : r[5]));
    }
    return this.runmode_param() +
        "&regionLst=" + lst.join(',') +
        "&startCoord=" + this.regionLst[0][3] +
        "&stopCoord=" + this.regionLst[this.regionLst.length - 1][4];
};

