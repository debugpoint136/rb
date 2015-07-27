/**
 * ===BASE===// dsp // runmode_param.js
 * @param __Browser.prototype__
 * @param 
 */

Browser.prototype.runmode_param = function () {
// handyman
    if (this.is_gsv()) {
        // TODO enable it for gsv
        print2console('not supposed to call runmode_param() while in gsv mode', 2);
        return '';
    }
    var rm = this.juxtaposition.type;
    if (rm == RM_yearmonthday)
        return 'runmode=' + rm;
    if (rm == RM_genome)
        return 'runmode=' + rm;
    return 'runmode=' + rm + '&juxtaposeTk=' + this.juxtaposition.what;
};

