/**
 * Created by dpuru on 2/27/15.
 */


/** __cmtk__ */

function cmtk_combine_change() {
    menu_update_track(25);
}
function cmtk_combinechg_change() {
    menu_update_track(39);
}


function cmtk_scale_change() {
    menu_update_track(26);
}
function cmtk_filter_change() {
    menu_update_track(31);
}
function cmtk_filter_kd(event) {
    if (event.keyCode == 13) cmtk_filter_change();
}

Browser.prototype.cmtk_combinestrands = function (tk) {
// combine whatever data is available
    var S = tk.cm.set;
    if (S.rd_f || S.rd_r) {
        tk.cm.data_rd = [];
    }
    if (S.cg_f || S.cg_r) {
        tk.cm.data_cg = [];
    }
    if (S.chg_f || S.chg_r) {
        tk.cm.data_chg = [];
    }
    if (S.chh_f || S.chh_r) {
        tk.cm.data_chh = [];
    }
    if ((S.rd_f && S.rd_r) || (S.cg_f && S.cg_r) || (S.chg_f && S.chg_r) || (S.chh_f && S.chh_r)) {
        // has data for reverse strand
        var bpl = this.entire.atbplevel;
        for (var i = 0; i < this.regionLst.length; i++) {
            var a = [], // rd, combined
                b = [], // cg
                c = [], // chg
                d = []; // chh
            var r = this.regionLst[i];
            var stop = bpl ? (r[4] - r[3]) : r[5];
            for (var j = 0; j < stop; j++) {
                var a1 = S.rd_f ? S.rd_f.data[i][j] : NaN;
                var a2 = S.rd_r ? S.rd_r.data[i][j] : NaN;
                /* rd
                 */
                if (isNaN(a1)) {
                    if (isNaN(a2)) {
                        a[j] = NaN;
                    } else {
                        a[j] = a2;
                    }
                } else {
                    if (isNaN(a2)) {
                        a[j] = a1;
                    } else {
                        a[j] = a1 + a2;
                    }
                }
                /* cg */
                var b1 = S.cg_f ? S.cg_f.data[i][j] : NaN;
                if (bpl) {
                    var b2 = S.cg_r ? S.cg_r.data[i][j + 1] : NaN;
                    var a3 = S.rd_r ? S.rd_r.data[i][j + 1] : NaN;
                    var a_total = (isNaN(a1) ? 0 : a1) + (isNaN(a3) ? 0 : a3);
                    if (a_total == 0) {
                        b[j] = NaN;
                    } else {
                        b[j] = ((isNaN(b1) ? 0 : (b1 * a1)) + (isNaN(b2) ? 0 : (b2 * a3))) / a_total;
                    }
                } else {
                    var b2 = S.cg_r ? S.cg_r.data[i][j] : NaN;
                    if (isNaN(a[j]) || a[j] == 0) {
                        b[j] = NaN;
                    } else {
                        b[j] = ((isNaN(b1) ? 0 : (b1 * a1)) + (isNaN(b2) ? 0 : (b2 * a2))) / a[j];
                    }
                }


                /* figure out chg/chh for "combined"
                 meanwhile apply rd filtering using rd data on respective strand
                 */
                d[j] = NaN; // chh
                var x = S.chg_f ? S.chg_f.data[i][j] : NaN;
                var x_r = S.chg_r ? S.chg_r.data[i][j] : NaN;

                if (tk.cm.combine_chg && bpl) {
                    /* new method, try to combine cag/ctg into single value
                     but not for ccg/cgg
                     but can only use cg_f/cg_r data to tell if at ccg/cgg
                     */
                    if (!isNaN(x)) {
                        if ((S.cg_f && !isNaN(S.cg_f.data[i][j + 1])) || (S.cg_r && !isNaN(S.cg_r.data[i][j + 2]))) {
                            // ccg (first c)
                            c[j] = x;
                        } else {
                            x_r = S.chg_r ? S.chg_r.data[i][j + 2] : NaN;
                            if (isNaN(x_r)) {
                                x_r = 0;
                            }
                            // merge two c: j, j+2
                            var chg_1_rd = S.rd_f.data[i][j],
                                chg_2_rd = S.rd_r.data[i][j + 2];
                            chg_2_rd = isNaN(chg_2_rd) ? 0 : chg_2_rd;
                            c[j] = c[j + 1] = c[j + 2] = ((x * chg_1_rd) + (x_r * chg_2_rd)) / (chg_1_rd + chg_2_rd);
                        }
                    } else if (!isNaN(x_r)) {
                        if ((S.cg_f && !isNaN(S.cg_f.data[i][j - 2])) || (S.cg_r && !isNaN(S.cg_r.data[i][j - 1]))) {
                            // cgg (last c)
                            c[j] = x_r;
                        } else {
                            x = S.chg_f ? S.chg_f.data[i][j - 2] : NaN;
                            if (isNaN(x)) {
                                x = 0;
                            }
                            // merge two c: j-2, j
                            var chg_1_rd = S.rd_f.data[i][j - 2],
                                chg_2_rd = S.rd_r.data[i][j];
                            chg_1_rd = isNaN(chg_1_rd) ? 0 : chg_1_rd;
                            c[j] = c[j - 1] = c[j - 2] = ((x * chg_1_rd) + (x_r * chg_2_rd)) / (chg_1_rd + chg_2_rd);
                        }
                    }
                } else {
                    /* old method
                     applies to all cases, no matter if at bp level
                     */
                    if (!isNaN(x)) {
                        c[j] = x;
                        if (tk.cm.filter && a1 < tk.cm.filter) {
                            c[j] = NaN;
                        }
                    } else {
                        if (!isNaN(x_r)) {
                            c[j] = x_r;
                            if (tk.cm.filter && a2 < tk.cm.filter) {
                                c[j] = NaN;
                            }
                        }
                    }
                }

                // chh
                var x = S.chh_f ? S.chh_f.data[i][j] : NaN;
                if (!isNaN(x)) {
                    d[j] = x;
                    if (tk.cm.filter && a1 < tk.cm.filter) {
                        d[j] = NaN;
                    }
                } else {
                    x = S.chh_r ? S.chh_r.data[i][j] : NaN;
                    if (!isNaN(x)) {
                        d[j] = x;
                        if (tk.cm.filter && a2 < tk.cm.filter) {
                            d[j] = NaN;
                        }
                    }
                }
            }
            if (tk.cm.data_rd) {
                tk.cm.data_rd.push(a);
            }
            if (tk.cm.data_cg) {
                tk.cm.data_cg.push(b);
            }
            if (tk.cm.data_chg) {
                tk.cm.data_chg.push(c);
            }
            if (tk.cm.data_chh) {
                tk.cm.data_chh.push(d);
            }
        }
    } else {
        // no reverse data
        if (S.rd_f) {
            tk.cm.data_rd = S.rd_f.data;
        }
        if (S.cg_f) {
            tk.cm.data_cg = S.cg_f.data;
        }
        if (S.chg_f) {
            tk.cm.data_chg = S.chg_f.data;
        }
        if (S.chh_f) {
            tk.cm.data_chh = S.chh_f.data;
        }
    }
};

