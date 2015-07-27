/**
 * ===BASE===// wvfind // wvfind_itergene.js
 * @param __Browser.prototype__
 * @param 
 */

Browser.prototype.wvfind_itergene = function (geneiter, rlst, callback) {
    for (var qgn in geneiter) {
        // query genome
        for (var gtkn in geneiter[qgn]) {
            // is gene track name of query genome
            var tk = genome[qgn].getTkregistryobj(gtkn);
            if (!tk) {
                print2console(qgn + ' gene track ' + gtkn + ' went missing', 2);
                delete geneiter[gn][gtkn];
                continue;
            }
            var idlst = geneiter[qgn][gtkn];
            var lst = [], a, b;
            for (var i = 0; i < idlst.length; i++) {
                var stp = rlst[idlst[i]].hit[qgn][0];
                lst.push(stp.chr + ',' + stp.start + ',' + stp.stop + ',' + 1);
                if (i == 0) {
                    a = stp.start;
                }
                if (i == idlst.length - 1) {
                    b = stp.stop;
                }
            }
            delete geneiter[qgn][gtkn];
            var bbj = this;
            var tk2 = duplicateTkobj(tk);
            tk2.mode = M_full;
            this.ajax('dbName=' + qgn + '&runmode=' + RM_genome + '&regionLst=' + lst.join(',') +
                '&startCoord=' + a + '&stopCoord=' + b + '&' + trackParam([tk2]),
                function (data) {
                    bbj.wvfind_itergene_cb(data, geneiter, qgn, idlst, rlst, callback);
                });
            return;
        }
    }
    callback(1);
};

