/**
 * ===BASE===// cmtk // tkplot_cm.js
 * @param __Browser.prototype__
 * @param 
 */

Browser.prototype.tkplot_cm = function (p) {
    /* not compatible with wig or line plot
     handles complex case of scaling
     */
    if (!p.lineplot) fatalError('tkplot_cm requires lineplot');
    var svgdata = [];
    if (p.linemax == undefined) {
        // linemax not provided
        var t = qtrack_getthreshold(p.lineplot.data, {thtype: scale_auto}, this.dspBoundary.vstartr, this.dspBoundary.vstopr, this.dspBoundary.vstarts, this.dspBoundary.vstops);
        p.linemax = t[0];
        p.cm.rdmax = t[0]; // for drawing scale
    }
// 1. plot bars
    var bpl = this.entire.atbplevel;
    var w = bpl ? this.entire.bpwidth : 1;
    var barmax = 1; // !!! hard-coded max value for methylation level, incompatible with other applications
    var tmp = {};

    for (var i = 0; i < this.regionLst.length; i++) {
        var r = this.regionLst[i];
        var stop = bpl ? (r[4] - r[3]) : r[5];
        var bgcg = [], hasbgcg = false,
            bgchg = [], hasbgchg = false,
            bgchh = [], hasbgchh = false,
            cg = [], hascg = false,
            chg = [], haschg = false,
            chh = [], haschh = false;
        for (var j = 0; j < stop; j++) {
            bgcg[j] = bgchg[j] = bgchh[j] = cg[j] = chg[j] = chh[j] = NaN;
        }
        for (var j = 0; j < stop; j++) {
            var v = p.lineplot.data[i][j]; // read depth, might be used to scale background bar height
            if (isNaN(v)) {
                // allowed: no read coverage but the methyc value is 0, only plot bg
                v = 0;
            }
            if (!p.cm.filter || p.lineplot.data[i][j] >= p.cm.filter) {
                if (p.barplot.cg.data[i][j] >= 0) {
                    cg[j] = p.barplot.cg.data[i][j] * (p.scale ? v / p.linemax : 1);
                    hascg = true;
                    if (p.cm.combine && bpl) {
                        cg[j + 1] = cg[j];
                    }
                }
                if (p.barplot.chg) {
                    chg[j] = p.barplot.chg.data[i][j] * (p.scale ? v / p.linemax : 1);
                    haschg = true;
                }
                if (p.barplot.chh) {
                    chh[j] = p.barplot.chh.data[i][j] * (p.scale ? v / p.linemax : 1);
                    haschh = true;
                }
            }
            if (!isNaN(cg[j])) {
                bgcg[j] = p.scale ? v / p.linemax : 1;
                hasbgcg = true;
            } else if (!isNaN(chg[j])) {
                bgchg[j] = p.scale ? v / p.linemax : 1;
                hasbgchg = true;
            } else if (!isNaN(chh[j])) {
                bgchh[j] = p.scale ? v / p.linemax : 1;
                hasbgchh = true;
            }
        }
        var x = this.cumoffset(i, r[3]);
        if (hasbgcg) {
            var svd = this.barplot_base({
                data: bgcg,
                ctx: p.ctx,
                colors: {p: p.barplot.cg.bg},
                tk: {minv: 0, maxv: 1},
                rid: i,
                x: x,
                y: p.y,
                h: p.h,
                pointup: p.pointup,
                tosvg: p.tosvg
            });
            if (p.tosvg) svgdata = svgdata.concat(svd);
        }
        if (hasbgchg) {
            var svd = this.barplot_base({
                data: bgchg,
                ctx: p.ctx,
                colors: {p: p.barplot.chg.bg},
                tk: {minv: 0, maxv: 1},
                rid: i,
                x: x,
                y: p.y,
                h: p.h,
                pointup: p.pointup,
                tosvg: p.tosvg
            });
            if (p.tosvg) svgdata = svgdata.concat(svd);
        }
        if (hasbgchh) {
            var svd = this.barplot_base({
                data: bgchh,
                ctx: p.ctx,
                colors: {p: p.barplot.chh.bg},
                tk: {minv: 0, maxv: 1},
                rid: i,
                x: x,
                y: p.y,
                h: p.h,
                pointup: p.pointup,
                tosvg: p.tosvg
            });
            if (p.tosvg) svgdata = svgdata.concat(svd);
        }
        if (hascg) {
            var svd = this.barplot_base({
                data: cg,
                ctx: p.ctx,
                colors: {p: p.barplot.cg.color},
                tk: {minv: 0, maxv: 1},
                rid: i,
                x: x,
                y: p.y,
                h: p.h,
                pointup: p.pointup,
                tosvg: p.tosvg
            });
            if (p.tosvg) svgdata = svgdata.concat(svd);
        }
        if (haschg) {
            var svd = this.barplot_base({
                data: chg,
                ctx: p.ctx,
                colors: {p: p.barplot.chg.color},
                tk: {minv: 0, maxv: 1},
                rid: i,
                x: x,
                y: p.y,
                h: p.h,
                pointup: p.pointup,
                tosvg: p.tosvg
            });
            if (p.tosvg) svgdata = svgdata.concat(svd);
        }
        if (haschh) {
            var svd = this.barplot_base({
                data: chh,
                ctx: p.ctx,
                colors: {p: p.barplot.chh.color},
                tk: {minv: 0, maxv: 1},
                rid: i,
                x: x,
                y: p.y,
                h: p.h,
                pointup: p.pointup,
                tosvg: p.tosvg
            });
            if (p.tosvg) svgdata = svgdata.concat(svd);
        }
    }
    if (!p.scale) {
        var d = this.tkplot_line({
            ctx: p.ctx,
            max: p.linemax, min: 0,
            tk: p.lineplot,
            color: p.lineplot.color,
            linewidth: 1,
            x: p.x, y: p.y, w: w, h: p.h,
            pointup: p.pointup,
            tosvg: p.tosvg
        });
        if (p.tosvg) svgdata = svgdata.concat(d);
    }
    if (p.tosvg) return svgdata;
};