Browser.prototype.cmtk_prep_draw = function (tk, tosvg) {
    tk.canvas.width = this.entire.spnum;
    var ctx = tk.canvas.getContext('2d');
// may be unitialized
    if (tk.cm.set.isfirst) {
        delete tk.cm.set.isfirst;
        this.cmtk_init(tk);
    }
    var S = tk.cm.set;
    if (S.rd_f.qtc.smooth) {
        smooth_tkdata(S.rd_f);
    }
    if (S.rd_r && S.rd_r.qtc.smooth) {
        smooth_tkdata(S.rd_r);
    }
    tk.canvas.height = cmtk_height(tk);
    var svgdata = [];
    if (tk.cm.combine) {
        /* combine two strands, mainly for rd and cg
         for asymetrical chg/chh level, they always belong to single strand so combining doesn't matter
         */
        this.cmtk_combinestrands(tk);
        svgdata = this.tkplot_cm({
            cm: tk.cm,
            ctx: ctx,
            lineplot: {
                data: tk.cm.data_rd,
                color: tk.cm.color.rd_f,
            },
            barplot: {
                cg: {
                    data: tk.cm.data_cg,
                    color: tk.cm.color.cg_f,
                    bg: tk.cm.bg.cg_f
                },
                chg: (tk.cm.data_chg ? {
                    data: tk.cm.data_chg,
                    color: tk.cm.color.chg_f,
                    bg: tk.cm.bg.chg_f
                } : null),
                chh: (tk.cm.data_chh ? {
                    data: tk.cm.data_chh,
                    color: tk.cm.color.chh_f,
                    bg: tk.cm.bg.chh_f
                } : null),
            },
            scale: tk.cm.scale,
            pointup: true,
            x: 0,
            y: densitydecorpaddingtop,
            h: tk.qtc.height,
            tosvg: tosvg
        });
    } else {
        // two strands separate
        if (!S.rd_f) fatalError('missing essential track: read depth, forward');
        if (!S.cg_f) fatalError('missing essential track: CG level, forward');
        // if reverse strand is available, use max rd from both strands
        var rdmax = qtrack_getthreshold(S.rd_f.data, {thtype: scale_auto}, this.dspBoundary.vstartr, this.dspBoundary.vstopr, this.dspBoundary.vstarts, this.dspBoundary.vstops)[0];
        if (rdmax == null) {
            rdmax = 0;
        }
        if (S.rd_r) {
            var x = qtrack_getthreshold(S.rd_r.data, {thtype: scale_auto}, this.dspBoundary.vstartr, this.dspBoundary.vstopr, this.dspBoundary.vstarts, this.dspBoundary.vstops)[0];
            if (x == null) {
                x = 0;
            }
            if (x > rdmax) rdmax = x;
        }
        tk.cm.rdmax = rdmax;
        // plot forward strand
        svgdata = this.tkplot_cm({
            cm: tk.cm,
            ctx: ctx,
            lineplot: {
                data: S.rd_f.data,
                color: tk.cm.color.rd_f,
            },
            linemax: rdmax,
            barplot: {
                cg: {
                    data: S.cg_f.data,
                    color: tk.cm.color.cg_f,
                    bg: tk.cm.bg.cg_f
                },
                chg: (S.chg_f ? {
                    data: S.chg_f.data,
                    color: tk.cm.color.chg_f,
                    bg: tk.cm.bg.chg_f
                } : null),
                chh: (S.chh_f ? {
                    data: S.chh_f.data,
                    color: tk.cm.color.chh_f,
                    bg: tk.cm.bg.chh_f
                } : null),
            },
            scale: tk.cm.scale,
            pointup: true,
            x: 0,
            y: densitydecorpaddingtop,
            h: tk.qtc.height,
            tosvg: tosvg
        });

        if (S.rd_r) {
            if (!S.cg_r) fatalError('missing essential track: CG level, reverse');
            ctx.fillStyle = colorCentral.foreground_faint_1;
            var y = densitydecorpaddingtop + tk.qtc.height;
            ctx.fillRect(0, y, tk.canvas.width, 1);
            if (tosvg) svgdata.push({
                type: svgt_line_notscrollable,
                x1: 0,
                y1: y,
                x2: this.hmSpan,
                y2: y,
                color: ctx.fillStyle
            });
            var d2 = this.tkplot_cm({
                cm: tk.cm,
                ctx: ctx,
                lineplot: {
                    data: S.rd_r.data,
                    color: tk.cm.color.rd_r,
                },
                linemax: rdmax,
                barplot: {
                    cg: {
                        data: S.cg_r.data,
                        color: tk.cm.color.cg_r,
                        bg: tk.cm.bg.cg_r
                    },
                    chg: (S.chg_r ? {
                        data: S.chg_r.data,
                        color: tk.cm.color.chg_r,
                        bg: tk.cm.bg.chg_r
                    } : null),
                    chh: (S.chh_r ? {
                        data: S.chh_r.data,
                        color: tk.cm.color.chh_r,
                        bg: tk.cm.bg.chh_r
                    } : null),
                },
                scale: tk.cm.scale,
                pointup: false,
                x: 0,
                y: y + 1,
                h: tk.qtc.height,
                tosvg: tosvg
            });
            if (tosvg) svgdata = svgdata.concat(d2);
        }
    }
    if (!this.hmheaderdiv) {
        // draw scale on canvas
        if (tk.cm.combine || !tk.cm.set.rd_r) {
            var min = 0, max;
            if (tk.cm.scale) {
                max = parseInt(tk.cm.rdmax);
            } else {
                max = 1;
            }
            var d = plot_ruler({
                ctx: ctx,
                stop: densitydecorpaddingtop,
                start: densitydecorpaddingtop + tk.qtc.height - 1,
                xoffset: this.hmSpan - this.move.styleLeft - 10,
                horizontal: false,
                color: colorCentral.foreground,
                min: 0,
                max: max,
                extremeonly: true,
                max_offset: -4,
                tosvg: tosvg,
                scrollable: true,
            });
            if (tosvg) svgdata = svgdata.concat(d);
        } else {
            ctx.fillStyle = colorCentral.foreground;
            var d = drawscale_compoundtk({
                ctx: ctx,
                x: this.hmSpan - this.move.styleLeft - 10,
                y: densitydecorpaddingtop,
                h: tk.qtc.height,
                v1: tk.cm.scale ? parseInt(tk.cm.rdmax) : 1,
                v2: 0,
                v3: tk.cm.scale ? parseInt(tk.cm.rdmax) : 1,
                scrollable: true,
                tosvg: tosvg
            });
            if (tosvg) svgdata = svgdata.concat(d);
        }
    }
    if (tosvg) return svgdata;
};

