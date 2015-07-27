/**
 * ===BASE===// render // drawMcm .js
 * @param __Browser.prototype__
 * @param 
 */

Browser.prototype.drawMcm = function () {
    for (var i = 0; i < this.tklst.length; i++) {
        var t = this.tklst[i];
        if (tkishidden(t)) continue;
        this.drawMcm_onetrack(t, false);
        t.atC.style.display = t.where == 1 ? 'block' : 'none';
    }
};


