/**
 * ===BASE===// dsp // getDspStat.js
 * @param __Browser.prototype__
 * @param 
 */

Browser.prototype.getDspStat = function () {
// return array for saving status, see dbSchema.dia
    var startr = this.regionLst[this.dspBoundary.vstartr];
    var stopr = this.regionLst[this.dspBoundary.vstopr];
    if (this.is_gsv()) return [startr[6], this.dspBoundary.vstartc, stopr[6], this.dspBoundary.vstopc];
    return [startr[0], this.dspBoundary.vstartc, stopr[0], this.dspBoundary.vstopc];
};


