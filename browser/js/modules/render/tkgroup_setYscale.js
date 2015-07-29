/**
 * ===BASE===// render // tkgroup_setYscale .js
 * @param __Browser.prototype__
 * @param 
 */

Browser.prototype.tkgroup_setYscale = function (groupidx) {
    var g = this.tkgroup[groupidx];
    if (g.scale != scale_auto) {
        return;
    }
    var gtklst = [];
    for (var i = 0; i < this.tklst.length; i++) {
        var t = this.tklst[i];
        if (t.group == groupidx) gtklst.push(t);
    }
    if (gtklst.length == 0) {
        print2console('empty tk group ' + groupidx, 2);
        return;
    }
    var t = this.tklst_yscale(gtklst);
    g.max = g.max_show = t[0];
    g.min = g.min_show = t[1];
};

