/**
 * ===BASE===// dsp // displayedRegionParam_narrow.js
 * @param __Browser.prototype__
 * @param 
 */

Browser.prototype.displayedRegionParam_narrow = function () {
    /* for re-doing lr data from view range, for circlet view
     TODO check if it's alright
     */
    var lst = [];
    for (var i = this.dspBoundary.vstartr; i <= this.dspBoundary.vstopr; i++) {
        var r = this.regionLst[i];
        lst.push(r[0]);
        lst.push(r[3]);
        lst.push(r[4]);
        lst.push(10); // fictional spnum
    }
    var t = this.getDspStat();
    return '&runmode=' + this.genome.defaultStuff.runmode + '&regionLst=' + lst.join(',') +
        '&startCoord=' + t[1] +
        '&stopCoord=' + t[3];
};


