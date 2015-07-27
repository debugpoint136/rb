/**
 * ===BASE===// pan // mayShowDsp.js
 * @param __Browser.prototype__
 * @param 
 */

Browser.prototype.mayShowDsp = function () {
    /* at thin/full mode, must not do dsp filtering
     */
    var show = false;
    for (var i = 0; i < this.tklst.length; i++) {
        var t = this.tklst[i];
        if ((t.ft == FT_lr_c || t.ft == FT_lr_n) && (t.mode == M_trihm || t.mode == M_arc)) {
            show = true;
            break;
        }
    }
    if (!show) return '';
    var lst = [];
    for (i = this.dspBoundary.vstartr; i <= this.dspBoundary.vstopr; i++) {
        var r = this.regionLst[i];
        lst.push(r[0]);
        lst.push(r[3]);
        lst.push(r[4]);
    }
    return '&existingDsp=' + lst.join(',');
};

