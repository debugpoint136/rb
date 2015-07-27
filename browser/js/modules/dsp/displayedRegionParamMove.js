/**
 * ===BASE===// dsp // displayedRegionParamMove.js
 * @param __Browser.prototype__
 * @param 
 */

Browser.prototype.displayedRegionParamMove = function () {
    var r1 = this.regionLst[0];
    var r2 = this.regionLst[this.regionLst.length - 1];
    var jt = this.juxtaposition.type;
    if (this.is_gsv()) {
        return "itemlist=on&startChr=" + r1[6] +
            "&startCoord=" + r1[3] +
            "&stopChr=" + r2[6] +
            "&stopCoord=" + r2[4] +
            "&sptotalnum=" + (this.entire.spnum - this.regionLst.length + 1);
    }
    return 'runmode=' + jt + '&juxtaposeTk=' + this.juxtaposition.what +
        "&startChr=" + r1[0] +
        "&startCoord=" + r1[3] +
        "&stopChr=" + r2[0] +
        "&stopCoord=" + r2[4] +
        "&sptotalnum=" + (this.entire.spnum - this.regionLst.length + 1);
};


