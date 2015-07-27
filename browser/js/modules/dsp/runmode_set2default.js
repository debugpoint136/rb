/**
 * ===BASE===// dsp // runmode_set2default.js
 * @param __Browser.prototype__
 * @param 
 */

Browser.prototype.runmode_set2default = function () {
    this.juxtaposition.type = this.genome.defaultStuff.runmode;
    this.juxtaposition.note =
        this.juxtaposition.what = RM2verbal[this.genome.defaultStuff.runmode];
};

