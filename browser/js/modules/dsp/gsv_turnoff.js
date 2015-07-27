/**
 * ===BASE===// dsp // gsv_turnoff.js
 * @param __Browser.prototype__
 * @param 
 */

Browser.prototype.gsv_turnoff = function () {
    this.turnoffJuxtapose(true);
    if (gflag.syncviewrange) {
        for (var i = 0; i < gflag.syncviewrange.lst.length; i++) {
            gflag.syncviewrange.lst[i].turnoffJuxtapose(true);
        }
    }
};

