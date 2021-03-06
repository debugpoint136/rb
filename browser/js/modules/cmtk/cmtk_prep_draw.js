/**
 * ===BASE===// cmtk // cmtk_prep_draw.js
 * @param __Browser.prototype__
 * @param 
 */

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

