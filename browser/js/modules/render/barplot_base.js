/**
 * ===BASE===// render // barplot_base .js
 * @param __Browser.prototype__
 * @param 
 */

Browser.prototype.barplot_base = function (arg) {
    /* if rid is undefined, won't apply weaving
     */
    var data = arg.data,
        ctx = arg.ctx,
        colors = arg.colors,
        tk = arg.tk,
        ridx = arg.rid, // for weaver
        initcoord = arg.initcoord, // for weaver, given for barplot
        x = arg.x, // will be incremented by weaver insert
        y = arg.y,
        pheight = arg.h,
        pointup = arg.pointup,
        w = arg.w,
        tosvg = arg.tosvg;
    var curveonly = false;
    if (tk.qtc && tk.qtc.curveonly) {
        curveonly = true;
    }

    var insertlookup = null;
    var thisregion = null;
    if (this.weaver && ridx != undefined) {
        // if ridx==-1, weaver won't apply
        thisregion = this.regionLst[ridx];
        if (initcoord == undefined) {
            initcoord = thisregion[3];
        }
        if (this.entire.atbplevel) {
            insertlookup = this.weaver.insert[ridx];
        } else {
            insertlookup = {};
            for (var c in this.weaver.insert[ridx]) {
                insertlookup[c] = this.weaver.insert[ridx][c];
            }
        }
    }
    if (!w) {
        /* bar width for each data point, preset to 1 in bev
         w set to negative to indicate reverse alignment from cotton track
         */
        w = this.entire.atbplevel ? this.entire.bpwidth : 1;
        if (thisregion && thisregion[8] && thisregion[8].item.hsp.strand == '-') {
            w = -w;
            // x already set to be position of r[3] on the right of region
        }
    }
    var max = tk.maxv,
        min = tk.minv;
    if (!colors.p) colors.p = 'rgb(184,0,92)';
    if (!colors.n) colors.n = 'rgb(0,79,158)';
    if (!colors.pth) colors.pth = colors.p;
    if (!colors.nth) colors.nth = colors.n;
    var pr, pg, pb, nr, ng, nb;
    var plothm = pheight < 20;
    if (plothm) {
        // heatmap instead of bars
        var _tmp = colorstr2int(colors.p);
        pr = _tmp[0];
        pg = _tmp[1];
        pb = _tmp[2];
        _tmp = colorstr2int(colors.n);
        nr = _tmp[0];
        ng = _tmp[1];
        nb = _tmp[2];
    }
    var svgdata = [];
    for (var i = 0; i < data.length; i++) {
        // for each data point
        var score = data[i];
        var bary = null, barh = null, barcolor = null,
            tipy = null, tipcolor = null;
        if (isNaN(score)) {
            // do nothing
        } else if (score == Infinity) {
            barcolor = colors.inf ? colors.inf : '#b5b5b5';
            if (plothm) {
                barh = pheight;
                bary = y;
            } else {
                if (max > 0 && min < 0) {
                    barh = pheight * max / (max - min);
                    bary = pointup ? y : (y + pheight - barh);
                } else {
                    bary = y;
                    barh = pheight;
                }
            }
        } else if (score == -Infinity) {
            barcolor = colors.inf ? colors.inf : '#b5b5b5';
            if (plothm) {
                barh = pheight;
                bary = y;
            } else {
                if (max > 0 && min < 0) {
                    barh = pheight * (0 - min) / (max - min);
                    bary = pointup ? (y + pheight - barh) : y;
                } else {
                    bary = y;
                    barh = pheight;
                }
            }
        } else {
            if (max > 0 && min < 0) {
                if (score >= 0) {
                    if (plothm) {
                        barh = pheight;
                        bary = y;
                        barcolor = score > max ? colors.pth : ('rgba(' + pr + ',' + pg + ',' + pb + ',' + (score / max) + ')');
                    } else {
                        barh = pheight * Math.min(score, max) / (max - min);
                        barcolor = colors.p;
                        bary = y + pheight * max / (max - min) - (pointup ? barh : 0);
                        if (score >= max) {
                            tipcolor = colors.pth;
                            tipy = pointup ? y : y + pheight - 2;
                        }
                    }
                } else {
                    if (plothm) {
                        barh = pheight;
                        bary = y;
                        barcolor = score < min ? colors.nth : ('rgba(' + nr + ',' + ng + ',' + nb + ',' + (score / (min - max)) + ')');
                    } else {
                        barh = pheight * Math.max(score, min) / (min - max);
                        barcolor = colors.n;
                        bary = y + pheight * max / (max - min) - (pointup ? 0 : barh);
                        if (score <= min) {
                            tipcolor = colors.nth;
                            tipy = pointup ? y + pheight - 2 : y;
                        }
                    }
                }
            } else if (max > 0) {
                // min max both >0
                barcolor = colors.p;
                if (score < min) {
                } else if (min > 0 && score == min) {
                    if (plothm) {
                    } else {
                        barh = 1;
                        bary = pointup ? y + pheight - 1 : y;
                    }
                } else {
                    if (plothm) {
                        barh = pheight;
                        bary = y;
                        barcolor = score >= max ? colors.pth : 'rgba(' + pr + ',' + pg + ',' + pb + ',' + ((score - min) / (max - min)) + ')';
                    } else {
                        barh = pheight * (Math.min(score, max) - min) / (max - min);
                        bary = pointup ? (y + pheight - barh) : y;
                        if (score >= max) {
                            tipcolor = colors.pth;
                            tipy = pointup ? y : y + pheight - 2;
                        }
                    }
                }
            } else {
                // min max both <= 0
                // including case when both minmax=0
                barcolor = colors.n;
                if (score > max) {
                } else if (max < 0 && score == max) {
                    if (plothm) {
                    } else {
                        barh = 1;
                        bary = pointup ? y : y + pheight - 1;
                    }
                } else {
                    if (plothm) {
                        if (min == 0 && max == 0) {
                            // case that both min max=0, draw nothing!
                        } else {
                            barh = pheight;
                            bary = y;
                            barcolor = score <= min ? colors.nth : 'rgba(' + nr + ',' + ng + ',' + nb + ',' + ((max - score) / (max - min)) + ')';
                        }
                    } else {
                        barh = pheight * (max - Math.max(score, min)) / (max - min);
                        bary = pointup ? y : (y + pheight - barh);
                        if (score <= min) {
                            tipcolor = colors.nth;
                            tipy = pointup ? y + pheight - 2 : y;
                        }
                    }
                }
            }
        }
        // svg do not accept negative width
        var svgw = w < 0 ? -w : w;
        var svgx = w < 0 ? x + w : x;
        if (barh == null) {
            if (tosvg) {
                svgdata.push({type: svgt_no});
            }
        } else {
            if (colors.barbg) {
                ctx.fillStyle = colors.barbg;
                ctx.fillRect(x, y, w, pheight);
                if (tosvg) {
                    svgdata.push({
                        type: svgt_line,
                        x1: svgx,
                        y1: y,
                        x2: svgx,
                        y2: y + pheight,
                        w: svgw,
                        color: ctx.fillStyle
                    });
                }
            }
            ctx.fillStyle = barcolor;
            ctx.fillRect(x, bary, w, curveonly ? 2 : barh);
            if (tosvg) {
                svgdata.push({type: svgt_rect, x: svgx, y: bary, w: svgw, h: barh, fill: barcolor});
            }
        }
        if (tipy) {
            ctx.fillStyle = tipcolor;
            ctx.fillRect(x, tipy, w, 2);
            if (tosvg) {
                svgdata.push({type: svgt_rect, x: svgx, y: tipy, w: svgw, h: 2, fill: tipcolor});
            }
        }
        x += w;
        if (insertlookup) {
            // consider gap
            if (this.entire.atbplevel) {
                initcoord += 1;
                if (initcoord in insertlookup) {
                    // negative w for reverse
                    x += insertlookup[initcoord] * this.entire.bpwidth * (w > 0 ? 1 : -1);
                }
            } else {
                initcoord += thisregion[7];
                for (var j = 0; j <= parseInt(thisregion[7]); j++) {
                    var thisbp = parseInt(initcoord + j);
                    if (thisbp in insertlookup) {
                        // negative w for reverse
                        x += insertlookup[thisbp] / thisregion[7] * (w > 0 ? 1 : -1);
                        delete insertlookup[thisbp];
                    }
                }
            }
        }
    }
    if (tosvg) return svgdata;
};


