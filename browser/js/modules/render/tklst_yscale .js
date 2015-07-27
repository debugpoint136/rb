/**
 * ===BASE===// render // tklst_yscale .js
 * @param __Browser.prototype__
 * @param 
 */

Browser.prototype.tklst_yscale = function (tklst) {
    /* get Y-range from a group of tk
     always use auto scale
     this is from visual range only!
     */
    var max = null, min = null, max2 = null, min2 = null;
    /* max/min are not normalized, used for rendering
     max2/min2 maybe normalized, used for label printing
     */
    for (var i = 0; i < tklst.length; i++) {
        var tk = tklst[i];
        if (tk.qtc.smooth && !tk.data) {
            /* this happens when loading cust tk in a group, with smooth window applied
             */
            if (!tk.data_raw) fatalError('missing .data_raw: ' + tk.name);
            tk.data = tk.data_raw;
        }
        var thv = this.get_tkyscale(tk);
        if (thv[0] == null || thv[1] == null) continue;
        if (max == null || thv[0] > max) max = thv[0];
        if (min == null || thv[1] < min) min = thv[1];
        // apply normalization
        var a = this.track_normalize(tk, thv[0]);
        var b = this.track_normalize(tk, thv[1]);
        if (max2 == null || a > max2) max2 = a;
        if (min2 == null || b < min2) min2 = b;
    }
    return [max, min, max2, min2];
};

