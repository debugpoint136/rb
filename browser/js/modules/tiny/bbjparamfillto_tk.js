Browser.prototype.bbjparamfillto_tk = function (pa) {
// mmm matplot
    if (!pa.tklst) pa.tklst = [];
    if (!pa.cmtk) pa.cmtk = [];
    if (!pa.matplot) pa.matplot = [];
    if (!pa.track_order) pa.track_order = [];
    for (var i = 0; i < this.tklst.length; i++) {
        var t = this.tklst[i];
        if (t.ft == FT_cm_c) {
            pa.cmtk.push(t);
            pa.track_order.push({name: t.name, where: t.where});
        } else if (t.ft == FT_matplot) {
            pa.matplot.push(t);
            pa.track_order.push({name: t.name, where: t.where});
        } else {
            pa.tklst.push(t);
            if (!tkishidden(t)) {
                pa.track_order.push({name: t.name, where: t.where});
            }
        }
    }
};