Browser.prototype.cmtk_init = function (tk) {
// arg is master cm tkobj
    for (var n in tk.cm.set) {
        var n2 = tk.cm.set[n];
        var t = this.findTrack(n2);
        if (!t) {
            print2console('methylC track is missing a member track: ' + n2, 2);
            alertbox_addmsg({text: 'methylC track "' + tk.label + '" is dropped because it is missing member track for ' + n2});
            delete tk.cm.set[n];
        } else {
            t.mastertk = tk;
            tk.cm.set[n] = t;
            t.canvas.style.display = 'none';
            if (t.header) t.header.style.display = 'none';
            if (t.atC) t.atC.style.display = 'none';
        }
    }
};


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

function cmtk_detail(tk, A, B) {
// A: region id, B: spnum
    if (tk.cm.combine) {
        var a = tk.cm.data_cg[A][B];
        var d = tk.cm.data_rd[A][B];
        var b = NaN, // chg
            b_rd; // chg rd, asymmetrical, use rd data on original strand!!
        if (tk.cm.data_chg) {
            b = tk.cm.data_chg[A][B];
            if (!isNaN(b)) {
                if (isNaN(tk.cm.set.chg_f.data[A][B])) {
                    b_rd = tk.cm.set.rd_r.data[A][B];
                } else {
                    b_rd = tk.cm.set.rd_f.data[A][B];
                }
            }
        }
        var c = NaN, // chh
            c_rd; // chh rd
        if (tk.cm.data_chh) {
            c = tk.cm.data_chh[A][B];
            if (!isNaN(c)) {
                if (isNaN(tk.cm.set.chh_f.data[A][B])) {
                    c_rd = tk.cm.set.rd_r.data[A][B];
                } else {
                    c_rd = tk.cm.set.rd_f.data[A][B];
                }
            }
        }
        return '<div style="color:white;"><table style="margin:5px;color:inherit;"><tr>' +
            (isNaN(d) ? '<td colspan=2>no reads</td>' : '<td>Combined read depth</td><td>' + parseInt(d) + '</td>') + '</tr><tr>' +
            (isNaN(a) ? '' : '<td><div class=squarecell style="display:inline-block;background-color:' + tk.cm.color.cg_f + ';"></div> CG</td><td>' + neat_0t1(a) + '</td>') +
            '</tr><tr>' +
                // chg
            (isNaN(b) ? '' : '<td><div class=squarecell style="display:inline-block;background-color:' + tk.cm.color.chg_f + ';"></div> CHG</td><td>' + neat_0t1(b) +
            (tk.cm.combine_chg ? '' : ' <span style="font-size:70%">(strand-specific read depth: ' + parseInt(b_rd) + ')</span>') +
            '</td>') +
            '</tr><tr>' +
                // chh
            (isNaN(c) ? '' : '<td><div class=squarecell style="display:inline-block;background-color:' + tk.cm.color.chh_f + ';"></div> CHH</td><td>' + neat_0t1(c) + ' <span style="font-size:70%">(strand-specific read depth: ' + parseInt(c_rd) + ')</span></td>') +
            '</tr></table>' +
            '</div>';
    }
    var s = tk.cm.set;
    var a1 = s.cg_f.data[A][B],
        b1 = s.chg_f ? s.chg_f.data[A][B] : NaN,
        c1 = s.chh_f ? s.chh_f.data[A][B] : NaN,
        d1 = s.rd_f.data[A][B],
        a2 = s.cg_r ? s.cg_r.data[A][B] : NaN,
        b2 = s.chg_r ? s.chg_r.data[A][B] : NaN,
        c2 = s.chh_r ? s.chh_r.data[A][B] : NaN,
        d2 = s.rd_r ? s.rd_r.data[A][B] : NaN;
    return '<div style="color:white;"><table style="margin:5px;color:inherit;">' +
        '<tr><td style="font-size:150%">&raquo;</td>' +
        (isNaN(d1) ? '<td colspan=2>no reads</td>' : '<td>Read depth</td><td>' + parseInt(d1) + '</td>') +
        '</tr><tr><td></td>' +
        (isNaN(a1) ? '' : '<td><div class=squarecell style="display:inline-block;background-color:' + tk.cm.color.cg_f + ';"></div> CG</td><td>' + neat_0t1(a1) + '</td>') +
        '</tr><tr><td></td>' +
        (isNaN(b1) ? '' : '<td><div class=squarecell style="display:inline-block;background-color:' + tk.cm.color.chg_f + ';"></div> CHG</td><td>' + neat_0t1(b1) + '</td>') +
        '</tr><tr><td></td>' +
        (isNaN(c1) ? '' : '<td><div class=squarecell style="display:inline-block;background-color:' + tk.cm.color.chh_f + ';"></div> CHH</td><td>' + neat_0t1(c1) + '</td>') +
        '</tr><tr><td style="font-size:150%;">&laquo;</td>' +
        (isNaN(d2) ? '<td colspan=2>no reads</td>' : '<td>Read depth</td><td>' + parseInt(d2) + '</td>') +
        '</tr><tr><td></td>' +
        (isNaN(a2) ? '' : '<td><div class=squarecell style="display:inline-block;background-color:' + tk.cm.color.cg_r + ';"></div> CG</td><td>' + neat_0t1(a2) + '</td>') +
        '</tr><tr><td></td>' +
        (isNaN(b2) ? '' : '<td><div class=squarecell style="display:inline-block;background-color:' + tk.cm.color.chg_r + ';"></div> CHG</td><td>' + neat_0t1(b2) + '</td>') +
        '</tr><tr><td></td>' +
        (isNaN(c2) ? '' : '<td><div class=squarecell style="display:inline-block;background-color:' + tk.cm.color.chh_r + ';"></div> CHH</td><td>' + neat_0t1(c2) + '</td>') +
        '</tr></table>' +
        '</div>';
}
/** __cmtk__ ends */