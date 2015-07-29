/**
 * ===BASE===// render // get_tkyscale .js
 * @param __Browser.prototype__
 * @param 
 */

Browser.prototype.get_tkyscale = function (tk) {
    /* only from view range
     do not deal with tkgroup, only get it from data
     */
    if (tk.ft == FT_matplot) {
        return this.tklst_yscale(tk.tracks);
    }
    if (isNumerical(tk)) {
        var data2 = qtrack_logtransform(tk.data, tk.qtc);
        return qtrack_getthreshold(data2, tk.qtc, this.dspBoundary.vstartr, this.dspBoundary.vstopr, this.dspBoundary.vstarts, this.dspBoundary.vstops);
    }
    if (tk.showscoreidx != undefined && tk.showscoreidx >= 0) {
        var scale = tk.scorescalelst[tk.showscoreidx];
        if (scale.type == scale_auto) {
            var s_max = s_min = null;
            for (var i = this.dspBoundary.vstartr; i <= this.dspBoundary.vstopr; i++) {
                for (var j = 0; j < tk.data[i].length; j++) {
                    var item = tk.data[i][j];
                    if (item.boxstart == undefined || item.boxwidth == undefined || !item.scorelst || item.scorelst.length == 0) continue;
                    if (item.boxstart > this.hmSpan - this.move.styleLeft || item.boxstart + item.boxwidth < -this.move.styleLeft) continue;
                    var s = item.scorelst[tk.showscoreidx];
                    if (s_max == null || s_max < s) {
                        s_max = s;
                    }
                    if (s_min == null || s_min > s) {
                        s_min = s;
                    }
                }
            }
            // TODO make it an option: 0-based or dynamic range
            if (s_min > 0) {
                s_min = 0;
            }
            return [s_max, s_min];
        } else {
            return [scale.max, scale.min];
        }
    }
    return [null, null]
};


