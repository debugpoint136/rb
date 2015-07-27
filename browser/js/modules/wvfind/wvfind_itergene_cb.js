/**
 * ===BASE===// wvfind // wvfind_itergene_cb.js
 * @param __Browser.prototype__
 * @param 
 */

Browser.prototype.wvfind_itergene_cb = function (data, geneiter, qgn, idlst, rlst, callback) {
    if (!data || !data.tkdatalst || data.tkdatalst.length == 0) {
        print2console('server error!', 2);
    } else if (data.tkdatalst[0].data.length != idlst.length) {
        print2console('expecting data over ' + idlst.length + ' regions but got ' + data.tkdatalst[0].data.length, 2);
    } else {
        for (var i = 0; i < idlst.length; i++) {
            var stp = rlst[idlst[i]].hit[qgn][0];
            // get longest query gene
            var qglst = data.tkdatalst[0].data[i];
            if (qglst.length == 0) {
                continue;
            }
            var qgene = qglst[0];
            var maxlen = Math.min(stp.stop, qgene.stop) - Math.max(stp.start, qgene.start);
            for (var j = 1; j < qglst.length; j++) {
                var b = qglst[j];
                var bl = Math.min(stp.stop, b.stop) - Math.max(stp.start, b.start);
                if (bl > maxlen) {
                    maxlen = bl;
                    qgene = b;
                }
            }
            stp.querygene = qgene;
        }
    }
    this.wvfind_itergene(geneiter, rlst, callback);
};

