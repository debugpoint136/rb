/**
 * ===BASE===// weaver // weaver_hsp2cotton.js
 * @param __Browser.prototype__
 * @param 
 */

Browser.prototype.weaver_hsp2cotton = function (tk) {
// call from target bbj
    var qgn = tk.cotton;
    var querybbj = this.weaver.q[qgn];
    if (this.weaverpending) {
        var p = this.weaverpending[qgn];
        if (p) {
            querybbj.init_bbj_param = {hubjsoncontent: p};
            delete this.weaverpending[qgn];
        }
    }
    var regionlst = [];
    var insertlst = [];
    for (var j = 0; j < tk.data.length; j++) {
        for (var k = 0; k < tk.data[j].length; k++) {
            var item = tk.data[j][k];
            var x1 = item.boxstart,
                x2 = item.boxstart + item.boxwidth;
            if (x2 <= x1 + 5) continue;
            if (Math.max(x1, -this.move.styleLeft) >= Math.min(x2, this.hmSpan - this.move.styleLeft)) continue;
            // acceptable hsp, create a new region for it in query genome
            var r7 = this.regionLst[item.hsp.targetrid][7];
            var newregion = [
                item.hsp.querychr,
                item.hsp.querystart,
                item.hsp.querystop,
                item.hsp.querystart,
                item.hsp.querystop,
                /* region screen width
                 but this is inprecise since no gaps on query is considered
                 */
                this.entire.atbplevel ?
                    parseInt(this.entire.bpwidth * (item.hsp.querystop - item.hsp.querystart)) :
                    parseInt((item.hsp.querystop - item.hsp.querystart) / r7),
                '',
                r7,
                {
                    item: item,
                }];
            regionlst.push(newregion);
            var insert = {};
            for (var c in item.hsp.gap) {
                insert[c] = item.hsp.gap[c];
            }
            insertlst.push(insert);
        }
    }
// fit regionlst into querybbj
    querybbj.regionLst = regionlst;
    querybbj.weaver.insert = insertlst;
};

