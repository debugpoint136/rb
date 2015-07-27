/**
 * ===BASE===// weaver // weaver_stitch2cotton.js
 * @param __Browser.prototype__
 * @param 
 */

Browser.prototype.weaver_stitch2cotton = function (tk) {
    var querybbj = this.weaver.q[tk.cotton];
    if (this.weaverpending) {
        var p = this.weaverpending[tk.cotton];
        if (p) {
            querybbj.init_bbj_param = {hubjsoncontent: p};
            delete this.weaverpending[tk.cotton];
        }
    }
    var regionlst = [];
    var insertlst = [];
    for (var j = 0; j < tk.weaver.stitch.length; j++) {
        var stp = tk.weaver.stitch[j];
        var firsthsp = stp.lst[0];
        var newregion = [
            stp.chr,
            stp.start,
            stp.stop,
            stp.start,
            stp.stop,
            Math.ceil(stp.canvasstop - stp.canvasstart), // region screen width
            '',
            (stp.stop - stp.start) / (stp.canvasstop - stp.canvasstart),
            {
                canvasxoffset: stp.canvasstart,
                item: {
                    hsp: {
                        targetrid: firsthsp.targetrid,
                        targetstart: firsthsp.targetstart,
                        strand: '+'
                    }
                },
                stitch: stp,
            }
        ];
        regionlst.push(newregion);
        insertlst.push({});
    }
    querybbj.regionLst = regionlst;
    querybbj.weaver.insert = insertlst;
    this.weaver_cotton_spin(querybbj);
};


