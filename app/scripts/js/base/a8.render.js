/*** __render__ ***/

function catetk_plot_base(data, cateInfo, startidx, stopidx, ctx, qtc, x, y, w, h, tosvg) {
    var s = [];
    for (var i = startidx; i <= stopidx; i++) {
        var c = cateInfo[data[i]][1];
        if (c) {
            ctx.fillStyle = c;
            ctx.fillRect(x, y, w, h);
            if (tosvg) {
                s.push({type: svgt_rect, x: x, y: y, w: w, h: h, fill: c});
            }
        }
        x += w;
    }
    if (tosvg) return s;
}

Browser.prototype.init_hmSpan = function () {
    var tobe = document.body.clientWidth - this.leftColumnWidth - 140;
    if (tobe < 800)
        this.hmSpan = 800;
    else
        this.hmSpan = parseInt(tobe / 10) * 10; // well, just to cope with letter display
};

Browser.prototype.applyHmspan2holders = function () {
    if (this.navigator != null) {
        // in case of using splinters, need to sum up splinter width
        var s = this.hmSpan;
        for (var tag in this.splinters) {
            s += this.splinters[tag].hmSpan;
        }
        /* look through pending splinters (not working)
         for(var a in horcrux) {
         var b=horcrux[a];
         if(b.trunk && b.trunk.horcrux==this.horcrux) {
         s+=b.hmSpan;
         }
         }
         */
        this.navigator.canvas.width = s - 30;
    }
    if (this.scalebar != null) {
        this.scalebar.holder.style.width = this.hmSpan;
    }
    if (this.rulercanvas != null) {
        this.rulercanvas.parentNode.style.width = this.hmSpan;
    }
    this.hmdiv.parentNode.style.width =
        this.decordiv.parentNode.style.width =
            this.ideogram.canvas.parentNode.parentNode.style.width = this.hmSpan;
};

Browser.prototype.render_browser = function (tosvg) {
    /* render browser panel, all tracks and all the stuff must be ready
     not including bev, circlet, ...
     called for:
     - initiating browser panel
     - changedb
     - restoring status
     - change ghm width
     */

    this.drawRuler_browser(tosvg);
    this.drawTrack_browser_all();
    this.drawMcm(tosvg);
    this.mcmPlaceheader();
    this.drawIdeogram_browser(tosvg);
    this.scalebarSlider_fill();
    this.drawNavigator();
};


Browser.prototype.tklst_yscale = function (tklst) {
    /* get Y-range from a group of tk
     always use auto scale
     this is from visual range only!
     */
    var max = null, min = null, max2 = null, min2 = null;
    /* max/min are not normalized, used for rendering
     max2/min2 maybe normalized, used for label printing
     */
    for (var i = 0; i < tklst.length; i++) {
        var tk = tklst[i];
        if (tk.qtc.smooth && !tk.data) {
            /* this happens when loading cust tk in a group, with smooth window applied
             */
            if (!tk.data_raw) fatalError('missing .data_raw: ' + tk.name);
            tk.data = tk.data_raw;
        }
        var thv = this.get_tkyscale(tk);
        if (thv[0] == null || thv[1] == null) continue;
        if (max == null || thv[0] > max) max = thv[0];
        if (min == null || thv[1] < min) min = thv[1];
        // apply normalization
        var a = this.track_normalize(tk, thv[0]);
        var b = this.track_normalize(tk, thv[1]);
        if (max2 == null || a > max2) max2 = a;
        if (min2 == null || b < min2) min2 = b;
    }
    return [max, min, max2, min2];
};

Browser.prototype.track_normalize = function (tk, v) {
    /* normalize a value given rules in a track
     TODO this is rpm/bp, apply other rules
     */
    if (!tk.normalize) return v;
    v = v * 1000000 / tk.normalize.total_mapped_reads;
    if (this.entire.atbplevel) return v;
    return v /= this.entire.summarySize;
};


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

Browser.prototype.drawTrack_browser_all = function () {
    /**** track group
     grouped tracks shares y scale
     shared scale will only be computed here
     but not when updating a single track
     assume that this func will always be called for track updating
     Note:
     can get Y scale directly from numerical tracks
     BUT hammock tracks need to be stacked first then get Y scale
     */
    var bbj = this;
    var callfromtrunk = false;
    if (this.trunk) {
        /* if scrolling splinters, numerical track scale must be kept sync, must switch to trunk for calling
         */
        var usescale = false;
        for (var i = 0; i < this.tklst.length; i++) {
            var t = this.tklst[i];
            if (tkishidden(t) || t.cotton) continue;
            if (isNumerical(t) || t.mode == M_bar || t.ft == FT_matplot) {
                usescale = true;
                break;
            }
        }
        if (usescale) {
            bbj = this.trunk;
            callfromtrunk = true;
        }
    }

// stack hammock tracks
    for (var i = 0; i < bbj.tklst.length; i++) {
        bbj.stack_track(bbj.tklst[i], 0);
    }

    if (callfromtrunk) {
        for (var h in bbj.splinters) {
            var b = bbj.splinters[h];
            for (var i = 0; i < b.tklst.length; i++) {
                b.stack_track(b.tklst[i], 0);
            }
        }
    }
// prepare track groups
    var gidxhash = {};
    for (var i = 0; i < bbj.tklst.length; i++) {
        var gidx = bbj.tklst[i].group;
        if (gidx != undefined) {
            gidxhash[gidx] = 1;
        }
    }
    for (var gidx in gidxhash) {
        if (!bbj.tkgroup[gidx]) {
            /* on starting up, tkgroup not initiated yet
             may move this part to somewhere else?
             */
            bbj.tkgroup[gidx] = {scale: scale_auto};
        }
        bbj.tkgroup_setYscale(gidx);
    }
    for (var i = 0; i < bbj.tklst.length; i++) {
        bbj.drawTrack_browser(bbj.tklst[i], false);
    }
    bbj.trackHeightChanged();
    bbj.placeMovable(bbj.move.styleLeft);
    if (callfromtrunk) {
        for (var h in bbj.splinters) {
            var b = bbj.splinters[h];
            b.trackHeightChanged();
            b.placeMovable(b.move.styleLeft);
        }
    }
};


Browser.prototype.drawMcm = function () {
    for (var i = 0; i < this.tklst.length; i++) {
        var t = this.tklst[i];
        if (tkishidden(t)) continue;
        this.drawMcm_onetrack(t, false);
        t.atC.style.display = t.where == 1 ? 'block' : 'none';
    }
};


Browser.prototype.barplot_uniform = function (arg) {
    if (arg.start >= arg.stop) return [];
    arg.x = this.cumoffset(arg.rid, arg.start);
    arg.initcoord = arg.start;
    var slst = [];
    if (this.entire.atbplevel) {
        for (var i = arg.start; i < arg.stop; i++) {
            slst.push(arg.score);
        }
    } else {
        var a = arg.start;
        while (a < arg.stop) {
            slst.push(arg.score);
            a += this.regionLst[arg.rid][7];
        }
    }
    delete arg.score;
    delete arg.start;
    delete arg.stop;
    arg.data = slst;
    return this.barplot_base(arg);
};

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


Browser.prototype.tkplot_line = function (p) {
    /*
     .x/y: start position
     .w: unit width
     .h: plot range height
     .tk: {data:[], normalize:null}
     */
    p.ctx.strokeStyle = p.color;
    p.ctx.lineWidth = p.linewidth;
    var svgdata = [];
    var pasth = null;
    var x = p.x;
    var sf = p.h / (p.max - p.min);
    p.ctx.beginPath();
    for (var i = 0; i < this.regionLst.length; i++) {
        var r = this.regionLst[i];
        var stop = this.entire.atbplevel ? (r[4] - r[3]) : r[5];
        var w = p.w;
        var initcoord = r[3];
        if (r[8]) {
            if (r[8].item.hsp.strand == '-') {
                w = -w;
            }
            // disregard p.x, but must not use [8].canvasxoffset
            x = this.cumoffset(i, initcoord);
        }

        var insertlookup = null;
        if (this.weaver) {
            if (this.entire.atbplevel) {
                insertlookup = this.weaver.insert[i];
            } else {
                insertlookup = {};
                for (var c in this.weaver.insert[i]) {
                    insertlookup[c] = this.weaver.insert[i][c];
                }
            }
        }

        for (var j = 0; j < stop; j++) {
            var v = p.tk.data[i][j];
            if (isNaN(v)) {
                pasth = null;
            } else {
                v = this.track_normalize(p.tk, v);
                var h = sf * (v - p.min);
                var b, // past bar y
                    d; // current bar y
                if (p.pointup) {
                    b = p.y + p.h - pasth;
                    d = p.y + p.h - h;
                } else {
                    b = p.y + pasth;
                    d = p.y + h;
                }
                if (pasth != null) {
                    p.ctx.moveTo(x, b);
                    p.ctx.lineTo(x, d);
                    if (p.tosvg) svgdata.push({
                        type: svgt_line,
                        x1: x,
                        y1: b,
                        x2: x,
                        y2: d,
                        color: p.color,
                        w: p.linewidth
                    });
                }
                p.ctx.moveTo(x, d);
                p.ctx.lineTo(x + w, d);
                if (p.tosvg) svgdata.push({
                    type: svgt_line,
                    x1: x,
                    y1: d,
                    x2: x + w,
                    y2: d,
                    color: p.color,
                    w: p.linewidth
                });
                pasth = h;
            }
            x += w;

            if (insertlookup) {
                if (this.entire.atbplevel) {
                    initcoord += 1;
                    if (initcoord in insertlookup) {
                        // negative w for reverse
                        x += insertlookup[initcoord] * this.entire.bpwidth * (w > 0 ? 1 : -1);
                    }
                } else {
                    initcoord += r[7];
                    for (var k = 0; k <= parseInt(r[7]); k++) {
                        var thisbp = parseInt(initcoord + k);
                        if (thisbp in insertlookup) {
                            // negative w for reverse
                            x += insertlookup[thisbp] / r[7] * (w > 0 ? 1 : -1);
                            delete insertlookup[thisbp];
                        }
                    }
                }
            }

        }
        x += regionSpacing.width;
    }
    p.ctx.stroke();
    if (p.tosvg) return svgdata;
};

function printbp_scrollable(ctx, b, x, y, w, h, tosvg) {
    var bp = b.toLowerCase();
    if (!(bp in ntbcolor)) return [];
    ctx.fillStyle = ntbcolor[bp];
    ctx.fillRect(x, y, w, h);
    var svgdata = [];
    if (tosvg) svgdata.push({type: svgt_rect, x: x, y: y, w: w, h: h, fill: ctx.fillStyle});
    if (w >= MAXbpwidth) {
        ctx.fillStyle = 'white';
        ctx.font = w >= MAXbpwidth_bold ? "bold 10pt Sans-serif" : "8pt Sans-serif";
        var y2 = y + h / 2 + 4;
        ctx.fillText(b, x, y2);
        if (tosvg) svgdata.push({type: svgt_text, x: x, y: y2, text: b, color: ctx.fillStyle});
    }
    return svgdata;
}

Browser.prototype.seq2ideogram = function (data) {
    if (!data) {
        data = {abort: 'Server error when fetching sequence'};
    }
    var svgdata = [];
    var canvas = this.ideogram.canvas;
    canvas.height = canvas.parentNode.parentNode.parentNode.style.height = ideoHeight + cbarHeight;
    var ctx = canvas.getContext('2d');
    if (data.abort) {
        var s = data.abort;
        var sp = this.hmSpan / 2 - this.move.styleLeft - ctx.measureText(s).width / 2;
        ctx.fillText(s, sp, 14);
        return;
    }
    if (!data.lst) fatalError('.lst missing');
    var seqlst = data.lst;
    for (var i = 0; i < this.regionLst.length; i++) {
        var r = this.regionLst[i];
        var s = data.lst[i];
        if (!s || s == 'ERROR') {
            ctx.fillStyle = 'black';
            ctx.fillRect(this.cumoffset(i, r[3]), 0, this.bp2sw(i, r[4] - r[3]), ideoHeight);
            continue;
        }
        for (var j = 0; j < s.length; j++) {
            var _x = this.cumoffset(i, r[3] + j);
            // beware that cumoffset treats gap to be after the coord, but need to flip it!!
            if (this.weaver) {
                var _g = this.weaver.insert[i][r[3] + j];
                if (_g) _x += _g * this.entire.bpwidth;
            }
            if (_x >= 0) {
                var _s = printbp_scrollable(ctx, s[j], _x, 0, this.entire.bpwidth, ideoHeight, true);
                svgdata = svgdata.concat(_s);
            }
        }
    }
    if (this.basepairlegendcanvas) {
        this.basepairlegendcanvas.style.display = 'block';
        this.drawATCGlegend(false);
    }
    this.draw_coordnote();
    this.ideogram.svgdata = svgdata;
};


Browser.prototype.drawIdeogram_browser = function (tosvg) {
    if (!this.ideogram.canvas) return;
// different run mode get various graph, they override each other
    this.ideogram.canvas.width = this.entire.spnum;
    this.ideogram.canvas.height =
        this.ideogram.canvas.parentNode.parentNode.parentNode.style.height = ideoHeight + cbarHeight;
    if (this.basepairlegendcanvas) {
        this.basepairlegendcanvas.style.display = "none";
    }
    var ctx = this.ideogram.canvas.getContext('2d');
    var svgdata = [];

    if (this.genome.temporal_ymd) {
        // at day-precision, draw boxes of month
        ctx.fillStyle = colorCentral.foreground;
        var x = 0; // month offset
        var x2 = 0; // year offset
        var lastyear = null;
        for (var i = 0; i < this.regionLst.length; i++) {
            var r = this.regionLst[i];
            var w = r[5];
            ctx.fillRect(x + w, 2, 1, ideoHeight - 4);
            if (tosvg) svgdata.push({type: svgt_line, x1: x + w, y1: 2, x2: x + w, y2: ideoHeight - 4});
            var mh = parseInt(r[1] / 100);
            var w2 = ctx.measureText(month2str[mh]).width;
            var q = x + w / 2 - w2 / 2;
            if (w2 + 20 <= w) {
                ctx.fillText(month2str[mh], q, 10);
                if (tosvg) svgdata.push({type: svgt_text, x: q, y: 10, text: month2str[mh]});
            } else {
                w2 = ctx.measureText(month2sstr[mh]).width;
                if (w2 + 20 <= w) {
                    q = x + w / 2 - w2 / 2;
                    ctx.fillText(month2sstr[mh], q, 10);
                    if (tosvg) svgdata.push({type: svgt_text, x: q, y: 10, text: month2str[mh]});
                }
            }
            if (lastyear == null) {
                lastyear = r[0];
            } else if (r[0] != lastyear) {
                var q = x2 - regionSpacing.width;
                ctx.fillRect(q, ideoHeight, 1, 8);
                if (tosvg) svgdata.push({type: svgt_line, x1: q, y1: ideoHeight, x2: q, y2: ideoHeight + 8});
                w2 = ctx.measureText(lastyear).width;
                if (w2 + 10 <= x - x2) {
                    ctx.fillText(lastyear, x2 + (x - x2) / 2 - w2 / 2, this.ideogram.canvas.height);
                    if (tosvg) svgdata.push({
                        type: svgt_text,
                        x: x2 + (x - x2) / 2 - w2 / 2,
                        y: this.ideogram.canvas.height,
                        text: lastyear
                    });
                }
                lastyear = r[0];
                x2 = x;
            }
            x += w + regionSpacing.width;
        }
        w2 = ctx.measureText(lastyear).width;
        if (w2 + 10 <= x - x2) {
            ctx.fillText(lastyear, x2 + (x - x2) / 2 - w2 / 2, this.ideogram.canvas.height);
            if (tosvg) svgdata.push({
                type: svgt_text,
                x: x2 + (x - x2) / 2 - w2 / 2,
                y: this.ideogram.canvas.height,
                text: lastyear
            });
        }
        return svgdata;
    }
    if (this.juxtaposition.type == RM_protein) {
        // render without protein sequence
        return;
    }
    if (this.entire.atbplevel) {
        /*** query and display chromosomal sequence */
        var lst = [];
        // querying seq for all regions, instead of those within wings
        for (var i = 0; i < this.regionLst.length; i++) {
            var r = this.regionLst[i];
            lst.push(r[0]);
            lst.push(r[3]);
            lst.push(r[4]);
        }
        if (this.basepairlegendcanvas) {
            this.basepairlegendcanvas.style.display = "block";
            this.drawATCGlegend(true);
        }
        var bbj = this;
        if (this.genome.scaffold.fileurl) {
            this.ajax('getChromseq=on&url=' + this.genome.scaffold.fileurl + '&regionlst=' + lst.join(',') + this.genome.customgenomeparam(), function (data) {
                bbj.seq2ideogram(data);
            });
        } else if (!this.genome.iscustom && !this.genome.noblastdb) {
            this.ajax('getChromseq=on&regionlst=' + lst.join(',') + '&dbName=' + this.genome.name, function (data) {
                bbj.seq2ideogram(data);
            });
        }
        return;
    }
    if (this.is_gsv()) {
        /* gsv, drawing stack of boxes to indicate items
         item names are hidden if they are wider than the box
         */
        ctx.font = "8pt Sans-serif";
        for (var i = 0; i < this.regionLst.length; i++) {
            var r = this.regionLst[i];
            // check if to paint flank
            var fcoord = this.genesetview.flanking[r[6]];
            if (fcoord && fcoord.a5 >= 0 && fcoord.b5 >= 0) {
                // has 5' flank
                var s = this.tkcd_box({
                    ctx: ctx,
                    rid: i,
                    start: fcoord.a5,
                    stop: fcoord.b5,
                    y: 0.5,
                    h: ideoHeight - 1,
                    fill: this.genesetview.ideogram_fill5,
                    nojoin: true,
                    tosvg: tosvg,
                });
                if (tosvg) svgdata = svgdata.concat(s);
            }
            if (fcoord && fcoord.a3 >= 0 && fcoord.b3 >= 0) {
                // has 3' flank
                var s = this.tkcd_box({
                    ctx: ctx,
                    rid: i,
                    start: fcoord.a3,
                    stop: fcoord.b3,
                    y: 0.5,
                    h: ideoHeight - 1,
                    fill: this.genesetview.ideogram_fill3,
                    nojoin: true,
                    tosvg: tosvg,
                });
                if (tosvg) svgdata = svgdata.concat(s);
            }
            // bigbox
            var s = this.tkcd_box({
                ctx: ctx,
                rid: i,
                start: r[3],
                stop: r[4],
                y: 0.5,
                h: ideoHeight - 1,
                edge: this.genesetview.ideogram_stroke,
                text: r[6],
                texty: 10,
                tosvg: tosvg,
            });
            if (tosvg) svgdata = svgdata.concat(s);
        }
        this.draw_coordnote();
        return svgdata;
    }

    /* cytoband */
    ctx.font = "bold 8pt Sans-serif";
    for (var i = 0; i < this.regionLst.length; i++) {
        var r = this.regionLst[i];
        var chrcy = this.genome.cytoband[r[0]];
        if (chrcy) {
            for (var j = 0; j < chrcy.length; j++) {
                var cy = chrcy[j];
                if (Math.max(r[3], cy[0]) < Math.min(r[4], cy[1])) {
                    var a = cytoBandColor[cy[2]], b = cytoWordColor[cy[2]];
                    var s = this.tkcd_box({
                        ctx: ctx, rid: i,
                        start: cy[0],
                        stop: cy[1],
                        y: 0,
                        h: ideoHeight,
                        fill: 'rgb(' + a + ',' + a + ',' + a + ')',
                        nojoin: true,
                        text: cy[3],
                        textcolor: 'rgb(' + b + ',' + b + ',' + b + ')',
                        texty: 10,
                        tosvg: tosvg,
                    });
                    if (tosvg) svgdata = svgdata.concat(s);
                }
            }
            var s = this.tkcd_box({
                ctx: ctx, rid: i,
                start: r[3],
                stop: r[4],
                y: .5,
                h: ideoHeight - 1,
                edge: colorCentral.foreground,
                tosvg: tosvg,
            });
            if (tosvg) svgdata = svgdata.concat(s);
        } else {
            var s = this.tkcd_box({
                ctx: ctx, rid: i,
                text: 'no cytoband data',
                edge: colorCentral.foreground_faint_5,
                y: .5,
                h: ideoHeight - 1,
                start: r[3],
                stop: r[4],
                texty: 10,
            });
            if (tosvg) svgdata = svgdata.concat(s);
        }
    }

// plot chr name on second row, merging same chr names for adjacent regions
    ctx.fillStyle = colorCentral.foreground;
// chr of first region
    var previouschrname = this.regionLst[0][0];
    var previouschrstart = 0;
    var xoffset = this.cumoffset(0, this.regionLst[0][4]);
    var y = ideoHeight + 2;
    for (i = 1; i < this.regionLst.length; i++) {
        var thisr = this.regionLst[i];
        if (previouschrname != thisr[0]) {
            // plot previous chr name
            var w = ctx.measureText(previouschrname).width;
            if (w < xoffset - previouschrstart) {
                var q = previouschrstart + (xoffset - previouschrstart - w) / 2;
                ctx.fillText(previouschrname, q, y + 7);
                if (tosvg) svgdata.push({type: svgt_text, x: q, y: y + 7, text: previouschrname});
            }
            var a = xoffset,
                b = ideoHeight + 2,
                c = ideoHeight + cbarHeight - 2;
            ctx.fillRect(a, b, 1, c);
            if (tosvg) svgdata.push({type: svgt_line, x1: a, y1: b, x2: a, y2: b + c});
            previouschrname = thisr[0];
            previouschrstart = xoffset;
        }
        xoffset = this.cumoffset(i, thisr[4]);
    }
// last chr
    var a = xoffset - 1,
        b = ideoHeight + 2,
        c = ideoHeight + cbarHeight - 2;
    ctx.fillRect(a, b, 1, c);
    if (tosvg) svgdata.push({type: svgt_line, x1: a, y1: b, x2: a, y2: b + c});
    var w = ctx.measureText(previouschrname).width;
    if (w < xoffset - previouschrstart) {
        a = previouschrstart + (xoffset - previouschrstart - w) / 2;
        ctx.fillText(previouschrname, a, y + 7);
        if (tosvg) svgdata.push({type: svgt_text, x: a, y: y + 7, text: previouschrname});
    }
    this.draw_coordnote();
    return svgdata;
};


Browser.prototype.tkcd_item = function (arg) {
// tk canvas draw singular item, within one region
// TODO irrespective of full/thin, adjust by thickness value
    var item = arg.item,
        y = arg.y,
        stackHeight = arg.stackHeight,
        ctx = arg.ctx,
        tosvg = arg.tosvg;
    var svgdata = [];
    var thisregion = this.regionLst[arg.region_idx];

    var regioninsert = {};
    if (this.weaver) {
        regioninsert = this.weaver.insert[arg.region_idx];
    }

// need method of computing anti color against arg.bedcolor
    arg.anticolor = colorCentral.background;

    if (arg.tkobj.ft == FT_weaver_c) {
        // must be target bbj drawing weavertk in fine mode
        if (item.hsp.targetstart >= item.hsp.targetstop) {
            print2console(arg.tkobj.cotton + ' hsp start>stop', 2);
            return [];
        }
        var s = this.tkcd_box({
            ctx: ctx,
            rid: arg.region_idx,
            start: item.hsp.targetstart,
            stop: item.hsp.targetstop,
            y: y,
            h: weavertkseqh,
            fill: weavertkcolor_target,
            tosvg: tosvg,
        });
        if (tosvg) svgdata = svgdata.concat(s);
        y += weavertkseqh + weavertkalnh;

        var bpl = this.entire.atbplevel;
        var fvd = item.hsp.strand == '+';

        var x = x_0 = this.cumoffset(arg.region_idx, item.hsp.targetstart);

        var incarr = this.weaver_gotgap(arg.region_idx);
        if (incarr.length > 0) {
            var _l = [];
            for (var i = 0; i < incarr.length; i++) {
                var ic = incarr[i];
                if (ic > item.hsp.targetstart && ic < item.hsp.targetstop) _l.push(ic);
            }
            incarr = _l;
        }
        var hspEnd = this.cumoffset(arg.region_idx, Math.min(thisregion[4], item.hsp.targetstop));
        item.hsp.canvasstart = x_0;
        item.hsp.canvasstop = hspEnd;

        /** query gap & insert **/
        // compare weaver.insert to hsp.insert, create extra gaps on hsp
        var _chew = item.hsp.chew_start;
        var _target = item.hsp.targetstart;
        var _query = fvd ? item.hsp.querystart : item.hsp.querystop;
        var forcedgap = [];
        for (var i = 0; i < incarr.length; i++) {
            var ic = incarr[i];
            // find chewid matching ic
            for (; _chew < item.hsp.targetseq.length; _chew++) {
                if (_target == ic) break;
                if (item.hsp.targetseq[_chew] != '-') _target++;
                if (item.hsp.queryseq[_chew] != '-') {
                    _query += fvd ? 1 : -1;
                }
            }
            if (ic in item.hsp.insert) {
                var qinsert = item.hsp.insert[ic];
                if (qinsert < regioninsert[ic]) {
                    var _w = regioninsert[ic] - qinsert;
                    if (_query in item.hsp.gap) {
                        item.hsp.gap[_query] += _w;
                    } else {
                        item.hsp.gap[_query] = _w;
                    }
                    forcedgap.push(_query);
                    // insert gap to both string
                    var a = item.hsp.targetseq;
                    var lst = [];
                    for (var j = 0; j < _w; j++) lst.push('-');
                    item.hsp.targetseq = a.substr(0, _chew) +
                    lst.join('') +
                    a.substr(_chew);
                    a = item.hsp.queryseq;
                    lst = [];
                    for (var j = 0; j < _w; j++) lst.push('-');
                    item.hsp.queryseq = a.substr(0, _chew) +
                    lst.join('') +
                    a.substr(_chew);
                    _chew += _w;

                    item.hsp.insert[ic] = regioninsert[ic];
                }
            } else {
                // opens gap on query, needs query coord
                var _w = regioninsert[ic];
                var a = item.hsp.targetseq;
                var lst = [];
                for (var j = 0; j < _w; j++) lst.push('-');
                item.hsp.targetseq = a.substr(0, _chew) +
                lst.join('') +
                a.substr(_chew);
                a = item.hsp.queryseq;
                lst = [];
                for (var j = 0; j < _w; j++) lst.push('-');
                item.hsp.queryseq = a.substr(0, _chew) +
                lst.join('') +
                a.substr(_chew);
                _chew += _w;

                item.hsp.insert[ic] = _w;
                if (_query in item.hsp.gap) {
                    item.hsp.gap[_query] += _w;
                } else {
                    item.hsp.gap[_query] = _w;
                }
                forcedgap.push(_query);
            }
        }
        if (forcedgap.length > 0) {
            /* made new gap into query,
             put that into .weaver.insert of the cottonbbj
             */
            var bbj = this.weaver.q[arg.tkobj.cotton];
            for (var i = 0; i < bbj.regionLst.length; i++) {
                var r = bbj.regionLst[i];
                if (r[8].item.id == item.id) {
                    for (var j = 0; j < forcedgap.length; j++) {
                        var c = forcedgap[j];
                        bbj.weaver.insert[i][c] = item.hsp.gap[c];
                    }
                    break;
                }
            }
        }

        ctx.fillStyle = arg.tkobj.qtc.bedcolor;
        var gcarr = []; // these are query coord!
        for (var ic in item.hsp.gap) {
            gcarr.push(parseInt(ic));
        }
        if (gcarr.length > 0) {
            gcarr.sort(fvd ? numSort : numSort2);
            // strike through first...
            var a = y + weavertkseqh / 2 - .5;
            ctx.fillRect(x_0, a, hspEnd - x_0, 1);
            if (tosvg) svgdata.push({
                type: svgt_line,
                x1: x_0,
                y1: a + .5,
                x2: hspEnd,
                y2: a + .5,
                w: 1,
                color: ctx.fillStyle
            });
        }
        // if sufficient width for bp, will print bp, else print arrow
        var bpw = bpl ? this.entire.bpwidth : (1 / thisregion[7]);
        x = x_0;
        var prevcoord = fvd ? item.hsp.querystart : item.hsp.querystop;
        for (var i = 0; i < gcarr.length; i++) {
            var gc = gcarr[i];
            var filld = fvd ? gc - prevcoord : prevcoord - gc;
            var fillw = this.bp2sw(arg.region_idx, filld);
            ctx.fillRect(x, y, fillw, weavertkseqh);
            if (tosvg) svgdata.push({type: svgt_rect, x: x, y: y, w: fillw, h: weavertkseqh, fill: ctx.fillStyle});
            if (bpw < MAXbpwidth) { // arrow
                var tmplst = decoritem_strokeStrandarrow(ctx, item.hsp.strand,
                    x + 2, fillw - 4, y, weavertkseqh,
                    arg.anticolor, tosvg);
                if (tosvg) svgdata = svgdata.concat(tmplst);
            }
            var gw = this.bp2sw(arg.region_idx, item.hsp.gap[gc]);
            x += fillw + gw;
            // bare arrow
            var tmplst = decoritem_strokeStrandarrow(ctx, item.hsp.strand,
                x - gw + 2, gw - 4, y, weavertkseqh,
                arg.tkobj.qtc.bedcolor, tosvg);
            if (tosvg) svgdata = svgdata.concat(tmplst);
            prevcoord = gc;
        }
        ctx.fillRect(x, y, hspEnd - x, weavertkseqh);
        if (tosvg) svgdata.push({type: svgt_rect, x: x, y: y, w: hspEnd - x, h: weavertkseqh, fill: ctx.fillStyle});
        if (bpw < MAXbpwidth) { // arrow
            var tmplst = decoritem_strokeStrandarrow(ctx, item.hsp.strand,
                x + 2, hspEnd - x - 4, y, weavertkseqh,
                arg.anticolor, tosvg);
            if (tosvg) svgdata = svgdata.concat(tmplst);
        }
        /** letters n mismatch **/
        var _target = item.hsp.targetstart,
            _query = fvd ? item.hsp.querystart : item.hsp.querystop;
        for (var i = item.hsp.chew_start; i < item.hsp.targetseq.length; i++) {
            var t0 = item.hsp.targetseq[i];
            var q0 = item.hsp.queryseq[i];
            var a = x_0 + bpw * (i - item.hsp.chew_start);
            if (t0 != '-') {
                if (bpw >= MAXbpwidth) {
                    ctx.fillStyle = 'white';
                    ctx.font = "8pt Sans-serif";
                    var b = arg.y + weavertkseqh - 1;
                    ctx.fillText(t0, a, b);
                    if (tosvg) svgdata.push({type: svgt_text, x: a, y: b, text: t0, color: ctx.fillStyle});
                }
            }
            if (q0 != '-') {
                if (bpw >= MAXbpwidth) {
                    ctx.fillStyle = 'white';
                    ctx.font = "8pt Sans-serif";
                    var b = arg.y + weavertkseqh * 2 + weavertkalnh - 1;
                    ctx.fillText(q0, a, b);
                    if (tosvg) svgdata.push({type: svgt_text, x: a, y: b, text: q0, color: ctx.fillStyle});
                }
            }
            var t = t0.toLowerCase();
            var q = q0.toLowerCase();
            if (t != '-' && q != '-' && t == q) {
                a += bpw / 2;
                var b = arg.y + weavertkseqh + 1;
                var bh = weavertkalnh - 2;
                ctx.fillStyle = colorCentral.foreground_faint_7;
                ctx.fillRect(parseInt(a), b, Math.min(1, bpw), bh);
                if (tosvg) svgdata.push({
                    type: svgt_line,
                    x1: a,
                    y1: b,
                    x2: a,
                    y2: b + bh,
                    w: Math.min(1, bpw),
                    color: ctx.fillStyle
                });
            }
        }
        return svgdata;
    }

    if (item.sbstroke) {
        y += 1;
        stackHeight -= 2;
    }
    var iname = item.name2 ? item.name2 : item.name;
    var fvd = (thisregion[8] && thisregion[8].item.hsp.strand == '-') ? false : true;

    if (!item.struct) {
        /*****  full, no structure
         including unmatched lr item
         */
        var param = {
            ctx: ctx,
            rid: arg.region_idx,
            start: item.start,
            stop: item.stop,
            viziblebox: true,
            y: y,
            h: stackHeight,
            fill: arg.bedcolor,
            tosvg: tosvg,
        };
        if (item.strand && item.strand != '.') {
            param.strand = item.strand;
        }
        if (item.namestart != undefined) {
            // print name
            param.text = iname;
            if (item.namewidth > item.boxwidth) {
                if (item.namestart < item.boxstart) {
                    param.textonleft = true;
                } else {
                    param.textonright = true;
                }
            }
        }
        var s = this.tkcd_box(param);
        if (tosvg) svgdata = svgdata.concat(s);
    } else {
        /* full, has structure
         including paired lr item
         */
        var middleY = stackHeight / 2 + y;
        if (arg.isChiapet) { // TODO merge into hammock
            if (item.boxwidth) {
                /* never forgot boxwidth could be undefined
                 by Celso 2014/2/13
                 */
                ctx.fillStyle = arg.bedcolor;
                var L = item.struct.L;
                var R = item.struct.R;
                var rL = this.regionLst[L.rid],
                    rR = this.regionLst[R.rid];
                var x1 = this.cumoffset(L.rid, Math.min(rL[4], L.stop));
                var x2 = this.cumoffset(R.rid, Math.max(rR[3], R.start));
                ctx.fillRect(x1, middleY, x2 - x1, 1);
                if (tosvg) svgdata.push({
                    type: svgt_line,
                    x1: x1,
                    y1: middleY,
                    x2: x2,
                    y2: middleY,
                    w: 1,
                    color: arg.bedcolor
                });
                var s = this.tkcd_box({
                    ctx: ctx,
                    rid: L.rid,
                    start: Math.max(rL[3], L.start),
                    stop: Math.min(rL[4], L.stop),
                    viziblebox: true,
                    y: y,
                    h: stackHeight,
                    fill: arg.bedcolor,
                    tosvg: tosvg,
                });
                if (tosvg) svgdata = svgdata.concat(s);
                var s = this.tkcd_box({
                    ctx: ctx,
                    rid: R.rid,
                    start: Math.max(rR[3], R.start),
                    stop: Math.min(rR[4], R.stop),
                    viziblebox: true,
                    y: y,
                    h: stackHeight,
                    fill: arg.bedcolor,
                    tosvg: tosvg,
                });
                if (tosvg) svgdata = svgdata.concat(s);
            }
        } else {
            // must not use plotGene
            var x0 = this.cumoffset(arg.region_idx, Math.max(thisregion[3], item.start)),
                x9 = this.cumoffset(arg.region_idx, Math.min(thisregion[4], item.stop));
            // strike through, careless about gap
            ctx.fillStyle = arg.bedcolor;
            var _y = y + stackHeight / 2 - .5;
            ctx.fillRect(x0, _y, x9 - x0, 1);
            if (tosvg) svgdata.push({type: svgt_line, x1: x0, y1: _y, x2: x9, y2: _y, w: 1, color: ctx.fillStyle});

            var strand = item.strand ? (item.strand == '.' ? null : (item.strand == '>' || item.strand == '+') ? '>' : '<') : null;
            if (strand) {
                // draw invisible box for name and bare strand on strike
                var s = this.tkcd_box({
                    ctx: ctx,
                    rid: arg.region_idx,
                    start: item.start,
                    stop: item.stop,
                    y: y,
                    h: stackHeight,
                    color: arg.bedcolor,
                    strand: strand,
                    tosvg: tosvg,
                });
                if (tosvg) svgdata = svgdata.concat(s);
            }

            if (item.struct && item.struct.thin) {
                for (var i = 0; i < item.struct.thin.length; i++) {
                    var t = item.struct.thin[i];
                    var s = this.tkcd_box({
                        ctx: ctx,
                        rid: arg.region_idx,
                        start: t[0],
                        stop: t[1],
                        nojoin: true,
                        viziblebox: true,
                        y: y + instack_padding,
                        h: stackHeight - instack_padding * 2,
                        fill: arg.bedcolor,
                        tosvg: tosvg,
                    });
                    if (tosvg) svgdata = svgdata.concat(s);
                }
            }
            if (item.struct && item.struct.thick) {
                for (var i = 0; i < item.struct.thick.length; i++) {
                    var t = item.struct.thick[i];
                    var s = this.tkcd_box({
                        ctx: ctx,
                        rid: arg.region_idx,
                        start: t[0],
                        stop: t[1],
                        nojoin: true,
                        viziblebox: true,
                        y: y,
                        h: stackHeight,
                        strand: strand,
                        fill: arg.bedcolor,
                        tosvg: tosvg,
                    });
                    if (tosvg) svgdata = svgdata.concat(s);
                }
            }
            var leftend = fvd ? x0 : x9,
                rightend = fvd ? x9 : x0;
            if (item.namestart && Math.max(leftend, -this.move.styleLeft) < Math.min(this.hmSpan - this.move.styleLeft, rightend)) {
                // item in view range, lay name at last
                var s = this.tkcd_box({
                    ctx: ctx,
                    rid: arg.region_idx,
                    start: item.start,
                    stop: item.stop,
                    y: y,
                    h: stackHeight,
                    textcolor: arg.bedcolor,
                    textboxnooverlap: true,
                    text: iname,
                    tosvg: tosvg,
                });
                if (tosvg) svgdata = svgdata.concat(s);
            }
        }
    }
    if (item.sbstroke && item.boxwidth >= 5) {
        var uw = this.entire.atbplevel ? this.entire.bpwidth : 1;
        for (var k = 0; k < item.sbstroke.length; k++) {
            var a = this.cumoffset(arg.region_idx, item.start + item.sbstroke[k]);
            if (a >= 0) {
                ctx.fillStyle = arg.tkobj.qtc.strokecolor;
                ctx.fillRect(parseInt(a), y, uw, stackHeight);
                if (tosvg) svgdata.push({type: svgt_rect, x: a, y: y, w: uw, h: stackHeight, fill: ctx.fillStyle});
            }
        }
    }
    return svgdata;
};


Browser.prototype.tkcd_box = function (arg) {
// singular item, no struct, within one region
    var tosvg = arg.tosvg,
        ctx = arg.ctx,
        r = this.regionLst[arg.rid];
    if (!r) return [];
    arg.start = Math.max(r[3], arg.start);
    arg.stop = Math.min(r[4], arg.stop);
    if (arg.start > arg.stop) return [];
// deals with reverse-aligned hsp
    var fvd = (r[8] && r[8].item.hsp.strand == '-') ? false : true;

    var incarr = this.weaver_gotgap(arg.rid, fvd ? false : true);
    if (incarr.length > 0) {
        var _l = [];
        for (var i = 0; i < incarr.length; i++) {
            if (incarr[i] > arg.start && incarr[i] < arg.stop) _l.push(incarr[i]);
        }
        incarr = _l;
    }
// x0 and x9 won't be changed
    var x1 = x0 = this.cumoffset(arg.rid, fvd ? arg.start : arg.stop);
    /*
     var x1,x0;
     if(fvd) {
     x1=x0=this.cumoffset(arg.rid, arg.start);
     } else {
     x1=x0=this.cumoffset(arg.rid, arg.stop-1,true);
     }
     */
    var x9 = this.cumoffset(arg.rid, fvd ? arg.stop : arg.start);
// arg.stop bp is not included
    var s = [];
    if (arg.fill) {
        ctx.fillStyle = arg.fill;
        for (var i = 0; i < incarr.length; i++) {
            var x2 = this.cumoffset(arg.rid, incarr[i]);
            var w = x2 - x1;
            if (arg.viziblebox) {
                w = Math.max(1, w);
            }
            ctx.fillRect(x1, arg.y, w, arg.h);
            if (tosvg) s.push({type: svgt_rect, x: x1, y: arg.y, w: w, h: arg.h, fill: arg.fill});
            var gw = this.bp2sw(arg.rid, this.weaver.insert[arg.rid][incarr[i]]);
            if (!arg.nojoin) {
                var _y = parseInt(arg.y + arg.h / 2);
                ctx.fillRect(x2, _y, gw, 1);
                if (tosvg) s.push({type: svgt_line, x1: x2, y1: _y, x2: x2 + gw, y2: _y, w: 1, color: arg.fill});
            }
            x1 = x2 + gw;
        }
        var w = x9 - x1;
        if (arg.viziblebox) {
            w = Math.max(1, w);
        }
        ctx.fillRect(x1, arg.y, w, arg.h);
        if (tosvg) s.push({type: svgt_rect, x: x1, y: arg.y, w: w, h: arg.h, fill: arg.fill});
    } else if (arg.edge) {
        ctx.strokeStyle = arg.edge;
        // left v
        ctx.moveTo(x1, arg.y);
        ctx.lineTo(x1, arg.y + arg.h);
        if (tosvg) s.push({type: svgt_line, x1: x1, y1: arg.y, x2: x1, y2: arg.y + arg.h});
        for (var i = 0; i < incarr.length; i++) {
            var x2 = this.cumoffset(arg.rid, incarr[i]);
            // top h
            ctx.moveTo(x1, arg.y);
            ctx.lineTo(x2, arg.y);
            if (tosvg) s.push({type: svgt_line, x1: x1, y1: arg.y, x2: x2, y2: arg.y});
            // bottom h
            var _y = arg.y + arg.h;
            ctx.moveTo(x1, _y);
            ctx.lineTo(x2, _y);
            if (tosvg) s.push({type: svgt_line, x1: x1, y1: _y, x2: x2, y2: _y});
            x1 = x2 + this.bp2sw(arg.rid, this.weaver.insert[arg.rid][incarr[i]]);
        }
        // top h
        ctx.moveTo(x1, arg.y);
        ctx.lineTo(x9, arg.y);
        if (tosvg) s.push({type: svgt_line, x1: x1, y1: arg.y, x2: x9, y2: arg.y});
        // bottom h
        var _y = arg.y + arg.h;
        ctx.moveTo(x1, _y);
        ctx.lineTo(x9, _y);
        if (tosvg) s.push({type: svgt_line, x1: x1, y1: _y, x2: x9, y2: _y});
        // right v
        ctx.moveTo(x9, arg.y);
        ctx.lineTo(x9, _y);
        if (tosvg) s.push({type: svgt_line, x1: x9, y1: arg.y, x2: x9, y2: _y});
        ctx.stroke();
    }
// priority: text > strand
    var textstart = textstop = 0; // only set value when text goes inside box
    var leftend = x0, rightend = x9;
    if (arg.text) {
        var w = ctx.measureText(arg.text).width;
        var ty = arg.texty ? arg.texty : arg.y + 10;
        if (arg.textboxnooverlap) {
            // should be item with struct
            ctx.fillStyle = arg.textcolor;
            if (leftend + this.move.styleLeft >= w + 1) {
                // on left
                var a = leftend - w - 1;
                ctx.fillText(arg.text, a, ty);
                if (tosvg) s.push({type: svgt_text, x: a, y: ty, text: arg.text, color: ctx.fillStyle});
            } else if (this.hmSpan - this.move.styleLeft - rightend >= w + 1) {
                // on right
                ctx.fillText(arg.text, rightend + 1, ty);
                if (tosvg) s.push({type: svgt_text, x: rightend + 1, y: ty, text: arg.text, color: ctx.fillStyle});
            } else {
                // name forced into box, draw bg for name
                ctx.fillStyle = colorCentral.background_faint_7;
                var a = 10 + Math.max(-this.move.styleLeft, leftend);
                ctx.fillRect(a, arg.y, w + 6, arg.h);
                if (tosvg) s.push({type: svgt_rect, x: a, y: arg.y, w: w + 6, h: arg.h, fill: ctx.fillStyle});
                ctx.fillStyle = arg.textcolor ? arg.textcolor : (arg.fill ? arg.fill : arg.edge);
                ctx.fillText(arg.text, a + 3, ty);
                if (tosvg) s.push({type: svgt_text, x: a, y: ty, text: arg.text, color: ctx.fillStyle});
            }
        } else {
            // should be item without struct
            if (arg.textonleft) {
                ctx.fillStyle = arg.textcolor ? arg.textcolor : (arg.fill ? arg.fill : arg.edge);
                var a = leftend - w - 1;
                ctx.fillText(arg.text, a, ty);
                if (tosvg) s.push({type: svgt_text, x: a, y: ty, text: arg.text, color: ctx.fillStyle});
            } else if (arg.textonright) {
                ctx.fillStyle = arg.textcolor ? arg.textcolor : (arg.fill ? arg.fill : arg.edge);
                ctx.fillText(arg.text, rightend + 1, ty);
                if (tosvg) s.push({type: svgt_text, x: rightend + 1, y: ty, text: arg.text, color: ctx.fillStyle});
            } else if (w < rightend - leftend) {
                ctx.fillStyle = arg.textcolor ? arg.textcolor : (arg.fill ? 'white' : arg.edge);
                var a = (leftend + rightend - w) / 2;
                ctx.fillText(arg.text, a, ty);
                // only set it here
                textstart = a;
                textstop = a + w;
                if (tosvg) s.push({type: svgt_text, x: a, y: ty, text: arg.text, color: ctx.fillStyle});
            }
        }
    }
    if (arg.strand) {
        x1 = x0;
        for (var i = 0; i < incarr.length; i++) {
            var x2 = this.cumoffset(arg.rid, incarr[i]);
            var ss = plotstrandNameaside(ctx,
                x1,
                x2,
                arg.y, arg.h,
                fvd ? arg.strand : ((arg.strand == '+' || arg.strand == '>') ? '-' : '+'),
                arg.fill ? colorCentral.background
                    : (arg.edge ? arg.edge : (arg.color ? arg.color : colorCentral.foreground)),
                textstart, textstop, tosvg);
            if (tosvg) s = s.concat(ss);
            x1 = x2 + this.bp2sw(arg.rid, this.weaver.insert[arg.rid][incarr[i]]);
        }
        var ss = plotstrandNameaside(ctx,
            x1,
            x9,
            arg.y, arg.h,
            fvd ? arg.strand : ((arg.strand == '+' || arg.strand == '>') ? '-' : '+'),
            arg.fill ? colorCentral.background
                : (arg.edge ? arg.edge : (arg.color ? arg.color : colorCentral.foreground)),
            textstart, textstop, tosvg);
        if (tosvg) s = s.concat(ss);
    }
    return s;
};

function plotstrandNameaside(ctx, x1, x2, y, h, strand, color, namestart, namestop, tosvg) {
    /* x1/x2: x start/stop of strand box
     namestart/stop: x start/stop of existing name, use 0 if there's no name,
     else strand will avoid name
     */
    var s = [];
    var a = x1 + 2, w = x2 - x1 - 4;
    if (namestart) {
        if (a < namestart) {
            if (x2 > namestop) {
                // draw strand surrounding name
                w = namestart - 4 - a;
                var ss = decoritem_strokeStrandarrow(ctx,
                    strand,
                    a, w, y, h,
                    color, tosvg);
                if (tosvg) s = s.concat(ss);
                a = namestop + 4;
                w = x2 - a - 2;
                ss = decoritem_strokeStrandarrow(ctx,
                    strand,
                    a, w, y, h,
                    color, tosvg);
                if (tosvg) s = s.concat(ss);
                return s;
            }
            // on left of name
            w = Math.min(x2, namestart - 2) - a - 2;
        } else {
            // on right of name
            a = Math.max(x1, namestop + 2) + 2;
            w = x2 - a - 2;
        }
    }
    s = decoritem_strokeStrandarrow(ctx,
        strand,
        a, w, y, h,
        color, tosvg);
    if (tosvg) return s;
}


Browser.prototype.drawATCGlegend = function (waiting) {
    var c = this.basepairlegendcanvas;
    c.width = this.leftColumnWidth;
    var ctx = c.getContext('2d');
    ctx.clearRect(0, 0, c.width, c.height);
    if (waiting) {
        ctx.fillStyle = colorCentral.foreground_faint_5;
        ctx.font = "8pt Sans-serif";
        ctx.fillText('Loading sequence...', 0, 10);
        return;
    }
    ctx.fillStyle = ntbcolor.a;
    ctx.fillRect(0, 0, 15, c.height);
    ctx.fillStyle = ntbcolor.t;
    ctx.fillRect(16, 0, 15, c.height);
    ctx.fillStyle = ntbcolor.c;
    ctx.fillRect(32, 0, 15, c.height);
    ctx.fillStyle = ntbcolor.g;
    ctx.fillRect(48, 0, 15, c.height);
    ctx.fillStyle = ntbcolor.n;
    ctx.fillRect(64, 0, 15, c.height);
    ctx.fillStyle = "white";
    ctx.font = "bold 10pt Sans-serif";
    ctx.fillText("A", 3, 10);
    ctx.fillText("T", 19, 10);
    ctx.fillText("C", 35, 10);
    ctx.fillText("G", 51, 10);
    ctx.fillText("N", 67, 10);
};


function make_skewbox_butt(holder) {
    var d = dom_create('div', holder);
    d.className = 'skewbox_butt';
    dom_create('div', d);
    dom_create('div', d);
    return d;
}

function make_controlpanel(param) {
    var main = dom_create('div');
    main.style.position = 'absolute';
    main.style.zIndex = 100;
    main.style.display = 'none';
    if (param.bg) {
        main.style.backgroundColor = param.bg;
    }
    var tableid = Math.random();
    main.setAttribute('id', tableid);
// 1 header
    var table = dom_create('table', main);
    if (param.headerzoom) {
        table.style.zoom = param.headerzoom;
    }
    var tr = table.insertRow(0);
// 1 header text, draggable
    var td = tr.insertCell(0);
    td.setAttribute('holderid', tableid);
    td.addEventListener('mousedown', cpmoveMD, false);
    if (param.htextbg) {
        td.style.backgroundColor = param.htextbg;
    }
    var d = dom_create('div', td);
    d.className = 'skewbox_header';
    var d2 = dom_create('div', d); // skew box
    d2.style.borderColor = param.htextcolor ? param.htextcolor : colorCentral.background_faint_7;
    if (param.htextbg) {
        d2.style.backgroundColor = param.htextbg;
    }
    d2 = dom_create('div', d); // text box
    d2.style.padding = param.hpadding ? param.hpadding : '2px 100px';
    d2.style.color = param.htextcolor ? param.htextcolor : colorCentral.background;
    d2.innerHTML = param.htext;
    main.__htextdiv = d2;
// 1 header butt
    if (param.hbutt1) {
        var p = param.hbutt1;
        td = tr.insertCell(-1);
        td.style.paddingLeft = '15px';
        d = make_skewbox_butt(td);
        if (p.title) d.title = p.title;
        if (p.call) d.addEventListener('click', p.call, false);
        d.firstChild.style.backgroundColor = p.bg ? p.bg : (param.htextcolor ? param.htextcolor : colorCentral.background);
        d.childNodes[1].style.color = p.fg ? p.fg : colorCentral.foreground_faint_5;
        d.childNodes[1].innerHTML = param.hbutt1.text;
        main.__hbutt1 = d;
    }
    if (param.hbutt2) {
        var p = param.hbutt2;
        td = tr.insertCell(-1);
        td.style.paddingLeft = '15px';
        d = make_skewbox_butt(td);
        if (p.title) d.title = p.title;
        if (p.call) d.addEventListener('click', p.call, false);
        d.firstChild.style.backgroundColor = p.bg ? p.bg : (param.htextcolor ? param.htextcolor : colorCentral.background);
        d.childNodes[1].style.color = p.fg ? p.fg : colorCentral.foreground_faint_5;
        d.childNodes[1].innerHTML = p.text;
        main.__hbutt2 = d;
    }
    if (param.hbutt3) {
        var p = param.hbutt3;
        td = tr.insertCell(-1);
        td.style.paddingLeft = '15px';
        d = make_skewbox_butt(td);
        if (p.title) d.title = p.title;
        if (p.call) d.addEventListener('click', p.call, false);
        d.firstChild.style.backgroundColor = p.bg ? p.bg : (param.htextcolor ? param.htextcolor : colorCentral.background);
        d.childNodes[1].style.color = p.fg ? p.fg : colorCentral.foreground_faint_5;
        d.childNodes[1].innerHTML = p.text;
        main.__hbutt3 = d;
    }
// 2 contents
    d = dom_create('div', main);
    d.style.marginTop = '20px';
    d.style.position = 'relative';
    main.__contentdiv = d;
    return main;
}

function flip_panel(dom1, dom2, forward) {
    /* args:
     dom1: the panel on far side,
     dom2: the panel on near side
     forward: boolean, if true will fade fardom and show neardom (hide 1, show 2)
     */
    if (forward) {
        panelFadeout(dom1);
        panelFadein(dom2);
    } else {
        panelFadeout(dom2);
        panelFadein(dom1);
    }
}


function page_makeDoms(param) {
    if (gflag.__pageMakeDom_called) return;
    gflag.__pageMakeDom_called = true;

// internal md
    if (getmdidx_internal() == -1) {
        var ft = [
            FT2verbal[FT_bed_c],
            FT2verbal[FT_bedgraph_c],
            FT2verbal[FT_bigwighmtk_c],
            FT2verbal[FT_anno_c],
            FT2verbal[FT_bam_c],
            FT2verbal[FT_lr_c],
            FT2verbal[FT_cat_c],
            FT2verbal[FT_matplot],
            FT2verbal[FT_weaver_c],
            FT2verbal[FT_cm_c],
            FT2verbal[FT_ld_c]
        ];
        var gn = [];
        for (var n in genome) gn.push(n);
        var v = {
            vocabulary: {'Track type': ft,},
            tag: literal_imd,
        };
        v.vocabulary[literal_imd_genome] = gn;
        load_metadata_json(v);
    }

    /* prepare colors */
    var s = colorstr2int(colorCentral.foreground).join(',');
    colorCentral.foreground_faint_1 = 'rgba(' + s + ',0.1)';
    colorCentral.foreground_faint_2 = 'rgba(' + s + ',0.2)';
    colorCentral.foreground_faint_3 = 'rgba(' + s + ',0.3)';
    colorCentral.foreground_faint_5 = 'rgba(' + s + ',0.5)';
    colorCentral.foreground_faint_7 = 'rgba(' + s + ',0.7)';
    s = colorstr2int(colorCentral.background).join(',');
    colorCentral.background_faint_1 = 'rgba(' + s + ',0.1)';
    colorCentral.background_faint_3 = 'rgba(' + s + ',0.3)';
    colorCentral.background_faint_5 = 'rgba(' + s + ',0.5)';
    colorCentral.background_faint_7 = 'rgba(' + s + ',0.7)';
    colorCentral.background_faint_9 = 'rgba(' + s + ',0.9)';
// make copy of long color lst for restoring after user messed up mcm
    var lst = [];
    for (var i = 0; i < colorCentral.longlst.length; i++) {
        lst.push(colorCentral.longlst[i]);
    }
    colorCentral.longlst_bk = lst;

    if (param.highlight_color) {
        colorCentral.hl = param.highlight_color;
    } else {
        colorCentral.hl = colorCentral.foreground_faint_1;
    }

    var f = {};
    f[FT_bed_n] = f[FT_bed_c] = f[FT_bedgraph_c] = f[FT_bedgraph_n] = f[FT_qdecor_n] = f[FT_cat_n] = f[FT_cat_c] = f[FT_bigwighmtk_c] = f[FT_bigwighmtk_n] = f[FT_anno_n] = f[FT_anno_c] = 1;
    ftfilter_ordinary = f;
    f = {};
    f[FT_bedgraph_c] = f[FT_bedgraph_n] = f[FT_qdecor_n] = f[FT_bigwighmtk_c] = f[FT_bigwighmtk_n] = 1;
    ftfilter_numerical = f;


    indicator2 = document.createElement('div');
    document.body.appendChild(indicator2);
    indicator2.style.position = 'absolute';
    indicator2.style.border = '1px dashed #80a6ff';
    indicator2.style.zIndex = 102;
    var t = document.createElement('table');
    t.style.backgroundColor = 'blue';
    t.style.opacity = 0.16;
    t.style.width = t.style.height = '100%';
    td = t.insertRow(0).insertCell(0);
    td.align = 'center';
    td.vAlign = 'middle';
    td.style.color = 'white';
    td.style.fontSize = '30px';
    indicator2.appendChild(t);
    indicator2.veil = t;
    var c1 = document.createElement('canvas');
    c1.width = c1.height = 30;
    c1.style.position = 'absolute';
    c1.style.left = '-30px';
    c1.style.opacity = .5;
    indicator2.appendChild(c1);
    indicator2.leftarrow = c1;
    var c2 = document.createElement('canvas');
    c2.width = c2.height = 30;
    c2.style.position = 'absolute';
    c2.style.right = '-30px';
    c2.style.opacity = .5;
    indicator2.appendChild(c2);
    indicator2.rightarrow = c2;
    {
        var ctx = c1.getContext("2d");
        var lg = ctx.createLinearGradient(0, 0, 0, c1.height);
        lg.addColorStop(0, "#aaf");
        lg.addColorStop(1, "#003");
        ctx.fillStyle = lg;
        ctx.beginPath();
        var ychi = 7;
        var w = c1.width;
        ctx.moveTo(0, ychi);
        ctx.lineTo(w / 2, ychi);
        ctx.lineTo(w / 2, 0);
        ctx.lineTo(w, w / 2);
        ctx.lineTo(w / 2, w);
        ctx.lineTo(w / 2, w - ychi);
        ctx.lineTo(0, w - ychi);
        ctx.lineTo(0, w - ychi);
        ctx.fill();
        ctx = c2.getContext("2d");
        lg = ctx.createLinearGradient(0, 0, 0, c2.height);
        lg.addColorStop(0, "#aaf");
        lg.addColorStop(1, "#003");
        ctx.fillStyle = lg;
        ctx.moveTo(0, w / 2);
        ctx.lineTo(w / 2, 0);
        ctx.lineTo(w / 2, ychi);
        ctx.lineTo(w, ychi);
        ctx.lineTo(w, w - ychi);
        ctx.lineTo(w / 2, w - ychi);
        ctx.lineTo(w / 2, w);
        ctx.lineTo(0, w / 2);
        ctx.fill();
    }

    indicator = document.createElement('div');
    indicator.style.position = 'absolute';
    document.body.appendChild(indicator);
    indicator.style.border = '1px solid #80A6FF';
    indicator.style.zIndex = 104;
    d = document.createElement('div');
    d.style.backgroundColor = 'blue';
    d.style.opacity = 0.1;
    d.style.width = d.style.height = '100%';
    indicator.appendChild(d);

    invisibleBlanket = document.createElement('div');
    document.body.appendChild(invisibleBlanket);
    invisibleBlanket.style.position = 'absolute';
    invisibleBlanket.style.zIndex = 101;

    indicator3 = document.createElement('div');
    document.body.appendChild(indicator3);
    indicator3.style.position = 'absolute';
    indicator3.style.zIndex = 102;
    d = document.createElement('div');
    d.style.position = 'relative';
    indicator3.appendChild(d);
    d2 = dom_create('div', d);
    d2.style.position = 'absolute';
    d2.style.backgroundImage = 'url(' + (gflag.is_cors ? gflag.cors_host : '.') + '/images/border-anim-v.gif)';
    d2.style.backgroundPosition = '0% 0%';
    d2.style.backgroundRepeat = 'no-repeat repeat';
    d2 = dom_create('div', d);
    d2.style.position = 'absolute';
    d2.style.backgroundImage = 'url(' + (gflag.is_cors ? gflag.cors_host : '.') + '/images/border-anim-h.gif)';
    d2.style.backgroundPosition = '0% 0%';
    d2.style.backgroundRepeat = 'repeat no-repeat';
    d2 = dom_create('div', d);
    d2.style.position = 'absolute';
    d2.style.backgroundImage = 'url(' + (gflag.is_cors ? gflag.cors_host : '.') + '/images/border-anim-v.gif)';
    d2.style.backgroundPosition = '100% 0%';
    d2.style.backgroundRepeat = 'no-repeat repeat';
    d2 = dom_create('div', d);
    d2.style.position = 'absolute';
    d2.style.backgroundImage = 'url(' + (gflag.is_cors ? gflag.cors_host : '.') + '/images/border-anim-h.gif)';
    d2.style.backgroundPosition = '0% 100%';
    d2.style.backgroundRepeat = 'repeat no-repeat';

    indicator4 = dom_create('div');
    indicator4.style.position = 'absolute';
    indicator4.style.border = '1px solid ' + colorCentral.foreground;
    indicator4.style.zIndex = 102;

    indicator6 = document.createElement('div');
    indicator6.style.position = 'absolute';
    document.body.appendChild(indicator6);
    indicator6.style.border = '1px solid rgb(255,133,92)';
    indicator6.style.zIndex = 102;
    d = document.createElement('div');
    d.style.backgroundColor = '#f53d00';
    d.style.opacity = 0.1;
    d.style.width = d.style.height = '100%';
    indicator6.appendChild(d);

    indicator7 = document.createElement('div');
    document.body.appendChild(indicator7);
    indicator7.style.position = 'absolute';
    indicator7.style.borderStyle = 'solid';
    indicator7.style.borderWidth = '0px 1px 1px 0px';
    indicator7.style.borderColor = '#ccc';

    pagecloak = document.createElement('div');
    document.body.appendChild(pagecloak);
    pagecloak.style.position = 'absolute';
    pagecloak.style.left = pagecloak.style.top = 0;
    pagecloak.style.backgroundColor = 'rgb(151,154,121)';
    pagecloak.style.opacity = 0.9;
    pagecloak.style.zIndex = 99;

    waitcloak = dom_create('div');
    waitcloak.style.position = 'absolute';
    waitcloak.style.opacity = 0.5;
    waitcloak.style.zIndex = 200;
    dom_create('img', waitcloak).src = (gflag.is_cors ? gflag.cors_host : '') + '/images/loading.gif';

    /* __control__ panels
     panels that belong to the page and shared by all browser objs
     */
    if (param.cp_oneshot) {
        var d = make_controlpanel(param.cp_oneshot);
        d.__htextdiv.style.fontSize = '30px';
        apps.oneshot = {main: d};
        var m = dom_create('div', d.__contentdiv, 'margin:30px 0px;color:white');
        apps.oneshot.message = m;
        m.className = 'alertmsg';
        var h = make_headertable(d.__contentdiv);
        apps.oneshot.header = h._h;
        apps.oneshot.belly = h._c;
    }
    if (param.cp_session) {
        makepanel_session(param.cp_session);
    }
    if (param.cp_bev) {
        var d = make_controlpanel(param.cp_bev);
        apps.bev = {main: d};
    }
    if (param.cp_svg) {
        var d = make_controlpanel(param.cp_svg);
        apps.svg = {main: d};
        var hd = d.__contentdiv;
        hd.style.color = colorCentral.background;
        var p = dom_create('p', hd, 'color:inherit;line-height:1.5;');
        apps.svg.showtklabel = dom_addcheckbox(p, 'show track name', null);
        var bt = dom_addbutt(hd, 'Take screen shot', makesvg_browserpanel_pushbutt, 'margin-right:20px;');
        bt.addEventListener('mousedown', makesvg_clear, false);
        apps.svg.submitbutt = bt;
        apps.svg.urlspan = dom_addtext(hd, '');
        dom_create('p', hd, 'color:inherit').innerHTML = 'This generates an SVG file that can be printed to PDF format with your web browser';
    }
    if (param.cp_gsm) {
        makepanel_gsm(param.cp_gsm);
    }
    if (param.cp_fileupload) {
        makepanel_fileupload(param.cp_fileupload);
    }
    if (param.cp_scatter) {
        makepanel_scatter(param.cp_scatter);
    }
    if (param.cp_hmtk) {
        var d = make_controlpanel(param.cp_hmtk);
        var d2 = d.__contentdiv;
        var d3 = dom_create('div', d2, 'color:white;margin-top:20px;', {t: 'If not all custom tracks can be found here, <span class=clb3 onclick=facet2custtklst(event)>show the entire list</span>.'});
        apps.hmtk = {
            main: d,
            holder: dom_create('div', d2),
            custtk2lst: d3,
        };
        dom_create('div', d2, 'color:white;margin-top:20px;').innerHTML = 'To get additional tracks, <span class=clb3 onclick=facet2pubs()>load public track hubs</span>.';
    }
    if (param.cp_publichub) {
        var d = make_controlpanel(param.cp_publichub);
        apps.publichub = {main: d};
        var d2 = d.__contentdiv;
        apps.publichub.holder = dom_create('div', d2, 'margin:25px 0px 20px 0px;width:800px;');
        dom_create('div', d2, 'color:white;').innerHTML = 'After loading a hub, you can find the tracks in <span class=clb3 onclick=pubs2facet()>track table</span>.<br>' +
        'We welcome you to <a href="http://egg.wustl.edu/+" target=_blank>contact us</a> and publish your data as public track hubs.';
    }
    if (param.cp_custtk) {
        var d = make_controlpanel(param.cp_custtk);
        apps.custtk = {main: d};
    }
    if (param.cp_circlet) {
        var d = make_controlpanel(param.cp_circlet);
        d.style.paddingRight = 10;
        apps.circlet = {main: d};
        apps.circlet.hash = {};
        var d2 = d.__hbutt2.parentNode;
        apps.circlet.handleholder = d2;
        stripChild(d2, 0);
        d2.style.padding = '';
        apps.circlet.holder = dom_create('div', d.__contentdiv);
        gflag.applst.push({name: param.cp_circlet.htext, label: 'Chromosomes in a circle', toggle: toggle11});
    }
    if (param.cp_geneplot) {
        makepanel_geneplot(param.cp_geneplot);
    }
    if (param.cp_validhub) {
        makepanel_vh(param.cp_validhub);
    }
    if (param.cp_super) {
        makepanel_super(param.cp_super);
    }
    if (param.cp_pca) {
        var d = make_controlpanel(param.cp_pca);
        apps.pca = {main: d, width: param.cp_pca.width, height: param.cp_pca.height};
        var d2 = d.__contentdiv;
        var d3 = dom_create('div', d2, 'text-align:center;margin-bottom:10px;');
        var c = dom_addcheckbox(d3, 'Show sample names', param.cp_pca.showhidename_call);
        c.checked = true;
        apps.pca.showname = c;
        var table = dom_create('table', d2);
        var tr = table.insertRow(0);
        // 1-1
        var td = tr.insertCell(0);
        td.vAlign = 'middle';
        td.innerHTML = 'PC2';
        // 1-2
        td = tr.insertCell(-1);
        var c = dom_create('canvas', td);
        c.width = 40;
        c.height = param.cp_pca.height;
        apps.pca.pc2scale = c;
        // 1-3
        td = tr.insertCell(-1);
        var d = dom_create('div', td, 'position:relative;background-color:white;width:' + param.cp_pca.width + 'px;height:' + param.cp_pca.height + 'px;');
        apps.pca.dotholder = d;
        // 2-1
        tr = table.insertRow(1);
        td = tr.insertCell(0);
        // 2-2
        td = tr.insertCell(-1);
        // 2-3
        td = tr.insertCell(-1);
        td.align = 'center';
        c = dom_create('canvas', td, 'display:block;');
        c.width = param.cp_pca.width;
        c.height = 25;
        apps.pca.pc1scale = c;
        dom_addtext(td, 'PC1');
        var d3 = dom_create('table', d2, 'position:absolute;left:0px;top:0px;background-color:rgba(0,0,0,.1);color:rgba(255,255,255,0.5);font-size:300%;');
        td = d3.insertRow(0).insertCell(0);
        td.align = 'center';
        td.vAlign = 'middle';
        td.innerHTML = 'Running...';
        d3.says = td;
        apps.pca.busy = d3;
    }
    if (param.cp_navregion) {
        var d = make_controlpanel(param.cp_navregion);
        apps.navregion = {main: d};
        d.__contentdiv.style.marginTop = 5;
        var d2 = dom_create('div', d.__contentdiv, 'padding:5px;resize:both;height:50px;width:300px;overflow-y:scroll;');
        apps.navregion.holder = dom_create('div', d2);
        gflag.applst.push({name: param.cp_navregion.htext, label: 'Show regions from a list', toggle: toggle30});
    }
    if (param.cp_findortholog) {
        makepanel_wvfind(param.cp_findortholog);
        gflag.applst.push({
            name: param.cp_findortholog.htext,
            label: 'Find regions with highly similar sequence from another genome',
            toggle: toggle31_1
        });
    }


    /* end of __control__ panels */


    /* makemenu */

    menu = dom_create('div', null, 'color:#858585;border-style:solid;border-width:2px 1px;border-color:#4D9799 rgba(133,133,133,0.2) #994D96;background-color:white;position:absolute;z-index:103;box-shadow:2px 2px 2px ' + colorCentral.foreground_faint_3, {c: 'anim_height'});
    menu.id = 'menu';
    menu.onmouseover = menu_mover;
    menu.onmouseout = menu_mout;

    menu.c1 = dom_create('div', menu, 'color:' + colorCentral.foreground_faint_5 + ';font-weight:bold;text-align:center;padding:2px');

    /* some immediate controls, above Config (which is more controls..)
     */
    menu.c45 = dom_create('div', menu, 'padding:10px;line-height:2;');
    var d = dom_create('div', menu.c45);
    menu.c45.combine = dom_addcheckbox(d, 'Combine two strands', cmtk_combine_change);

    var d2 = dom_create('div', d, null, {c: 'menushadowbox'});
    dom_create('div', d2, 'font-size:70%;').innerHTML = 'Strand-specific CG data has been combined.';
    var cb = dom_addcheckbox(d2, 'Combine CHG', cmtk_combinechg_change);
    dom_create('div', d2, 'font-size:70%;width:220px;').innerHTML = 'When combining CHG, CAG/CTG will be combined, but not CCG/CGG. <a href=' + FT2noteurl[FT_cm_c] + '#Combining_strands target=_blank>Learn more.</a>.';
    menu.c45.combine_chg = {div: d2, checkbox: cb};

    menu.c45.combine_notshown = dom_create('div', menu.c45, 'color:' + colorCentral.foreground_faint_3, {t: 'Only one strand available'});

    menu.c45.scale = dom_addcheckbox(menu.c45, 'Scale bar height by read depth', cmtk_scale_change);
    d = dom_create('div', menu.c45);
    menu.c45.filter = {checkbox: dom_addcheckbox(d, 'Filter by read depth', cmtk_filter_change)};
    var d2 = dom_create('div', d, null, {c: 'menushadowbox'});
    menu.c45.filter.div = d2;
    dom_addtext(d2, 'Threshold:&nbsp;&nbsp;');
    menu.c45.filter.input = dom_inputnumber(d2, {value: 5, width: 30, call: cmtk_filter_kd});
    dom_addbutt(d2, 'Apply', cmtk_filter_change);
    menu.c45.table = dom_create('table', menu.c45);
    menu.c45.table.cellSpacing = 5;

    menu.tk2region_showlst = menu_addoption('&#9733;', '', menu_showtk2region, menu);
    dom_addtext(menu.tk2region_showlst);
// the actual region list holder, right next to menu option
    d = dom_create('div', menu);
    d.style.padding = 8;
    d.style.lineHeight = 1.8;

// track mode
    menu.c22 = dom_create('div', menu);
    menu.c22.packbutt = dom_addbutt(menu.c22, 'SHOW IN PACK MODE');
    menu.c22.packbutt.style.margin = '5px 10px';
    var lst = dom_addrowbutt(menu.c22, [
        {text: 'Heatmap', pad: true, call: menuDecorChangemode, attr: {mode: M_trihm}},
        {text: 'Arc', pad: true, call: menuDecorChangemode, attr: {mode: M_arc}},
        {text: 'Full', pad: true, call: menuDecorChangemode, attr: {mode: M_full}},
        {text: 'Thin', pad: true, call: menuDecorChangemode, attr: {mode: M_thin}},
        {text: 'Density', pad: true, call: menuDecorChangemode, attr: {mode: M_den}},
        {text: 'Barplot', pad: true, call: menuDecorChangemode, attr: {mode: M_bar}},
    ], 'margin:10px;color:#858585;').firstChild.firstChild.childNodes;
    menu.c10 = lst[0];
    menu.c11 = lst[1];
    menu.c7 = lst[2];
    menu.c6 = lst[3];
    menu.c8 = lst[4];
    menu.c60 = lst[5];

    menu.c47 = dom_create('div', menu, 'padding:10px;line-height:2;');
    menu.c47.table = dom_create('table', menu.c47);

    /* the Configure */
    menu.c5 = menu_addoption('&#9881;', 'Configure', menuConfig, menu);

    /* show below config when clicking on mcm */
    menu.c64 = menu_addoption('&#10004;', 'Apply matplot', matplot_menucreate, menu);
    menu.c65 = menu_addoption('&#10005;', 'Cancel matplot', matplot_menucancel, menu);

    menu.c12 = menu_addoption('&#9986;', 'Juxtapose', menuJuxtapose, menu);
    menu.c2 = menu_addoption(null, 'Undo juxtaposition', menuTurnoffJuxtapose, menu);
    if (param.cp_circlet)
        menu.c3 = menu_addoption('&#10047;', 'Circlet view', menu_circletview, menu);

    if (param.edit_metadata) { // not in use
        menu.c19 = menu_addoption('&#9998;', 'Edit metadata', menuCusttkmdedit, menu);
    }
    menu.c23 = menu_addoption('&#11021;', 'Flip', menuMcmflip, menu);
    menu.c25 = menu_addoption('&#10010;', 'Add metadata terms', menu_mcm_invokemds, menu);


    if (param.cp_gsm) { // gene set
        menu.c36 = dom_create('div', menu, 'margin:12px;width:230px;');
        dom_create('div', menu.c36, null, {c: 'header_gr ilcell', t: '&#9998; edit', clc: menu_showgeneset_edit});
    }

    menu.c54 = menu_addoption('&#10005;', 'Cancel multiple select', menu_multipleselect_cancel, menu);

    menu.facetm = dom_create('div', menu);
    menu_addoption(null, 'Select all', facet_term_selectall, menu.facetm);
    menu_addoption(null, 'Remove all', facet_term_removeall, menu.facetm);

    menu.c13 = dom_create('div', menu, 'padding:10px;color:#858585;');

    menu.font = dom_create('div', menu, 'margin:10px;white-space:nowrap;');
    var d = dom_create('div', menu.font, 'padding-bottom:7px;');
    dom_addtext(d, 'font family:');
    menu.font.family = dom_addselect(d, stc_fontfamily, [
        {text: 'sans-serif', value: 'sans-serif'}, {text: 'serif', value: 'serif'},
        {text: 'times', value: 'times'}, {text: 'arial', value: 'arial'},
        {text: 'courier', value: 'courier'}, {text: 'monospace', value: 'monospace'}]);
    menu.font.family.style.margin = '0px 10px';
    menu.font.bold = dom_addcheckbox(d, 'bold', stc_fontbold);
    dom_addtext(menu.font, 'size: ');
    dom_addrowbutt(menu.font, [{text: '+', pad: true, call: stc_fontsize, attr: {increase: 1}}, {
        text: '-',
        pad: true,
        call: stc_fontsize
    }], 'margin-right:10px;');
    menu.font.color = dom_addtext(menu.font, '&nbsp;&nbsp;color&nbsp;&nbsp;', 'white', 'coloroval');
    menu.font.color.addEventListener('click', stc_textcolor_initiator, false);

// TODO integrate into menu.c50
    menu.bed = dom_create('div', menu, 'margin:10px;');
    menu.bed.color = dom_addtext(menu.bed, '&nbsp;&nbsp;item color&nbsp;&nbsp;', 'white', 'coloroval');
    menu.bed.color.addEventListener('click', stc_bedcolor_initiator, false);

    menu.lr = dom_create('div', menu, 'margin:20px 10px 10px 10px;white-space:nowrap;');
    var d = dom_create('div', menu.lr, 'margin-bottom:20px;');
    menu.lr.autoscale = dom_addcheckbox(d, 'automatic score threshold', stc_longrange_autoscale);
// positive
    var d = dom_create('div', menu.lr);
    d.className = 'titlebox';
    var d2 = dom_create('div', d, 'margin:10px 0px 20px 0px;color:' + colorCentral.foreground_faint_3);
    dom_addtext(d2, '0', colorCentral.foreground_faint_5);
    menu.lr.pcolor = dom_create('canvas', d2, 'margin:0px 5px');
    menu.lr.pcolor.width = 80;
    menu.lr.pcolor.height = 15;
    menu.lr.pcolor.addEventListener('click', stc_longrange_pcolor_initiator, false);
    menu.lr.pcscoresays = dom_addtext(d2);
// color threshold
    d3 = dom_addtext(d2);
    menu.lr.pcscore = dom_inputnumber(d3, {call: stc_longrange_pcolorscore_KU});
    dom_addbutt(d3, 'set', stc_longrange_pcolorscore);
// filter threshold
    var d3 = dom_create('div', d2, 'margin-top:5px;');
    dom_addtext(d3, 'filter threshold ', '#858585');
    menu.lr.pfscore = dom_inputnumber(d3, {call: stc_longrange_pfilterscore_KU});
    dom_addbutt(d3, 'set', stc_longrange_pfilterscore);
    dom_create('div', d, 'background-color:white;').innerHTML = 'Positive score';
// negative
    d = dom_create('div', menu.lr);
    d.className = 'titlebox';
    d2 = dom_create('div', d, 'margin:10px 0px 20px 0px;color:' + colorCentral.foreground_faint_3);
    dom_addtext(d2, '0', colorCentral.foreground_faint_5);
    menu.lr.ncolor = dom_create('canvas', d2, 'margin:0px 5px;');
    menu.lr.ncolor.width = 80;
    menu.lr.ncolor.height = 15;
    menu.lr.ncolor.addEventListener('click', stc_longrange_ncolor_initiator, false);
    menu.lr.ncscoresays = dom_addtext(d2);
// color threshold
    d3 = dom_addtext(d2);
    menu.lr.ncscore = dom_inputnumber(d3, {call: stc_longrange_ncolorscore_KU});
    dom_addbutt(d3, 'set', stc_longrange_ncolorscore);
// filter threshold
    d3 = dom_create('div', d2, 'margin-top:5px;');
    dom_addtext(d3, 'filter threshold ', '#858585');
    menu.lr.nfscore = dom_inputnumber(d3, {call: stc_longrange_nfilterscore_KU});
    dom_addbutt(d3, 'set', stc_longrange_nfilterscore);
    dom_create('div', d, 'background-color:white;').innerHTML = 'Negative score';

    menu.bam = dom_create('div', menu, 'margin:10px;');
    menu.bam.f = dom_addtext(menu.bam, '&nbsp;forward&nbsp;', 'white', 'coloroval');
    menu.bam.f.addEventListener('click', stc_forwardcolor_initiator, false);
    dom_addtext(menu.bam, '&nbsp;');
    menu.bam.r = dom_addtext(menu.bam, '&nbsp;reverse&nbsp;', 'white', 'coloroval');
    menu.bam.r.addEventListener('click', stc_reversecolor_initiator, false);
    dom_addtext(menu.bam, '&nbsp;');
    menu.bam.m = dom_addtext(menu.bam, '&nbsp;mismatch&nbsp;', 'black', 'coloroval');
    menu.bam.m.addEventListener('click', stc_mismatchcolor_initiator, false);

    menu.c48 = dom_create('div', menu, 'padding:15px;border-top:solid 1px ' + colorCentral.foreground_faint_1);
    menu.c49 = dom_create('div', menu, 'padding:10px;border-top:solid 1px ' + colorCentral.foreground_faint_1);
    menu.c49.color = dom_create('span', menu.c49, 'display:block;margin:10px 20px;padding:3px 20px;');
    menu.c49.color.className = 'coloroval';
    menu.c49.color.innerHTML = 'track color';
    menu.c49.color.addEventListener('click', ldtk_color_initiator, false);
    var tt = dom_create('table', menu.c49);
    tt.cellSpacing = 5;
    var tr = tt.insertRow(0);
    tr.insertCell(0).innerHTML = 'tick size';
    var td = tr.insertCell(1);
    dom_addbutt(td, '&nbsp;+&nbsp;', ldtk_ticksize).change = 1;
    dom_addbutt(td, '&nbsp;-&nbsp;', ldtk_ticksize).change = -1;
    tr = tt.insertRow(1);
    tr.insertCell(0).innerHTML = 'link line height';
    var td = tr.insertCell(1);
    dom_addbutt(td, '&nbsp;+&nbsp;', ldtk_topheight).change = 10;
    dom_addbutt(td, '&nbsp;-&nbsp;', ldtk_topheight).change = -10;


    menu.c50 = dom_create('div', menu);
    var d = dom_create('div', menu.c50, 'margin:15px;white-space:nowrap;');
    var s = dom_addtext(d, '', null, 'coloroval');
    menu.c50.color1 = s;
    s.addEventListener('click', qtc_color1_initiator, false);
    s.style.padding = '2px 10px';
    s.style.marginRight = 20;
    s = dom_addtext(d, '', null, 'coloroval');
    menu.c50.color1_1 = s;
    s.style.padding = '2px 10px';
    s.addEventListener('click', qtc_color1_1_initiator, false);
    menu.c50.row2 = dom_create('div', menu.c50, 'margin:15px;white-space:nowrap;padding-top:10px;border-top:dashed 2px ' + colorCentral.foreground_faint_2);
    s = dom_addtext(menu.c50.row2, '', null, 'coloroval');
    menu.c50.color2 = s;
    s.style.padding = '2px 10px';
    s.addEventListener('click', qtc_color2_initiator, false);
    s.style.marginRight = 20;
    s = dom_addtext(menu.c50.row2, '', null, 'coloroval');
    menu.c50.color2_1 = s;
    s.style.padding = '2px 10px';
    s.addEventListener('click', qtc_color2_1_initiator, false);
// feel free to add more color cells

    menu.c51 = dom_create('div', menu, 'white-space:nowrap;padding:10px;border-top:solid 1px ' + colorCentral.foreground_faint_1);
    menu.c51.sharescale = dom_create('div', menu.c51, 'margin:5px 5px 15px 5px;padding:5px;background-color:rgba(255,204,51,.5);font-size:70%;text-align:center;', {t: 'This track shares Y scale with other tracks.'});
    dom_addtext(menu.c51, 'Y-axis scale&nbsp;');
    menu.c51.select = dom_addselect(menu.c51, toggle26, [
        {text: 'Automatic', value: scale_auto, selected: true},
        {text: 'Fixed', value: scale_fix},
        {text: 'Percentile', value: scale_percentile}
    ]);
// fixd scale
    var d = dom_create('div', menu.c51, 'display:none;', {c: 'menushadowbox'});
    menu.c51.fix = d;
    dom_addtext(d, 'min:&nbsp;');
    d.min = dom_inputnumber(d, {width: 50, value: 0, call: qtc_setfixscale_ku});
    dom_addtext(d, '&nbsp;&nbsp;max:&nbsp;');
    d.max = dom_inputnumber(d, {width: 50, value: 10, call: qtc_setfixscale_ku});
    dom_addbutt(d, 'apply', qtc_setfixscale);
// percentile threshold
    var d = dom_create('div', menu.c51, 'display:none;', {c: 'menushadowbox'});
    menu.c51.percentile = d;
    d.says = dom_addtext(d, '');
    dom_addrowbutt(d, [
        {text: '&#10010;', pad: true, call: qtc_percentile, attr: {change: 5}},
        {text: '&#9473;', pad: true, call: qtc_percentile, attr: {change: -5}},
        {text: '+', pad: true, call: qtc_percentile, attr: {change: 1}},
        {text: '-', pad: true, call: qtc_percentile, attr: {change: -1}},
    ], 'margin-left:10px;');

    menu.c59 = dom_create('div', menu, 'padding:10px;border-top:solid 1px ' + colorCentral.foreground_faint_1);
    dom_addtext(menu.c59, 'Summary method&nbsp;');
    menu.c59.select = dom_addselect(menu.c59, menu_qtksummary_select,
        [{value: summeth_mean, text: 'Average'},
            {value: summeth_max, text: 'Max'},
            {value: summeth_min, text: 'Min'},
            {value: summeth_sum, text: 'Total'}]);
    menu.c59.select.style.marginRight = 15;
    dom_addtext(menu.c59, '<a href=https://plus.google.com/117328025606874451908/posts/5Y7j6fB3Td3 target=_blank>&nbsp;?&nbsp;</a>');

    menu.c52 = dom_create('div', menu, 'padding:10px;border-top:solid 1px ' + colorCentral.foreground_faint_1);
    dom_addtext(menu.c52, 'Logarithm&nbsp;');
    menu.c52.select = dom_addselect(menu.c52, menu_log_select,
        [{value: log_no, text: 'No'},
            {value: log_2, text: 'log2'},
            {value: log_e, text: 'ln'},
            {value: log_10, text: 'log10'}]);

    menu.c14 = dom_create('div', menu, 'padding:10px;white-space:nowrap;border-top:solid 1px ' + colorCentral.foreground_faint_1);
    dom_addtext(menu.c14, 'Height&nbsp;&nbsp;');
    var t = dom_addrowbutt(menu.c14, [
        {text: '&#10010;', pad: true, call: menu_tkh_change, attr: {changetype: 1, amount: 5}},
        {text: '&#9473;', pad: true, call: menu_tkh_change, attr: {changetype: 1, amount: -5}},
        {text: '+', pad: true, call: menu_tkh_change, attr: {changetype: 1, amount: 1}},
        {text: '-', pad: true, call: menu_tkh_change, attr: {changetype: 1, amount: -1}},
        {text: 'Unify', call: menu_tkh_change, attr: {changetype: 2}},]);
    menu.c14.unify = t.firstChild.firstChild.childNodes[4];
    menu.c14.unify.style.backgroundColor = colorCentral.magenta7;
    menu.c14.unify.style.color = 'white';

    menu.c46 = dom_create('div', menu, 'padding:10px;border-top:solid 1px ' + colorCentral.foreground_faint_1);
    menu.c46.checkbox = dom_addcheckbox(menu.c46, 'Smooth window&nbsp;&nbsp;&nbsp;', menu_smoothwindow_checkbox);
    dom_addtext(menu.c46, '<a href=http://washugb.blogspot.com/2013/10/v26-3-of-3-smoothing-curves.html target=_blank>&nbsp;?&nbsp;</a>');
    var d = dom_create('div', menu.c46, 'display:none;', {c: 'menushadowbox'});
    menu.c46.div = d;
    menu.c46.says = dom_addtext(d);
    dom_addrowbutt(d, [{text: '&#10010;', pad: true, call: menu_smoothwindow_change, attr: {change: 2}},
            {text: '&#9473;', pad: true, call: menu_smoothwindow_change, attr: {change: -2}}],
        'margin-left:10px;');

    menu.c29 = dom_create('div', menu, 'padding:10px;border-top:solid 1px ' + colorCentral.foreground_faint_1);
    menu.c29.checkbox = dom_addcheckbox(menu.c29, 'Bar chart background&nbsp;&nbsp;&nbsp;', menu_barplotbg_change);
    dom_addtext(menu.c29, '<a href=http://wiki.wubrowse.org/Datahub#barplot_bg target=_blank>&nbsp;?&nbsp;</a>');
    menu.c29.color = dom_create('div', menu.c29, 'display:none;cursor:default;', {
        c: 'menushadowbox',
        clc: tk_barplotbg_initiator,
        t: 'choose color'
    });

    menu.c44 = dom_create('div', menu, 'padding:10px;border-top:solid 1px ' + colorCentral.foreground_faint_1);
    menu.c44.checkbox = dom_addcheckbox(menu.c44, 'Track background', menu_tkbg_change);
    menu.c44.color = dom_create('div', menu.c44, 'display:none;cursor:default;background-color:#e0e0e0;', {
        c: 'menushadowbox',
        clc: tk_bgcolor_initiator,
        t: 'choose color'
    });

    if (param.menu_curvenoarea) {
        menu.c66 = dom_create('div', menu, 'padding:10px;border-top:solid 1px ' + colorCentral.foreground_faint_1);
        menu.c66.checkbox = dom_addcheckbox(menu.c66, 'Curve only', menu_tkcurveonly_change);
    }


    menu.c53 = dom_create('div', menu, 'padding:10px;border-top:solid 1px ' + colorCentral.foreground_faint_1);
    menu.c53.checkbox = dom_addcheckbox(menu.c53, 'Apply to all tracks', toggle15);

    menu.c16 = menu_addoption('&#8505;', 'Information', menuGetonetrackdetails, menu);

    /* menu - select tk to add, small panel in menu */
    var d = dom_create('div', menu);
    menu.facettklstdiv = d;
    var d2 = dom_create('div', d, 'margin:10px');
    var d3 = dom_create('div', d2, 'overflow-y:scroll;resize:vertical;');
    var table = dom_create('table', d3);
    menu.facettklsttable = table;
    d2 = dom_create('div', d, 'margin:10px');
    menu.facettklstdiv.buttholder = d2;
    var d3 = dom_create('div', d2, 'display:inline-block;width:150px');
    var d4 = dom_create('div', d3);
    d4.className = 'bigsubmit';
    d.submit = d4;
    d4.count = 0;
    d4.addEventListener('click', facet_tklst_addSelected, false);
    d4.style.width = 120;
    dom_addbutt(d2, 'Select all', facet_tklst_toggleall).tofill = true;
    dom_addbutt(d2, 'Deselect all', facet_tklst_toggleall).tofill = false;
    menu.facetremovebutt = dom_addbutt(d2, 'remove all', facet_tklst_removeall);

    menu.c18 = dom_create('div', menu);
    menu.c18.style.padding = 8;
    var c = dom_create('canvas', menu.c18);
    c.width = 400;
    c.height = 40;
    menu.c18_canvas = c;
    c.onmousedown = c18_md;
    c.onmousemove = c18_m_pica;
    c.onmouseout = pica_hide;

    menu.relocate = dom_create('div', menu);
// div1
    menu.relocate.div1 = dom_create('div', menu.relocate);
    var tt = dom_create('table', menu.relocate.div1);
    tt.cellSpacing = 10;
    var tr = tt.insertRow(0);
    menu.relocate.coord = dom_inputtext(tr.insertCell(0), {ph: 'coordinate', size: 16, call: menuJump_keyup});
    menu.relocate.gene = dom_inputtext(tr.insertCell(-1), {ph: 'gene name', size: 12, call: jumpgene_keyup});
    dom_addbutt(tr.insertCell(-1), '&nbsp;Go&nbsp;', menuJump);
    dom_addbutt(tr.insertCell(-1), 'Clear', jump_clearinput);
    tr = tt.insertRow(1);
    menu.relocate.snptr = tr;
    tr.insertCell(0);
    menu.relocate.snp = dom_inputtext(tr.insertCell(-1), {ph: 'rs75669958', size: 12, call: jumpsnp_keyup});
    var td = tr.insertCell(-1);
    td.colSpan = 2;
    dom_addbutt(td, '&nbsp;Find SNP&nbsp;', menuJumpsnp);

    tt = dom_create('table', menu.relocate.div1);
    menu.relocate.jumplstholder = tt;
    tt.cellSpacing = 0;
    tt.cellPadding = 2;
    tt.style.fontSize = '12px';
    tt.style.color = '#545454';
    menu.c24 = menu_addoption(null, 'Zoom into a chromosome', toggle6, menu.relocate.div1);
    menu.c43 = menu_addoption(null, 'Show linkage group', toggle25, menu.relocate.div1);
// div2, list of chromosomes
    menu.relocate.div2 = dom_create('div', menu.relocate);
    d = dom_create('div', menu.relocate.div2);
    d.style.backgroundColor = '#ededed';
    var d2 = dom_create('div', d);
    d2.style.color = '#006699';
    d2.style.textAlign = 'center';
    menu.relocate.scfd_foo = d2;
//dom_addtext(d2,'go back','black','header_gr').addEventListener('click',toggle6,false);
    dom_addtext(d2, 'Select a location from one of the chromosomes').style.margin = '0px 20px';
    dom_addbutt(d2, 'Customize', scfd_invokeconfigure);
    d2 = dom_create('div', menu.relocate.div2);
    menu.relocate.scfd_bar = d2;
    d2.style.color = '#858585';
    d2.style.textAlign = 'center';
    dom_addtext(d2, 'drag ');
    dom_addtext(d2, 'chr', null, 'header_b');
    dom_addtext(d2, ' to rearrange &nbsp;&nbsp;');
    dom_addbutt(d2, 'Update', scfd_updateconfigure);
    dom_addbutt(d2, 'Cancel', scfd_cancelconfigure);
// div3, linkage group
    menu.relocate.div3 = dom_create('div', menu.relocate, 'display:none;padding:10px 20px');

    menu.scfd_holder = dom_create('div', menu.relocate.div2);
    menu.scfd_holder.style.margin = 10;

    menu.decorcatalog = dom_create('div', menu, 'color:inherit');

    menu.grandadd = dom_create('div', menu);
    d2 = dom_create('div', menu.grandadd);
    var d3 = dom_create('div', d2, 'padding:10px 18px;cursor:default;background-color:rgba(77,151,153,.2);color:' + colorCentral.foreground);
    menu.grandadd.says = d3;
    d3.className = 'opaque7';
    d3.addEventListener('click', toggle1_1, false);
    var d3 = dom_create('div', d2, 'padding:20px;');
    menu.grandadd.kwinput = dom_inputtext(d3, {size: 13, call: tkkwsearch_ku, ph: 'track name'});
    dom_addbutt(d3, 'Find', tkkwsearch);
    var s = dom_addtext(d3, '&nbsp;?&nbsp;');
    s.addEventListener('mouseover', kwsearch_tipover, false);
    s.addEventListener('mouseout', pica_hide, false);
    menu.grandadd.pubh = menu_addoption(null, '<span style="font-size:140%">P</span>UBLIC track hubs', toggle8_1, d2);
    menu_addoption(null, '<span style="font-size:140%">A</span>NNOTATION tracks', toggle13, d2);
    var d4 = menu_addoption(null, '<span style="font-size:140%">C</span>USTOM tracks ', toggle28, d2);
    menu.grandadd.custtkcount = dom_addtext(d4.firstChild, '');
    menu.grandadd.cust = d4;

    menu.c35 = dom_create('div', menu);
    d2 = dom_create('div', menu.c35, 'border:solid 1px ' + colorCentral.foreground_faint_1 + ';margin:15px;');
    var d3 = dom_create('div', d2, 'padding:10px 18px;cursor:default;background-color:' + colorCentral.foreground_faint_1 + ';color:' + colorCentral.foreground);
    menu.c35.says = d3;
    d3.className = 'opaque5';
    d3.addEventListener('click', toggle1_1, false);
    var d4 = dom_create('div', d2);
    menu.c35.opt = d4;
    menu_addoption(null, 'List of all', menu_custtk_showall, d4);
    var d4 = menu_addoption('&#10010;', 'Add new tracks', toggle7_1, d2);

    /* FIXME circlet plot will hold multiple lr track
     each track will have its own color set
     need to specify which track is being configured
     */
    menu.c26 = dom_create('div', menu);
    menu.c26.style.padding = 8;
    menu.c26.innerHTML = 'Graph size <button type=button change=15 onclick=hengeview_changeradius(event)>&#10010;</button> \
<button type=button change=-15 onclick=hengeview_changeradius(event)>&#9473;</button>\
<div style="height:7px;"></div>\
<label for=hengeview_z_1>Show scale?</label> <input id=hengeview_z_1 type=checkbox onchange=hengeview_showhidescale(event)>';

    menu.c28 = dom_create('div', menu);
    menu.c28.style.padding = 8;
    menu.c28.innerHTML = '<button type=button turnon=1 onclick=hengeview_regiontoggleall(event)>show all</button>\
<button type=button turnon=0 onclick=hengeview_regiontoggleall(event)>hide all</button>\
<table class=container id=hengeview_chrholder style="margin:5px;"><tbody></tbody></table>';

    menu.c27 = dom_create('div', menu);
    menu.c27.style.padding = 8;
    menu.c27.style.borderTop = 'solid 1px #ededed';
    menu.c27.innerHTML = '<label for=hengeview_z_2>Show cytoband?</label> <input id=hengeview_z_2 type=checkbox onchange=hengeview_togglecytoband(event)>\
<div style="height:7px;"></div>\
Chromosome bar size <button type=button change=1 onclick=hengeview_changechrbarsize(event)>&#10010;</button> \
<button type=button change=-1 onclick=hengeview_changechrbarsize(event)>&#9473;</button>';


    menu.apppanel = dom_create('div', menu);
    var d = dom_create('div', menu.apppanel, 'padding:18px;');
    menu.apppanel.kwinput = dom_inputtext(d, {size: 13, ph: 'app name', call: findApp});
    dom_addbutt(d, 'Find', findApp_butt).style.marginRight = 10;
    dom_addtext(d, 'All apps', 'gray', 'clb').onclick = showallapp;
    var d2 = dom_create('div', menu.apppanel, 'width:250px;padding:0px 0px 10px 10px;');
    menu.apppanel.sc_holder = d2;

    if (param.cp_custtk) {
        apps.custtk.shortcut = [];
        var fn = function () {
            custtk_shortcut(FT_bedgraph_c);
        };
        apps.custtk.shortcut[FT_bedgraph_c] = dom_create('div', d2, 'display:none;', {
            c: 'header_b ilcell',
            t: 'bedGraph',
            clc: fn
        });
        gflag.applst.push({name: 'BedGraph track', toggle: fn});
        fn = function () {
            custtk_shortcut(FT_bigwighmtk_c);
        };
        apps.custtk.shortcut[FT_bigwighmtk_c] = dom_create('div', d2, 'display:none;', {
            c: 'header_b ilcell',
            t: 'bigWig',
            clc: fn
        });
        gflag.applst.push({name: 'BigWig track', toggle: fn});
        fn = function () {
            custtk_shortcut(FT_cat_c);
        };
        apps.custtk.shortcut[FT_cat_c] = dom_create('div', d2, 'display:none;', {
            c: 'header_b ilcell',
            t: 'categorical',
            clc: fn
        });
        gflag.applst.push({name: 'Categorical track', toggle: fn});
        fn = function () {
            custtk_shortcut(FT_anno_c);
        };
        apps.custtk.shortcut[FT_anno_c] = dom_create('div', d2, 'display:none;', {
            c: 'header_b ilcell',
            t: 'hammock',
            clc: fn
        });
        gflag.applst.push({name: 'Hammock track', toggle: fn});
        fn = function () {
            custtk_shortcut(FT_weaver_c);
        };
        apps.custtk.shortcut[FT_weaver_c] = dom_create('div', d2, 'display:none;', {
            c: 'header_b ilcell',
            t: 'genomealign',
            clc: fn
        });
        gflag.applst.push({name: 'Genomealign track', toggle: fn});
        fn = function () {
            custtk_shortcut(FT_lr_c);
        };
        apps.custtk.shortcut[FT_lr_c] = dom_create('div', d2, 'display:none;', {
            c: 'header_b ilcell',
            t: 'interaction',
            clc: fn
        });
        gflag.applst.push({name: 'Long-range interaction', toggle: fn});
        fn = function () {
            custtk_shortcut(FT_bed_c);
        };
        apps.custtk.shortcut[FT_bed_c] = dom_create('div', d2, 'display:none;', {
            c: 'header_b ilcell',
            t: 'bed',
            clc: fn
        });
        gflag.applst.push({name: 'Bed track', toggle: fn});
        fn = function () {
            custtk_shortcut(FT_bam_c);
        };
        apps.custtk.shortcut[FT_bam_c] = dom_create('div', d2, 'display:none;', {
            c: 'header_b ilcell',
            t: 'BAM',
            clc: fn
        });
        gflag.applst.push({name: 'BAM track', toggle: fn});
        fn = function () {
            custtk_shortcut(FT_huburl);
        };
        apps.custtk.shortcut[FT_huburl] = dom_create('div', d2, 'display:none;', {
            c: 'header_b ilcell',
            t: 'datahub',
            clc: fn
        });
        gflag.applst.push({name: 'Datahub', toggle: fn});
        /*
         fn=function(){custtk_shortcut(FT_catmat);};
         apps.custtk.shortcut[FT_]=dom_create('div',d2,'display:none;',{c:'header_b ilcell',t:'',clc:fn});
         gflag.applst.push({name:'custom track: ',toggle:fn});
         */
    }

    d = dom_create('div', menu.apppanel);
    if (param.cp_fileupload) {
        apps.fud.shortcut = menu_appoption(d, '&#11014;', 'File upload', 'Upload data from text files', toggle27);
        gflag.applst.push({name: 'File upload', label: 'Upload data from text files', toggle: toggle27});
    }
    if (param.cp_gsm) {
        apps.gsm.shortcut = menu_appoption(d, '&#10034;', 'Gene & region set', 'Create and manage sets of genes/regions', toggle10);
        gflag.applst.push({name: 'Gene set', label: 'Create and manage sets of genes/regions', toggle: toggle10});
    }
    if (param.cp_bev) {
        apps.bev.shortcut = menu_appoption(d, '&#10038;', 'Genome snapshot', 'View track at whole-genome scale', toggle18);
        gflag.applst.push({name: 'Genome snapshot', label: 'View track at whole-genome scale', toggle: toggle18});
    }
    if (param.cp_scatter) {
        apps.scp.shortcut = menu_appoption(d, '&#8759;', 'Scatter plot', 'Compare two tracks over a gene set', toggle19);
        gflag.applst.push({
            name: 'Scatter plot',
            label: 'Compare two numerical tracks over a gene set',
            toggle: toggle19
        });
    }
    if (param.app_splinter) {
        menu_appoption(d, '&#9707;', 'Split panel', 'Create a secondary browser panel', function () {
            gflag.menu.bbj.splinter_issuetrigger('nocoord_fromapp');
            menu_hide();
        });
        gflag.applst.push({
            name: 'Split panel', label: 'Create a secondary browser panel', toggle: function () {
                gflag.menu.bbj.splinter_issuetrigger('nocoord_fromapp');
                menu_hide();
            }
        });
    }
    if (param.cp_session) {
        apps.session.shortcut = menu_appoption(d, '&#10084;', 'Session', 'Save and share contents', toggle12);
        gflag.applst.push({name: 'Session', label: 'Save and share contents', toggle: toggle12});
    }
    if (param.cp_svg) {
        apps.svg.shortcut = menu_appoption(d, '&#9113;', 'Screenshot', 'Make publication-quality image', svgpanelshow);
        gflag.applst.push({name: 'Screen shot', label: 'Make publication-quality image', toggle: svgpanelshow});
    }
    if (param.cp_geneplot) {
        apps.gplot.shortcut = dom_create('div', d2, 'display:none;', {
            c: 'header_b ilcell',
            t: 'gene plot',
            clc: toggle4
        });
        gflag.applst.push({name: 'Gene plot', label: 'Data distribution within a gene set', toggle: toggle4});
    }

    var d = dom_create('div', menu, 'margin:15px;');
    menu.apppanel.getseq = {main: d};
    dom_addtext(d, 'Paste coordinates here<br><span style="font-size:70%;opacity:.6;">One coordinate per line</span><br>');
    var ip = dom_create('textarea', d);
    ip.cols = 30;
    menu.apppanel.getseq.input = ip;
    var d2 = dom_create('div', d, 'margin-top:10px;');
    menu.apppanel.getseq.butt = dom_addbutt(d2, 'Submit', app_get_sequence);
    dom_addbutt(d2, 'Clear', function () {
        menu.apppanel.getseq.input.value = '';
    });
    menu.apppanel.getseq.shortcut = dom_create('div', menu.apppanel.sc_holder, 'display:none;', {
        c: 'header_b ilcell',
        t: 'get sequence',
        clc: toggle33
    });
    gflag.applst.push({name: 'Get sequence', toggle: toggle33});

    if (param.app_bbjconfig) {
        var d = dom_create('div', menu);
        menu.bbjconfig = d;
        var d2 = dom_create('div', d, 'margin:20px;white-space:nowrap;');

        var table = dom_create('table', d2, 'color:#858585;');
        var tr = table.insertRow(0);
        var td = tr.insertCell(0);
        td.style.paddingRight = 10;
        dom_create('div', td, 'font-size:90%;color:inherit;').innerHTML = 'Browser panel width';
        var d3 = dom_addrowbutt(td, [
            {text: '&#10010;', pad: true, call: menu_changehmspan, attr: {which: 1}},
            {text: '&#9473;', pad: true, call: menu_changehmspan, attr: {which: 2}},
            {text: '+', pad: true, call: menu_changehmspan, attr: {which: 3}},
            {text: '-', pad: true, call: menu_changehmspan, attr: {which: 4}},
            {text: 'Set', call: menu_hmspan_set},
        ], 'color:inherit;');
        d.setbutt = d3.firstChild.firstChild.childNodes[4];
        d.setbutt.style.backgroundColor = colorCentral.magenta7;
        d.setbutt.style.color = 'white';

        var nwcall = null; // callback to for change name width
        if (param.app_bbjconfig.changetknw) {
            nwcall = param.app_bbjconfig.changetknw.call;
            if (!nwcall) {
                print2console('No callback provided for app_bbjconfig.changetknw', 2);
            }
        }
        if (nwcall) {
            td = tr.insertCell(1);
            d.leftwidthdiv = td;
            dom_create('div', td, 'font-size:90%;').innerHTML = 'Track name width';
            dom_addrowbutt(td, [
                {text: '&#10010;', pad: true, call: nwcall, attr: {which: 1}},
                {text: '&#9473;', pad: true, call: nwcall, attr: {which: 2}},
                {text: '+', pad: true, call: nwcall, attr: {which: 3}},
                {text: '-', pad: true, call: nwcall, attr: {which: 4}},
            ]);
        }

        d2 = dom_create('div', d, 'margin:20px;');
        d.allow_packhide_tkdata = dom_addcheckbox(d2, 'Allow "pack and hide" for track items', toggle14);
        dom_create('div', d2, 'display:none;margin:10px;').innerHTML = 'Please use with caution! <a href=http://washugb.blogspot.com/2014/03/v33-2-of-2-hide-undesirable-items-from.html target=_blank>Learn more.</a>';
    }

    var d = dom_create('div', menu, 'margin:10px;width:220px;color:#858585;');
    menu.zoomoutalert = d;
    d.count = dom_addtext(d);
    dom_addtext(d, ' items have been loaded.');
    var d2 = dom_create('div', d, null, {c: 'button_warning', clc: risky_zoomout});
    dom_addtext(d2, 'Zoom out ');
    d.fold = dom_addtext(d2);
    d.fold.style.fontSize = '200%';
    dom_addtext(d2, ' fold');
    dom_addtext(d, 'Zoom out to such scale might take long time to load new items and might even halt your web browser.');
    dom_create('div', d, 'margin:10px;', {c: 'header_gr', t: 'Cancel', clc: menu_hide});

    var d = dom_create('div', menu, 'margin:10px;width:220px;color:#858585;');
    menu.changemodealert = d;
    dom_addtext(d, 'By changing mode, ');
    d.count = dom_addtext(d);
    dom_addtext(d, ' items will be loaded and rendered, which could slow down your system.');
    var d2 = dom_create('div', d, null, {c: 'button_warning', clc: risky_changemode});
    dom_addtext(d2, 'Change mode to ');
    d.mode = dom_addtext(d2);
    dom_create('div', d, 'margin:10px;', {c: 'header_gr', t: 'Cancel', clc: menu_hide});


    if (param.stickynote) {
        menu.stickynote = dom_create('div', menu);
        // c1
        menu_addoption('&#10010;', 'New note', coordnote_showinputpanel, menu.stickynote).doedit = false;
        // c2
        var x = dom_create('div', menu.stickynote);
        x.style.margin = 10;
        dom_addtext(x, 'At ');
        menu.stickynote.says = dom_addtext(x);
        dom_addtext(x, ':');
        var t = dom_create('textarea', x);
        t.style.display = 'block';
        t.rows = 5;
        t.cols = 20;
        menu.stickynote.textarea = t;
        dom_addbutt(x, 'Submit', coordnote_submit);
        // c3
        x = dom_create('div', menu.stickynote);
        menu_addoption('&#9998;', 'Edit', coordnote_showinputpanel, x).doedit = true;
        menu_addoption('&#10005;', 'Delete', coordnote_delete, x);
    }

    var t = dom_create('table', menu, 'margin:8px;color:' + colorCentral.foreground_faint_7 + ';white-space:nowrap;');
    menu.genemodellstholder = t;
    t.style.cellSpacing = 0;
    t.style.cellPadding = 2;

    /*
     menu.c9=menu_addoption('&#10140;','Change color',show_mcmColorConfig,menu);
     var d=dom_create('table',menu); // next sibling of c9
     d.style.margin=10;
     d.cellSpacing=10;
     */

    if (param.cp_circlet) {
        menu.c15 = menu_addoption(null, 'Graph', menu_hengeview_configrender, menu);
        menu.c17 = menu_addoption(null, 'Chromosomes & regions', menu_hengeview_configregions, menu);
        menu.c21 = menu_addoption(null, 'Zoom out 1 fold', menu_hengeview_zoomout, menu);
        apps.circlet.shortcut = dom_create('div', menu.apppanel.sc_holder, 'display:none;', {
            t: 'circlet view',
            c: 'header_b ilcell',
            clc: toggle11
        });
    }

// TODO
//menu.c30=menu_addoption('&#8767;','View as line plot',menu_2matplot,menu);

    var d = dom_create('div', menu, 'padding:10px;cursor:default;white-space:nowrap;opacity:.5;' +
    'background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAIAAAACCAYAAABytg0kAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAABZJREFUeNpi2r9//38gYGAEESAAEGAAasgJOgzOKCoAAAAASUVORK5CYII=)');
    menu.c55 = d;
    d.setAttribute('holderid', 'menu');
    d.addEventListener('mousedown', cpmoveMD, false);
    d.says = dom_addtext(d, null);

    menu.c31 = dom_create('div', menu);

    menu.c57 = menu_addoption(null, 'Search for terms', toggle34, menu);
    gflag.applst.push({name: 'Metadata term finder', label: 'Search for metadata terms by keyword', toggle: toggle34});
    menu.c57.shortcut = dom_create('div', menu.apppanel.sc_holder, 'display:none;', {
        c: 'header_b ilcell',
        t: 'find metadata terms',
        clc: toggle34
    });

    if (param.cp_navregion) {
        apps.navregion.shortcut = dom_create('div', menu.apppanel.sc_holder, 'display:none;', {
            c: 'header_b ilcell',
            t: 'navigate regions',
            clc: toggle30
        });
    }
    if (param.cp_findortholog) {
        apps.wvfind.shortcut = dom_create('div', menu.apppanel.sc_holder, 'display:none;', {
            c: 'header_b ilcell',
            t: 'find ortholog',
            clc: toggle31_1
        });
    }
    if (param.cp_validhub) {
        // the last shortcut
        apps.vh.shortcut = dom_create('div', menu.apppanel.sc_holder, 'display:none;', {
            c: 'header_b ilcell',
            t: 'validate hub & refresh cache',
            clc: toggle29
        });
        gflag.applst.push({name: 'Validate datahub', label: 'Validate datahub and refresh cache', toggle: toggle29});
    }

    menu.c32 = dom_create('div', menu);
    menu.c33 = menu_addoption(null, ' ', get_genome_info, menu);
    if (param.addnewgenome) {
        menu.c34 = menu_addoption(null, 'Add new genome <span style="font-size:60%">EXPERIMENTAL</span>', add_new_genome, menu);
    }

    var d = dom_create('div', menu, 'margin:10px;');
    menu.c56 = d;
    d.input = dom_inputtext(d, {size: 12, call: mdtermsearch_ku, ph: 'enter keyword'});
    dom_addbutt(d, 'Search', mdtermsearch);
    var d2 = dom_create('div', d, 'max-height:' + (parseInt(maxHeight_menu) - 100) + 'px;overflow-y:scroll;');
    d.table = dom_create('table', d2, 'margin-top:10px;');

    if (param.cp_gsm) {
        // send gene set to ...
        dom_create('div', menu.c36, null, {t: 'gene set view', c: 'header_b ilcell', clc: menu_gs2gsv});
        if (param.cp_navregion) {
            dom_create('div', menu.c36, null, {c: 'header_b ilcell', t: 'navigate', clc: menu_gs2navregion});
        }
        if (param.cp_scatter) {
            dom_create('div', menu.c36, null, {c: 'header_b ilcell', t: 'scatter plot', clc: menu_gs2scp});
        }
        if (param.cp_geneplot) {
            dom_create('div', menu.c36, null, {c: 'header_b ilcell', t: 'gene plot', clc: menu_gs2gplot});
        }
        menu.c36a = dom_create('div', menu.c36, null, {c: 'header_b ilcell', t: 'find orthologs', clc: menu_gs2wvfind});
        if (param.cp_super) {
            dom_create('div', menu.c36, null, {c: 'header_b ilcell', t: 'call super enhancer', clc: menu_gs2super});
        }
        if (param.cp_proteinview) {
            dom_create('div', menu.c36, null, {c: 'header_b ilcell', t: 'protein view', clc: menu_gs2protein});
        }
    }


// this should be at the bottom of the menu
    menu.c4 = menu_addoption('&#10005;', 'Remove', menuRemove, menu);
    menu.c4.firstChild.style.color = 'red';

    menu.c58 = menu_addoption('&#8634;', 'Refresh cache', menu_refreshcache, menu);

    if (param.cp_bev) {
        // bev panel config
        d = dom_create('div', menu, 'padding:10px');
        menu.c40 = d;
        dom_addtext(d, 'panel width: ');
        menu.c40.says = dom_addtext(d, '');
        dom_addtext(d, '&nbsp;pixels&nbsp;&nbsp;');
        var s = dom_addselect(d, bev_setchrmaxwidth, [
            {text: 'change', value: -1, selected: true},
            {text: '600 px', value: 600}, {text: '800 px', value: 800}, {
                text: '1000 px',
                value: 1000
            }, {text: '1200 px', value: 1200}, {text: '1400 px', value: 1400}, {
                text: '1600 px',
                value: 1600
            }, {text: '1800 px', value: 1800}, {text: '2000 px', value: 2000},
        ]);
        dom_create('br', d);
        dom_addtext(d, 'Set plot width of longest chromosome to selected value.<br>Width of other chromosomes will scale accordingly.<br>This determines track data resolution.', '#858585');
        dom_create('br', d);
        dom_create('br', d);
        dom_addtext(d, 'panel height ');
        dom_addbutt(d, '&#10010;', bev_changepanelheight).increase = true;
        dom_addbutt(d, '&#9473;', bev_changepanelheight).increase = false;
        dom_create('br', d);
        dom_create('br', d);
        dom_addtext(d, 'chromosome bar height ');
        dom_addbutt(d, ' + ', bev_changechrheight).increase = true;
        dom_addbutt(d, ' - ', bev_changechrheight).increase = false;
    }

    menu.c62 = menu_addoption('&#8645', '&nbsp;', weaver_flip, menu);
//menu.c63=menu_addoption('?','&nbsp;',weaver_queryjumpui,menu);
    menu.c61 = dom_create('div', menu, 'border-top:1px solid ' + colorCentral.foreground_faint_1);
    dom_create('div', menu.c61, 'display:inline-block;margin:10px 15px;padding:3px 5px;border:1px solid #858585;border-radius:5px;', {c: 'opaque5'});

    /* makemenu ends */


    bubble = dom_create('table', null, 'position:absolute;z-index:103;');
    bubble.cellSpacing = bubble.cellPadding = 0;
    bubble.onmouseover = bubbleMover;
    bubble.onmouseout = bubbleMout;
    var tr = bubble.insertRow(0);
    var td = tr.insertCell(0);
    var c = dom_create('canvas', td);
    c.width = c.height = 15;
    c.style.marginLeft = 4;
    {
        var ctx = c.getContext("2d");
        ctx.fillStyle = "#850063";
        ctx.beginPath();
        ctx.moveTo(0, 15);
        ctx.lineTo(8, 0);
        ctx.lineTo(15, 15);
        ctx.fill();
    }
    tr = bubble.insertRow(-1);
    td = tr.insertCell(0);
    td.className = 'bubbleCls';
    bubble.says = dom_create('div', td, 'color:white;font-size:12px;', {c: 'anim_height'});
    bubble.sayajax = dom_create('div', td, 'color:white;margin:10px;font-size:12px;', {c: 'anim_height'});


// pica is on top of menu
    pica = dom_create('div', document.body, 'position:fixed;border:1px solid white;z-index:103;');
    var d = dom_create('div', pica, 'position:relative;');
    dom_create('div', d, 'position:absolute;left:0px;top:0px;background-color:rgba(0,53,82,.8);width:100%;height:100%;');
    picasays = dom_create('div', d, 'position:relative;color:#e0e0e0;padding:3px;');


    menu.style.display =
        pica.style.display =
            bubble.style.display =
                indicator.style.display =
                    indicator2.style.display =
                        indicator3.style.display =
                            indicator4.style.display =
                                indicator6.style.display =
                                    indicator7.style.display =
                                        pagecloak.style.display =
                                            waitcloak.style.display =
                                                invisibleBlanket.style.display = 'none';


    palette = dom_create('div');
    palette.style.display = 'none';
    palette.style.position = 'fixed';
    palette.style.zIndex = 104;
    palette.addEventListener('mouseover', paletteMover, false);
    palette.addEventListener('mouseout', paletteMout, false);
    palette.innerHTML = '<div style="position:relative;width:l70px;height:100px;">\
<div style="position:absolute;left:0px;top:15px;background-color:black;opacity:0.7;width:170px;height:150px;border-top-left-radius:5px;border-top-right-radius:5px;-moz-border-radius-topleft:5px;-moz-border-radius-topright:5px;border-bottom:solid 1px #404040;"></div>\
<div style="position:absolute;left:0px;top:166px;background-color:black;opacity:0.6;width:170px;height:60px;border-bottom-left-radius:5px;border-bottom-right-radius:5px;-moz-border-radius-bottomleft:5px;-moz-border-radius-bottomright:5px;"></div>\
<table style="position:absolute;left:0px;top:15px;width:170px;height:150px;"><tr><td align=center valign=middle style="width:270px:">\
<div class=palettedye onclick=palettedyeclick(event) style="background-color:#ff0000;">red</div>\
<div class=palettedye onclick=palettedyeclick(event) style="background-color:#008000;">green</div>\
<div class=palettedye onclick=palettedyeclick(event) style="background-color:#0000ff;;">blue</div>\
<div class=palettedye onclick=palettedyeclick(event) style="background-color:#ffff00;color:#858585;">yellow</div>\
<div class=palettedye onclick=palettedyeclick(event) style="background-color:#800000;">maroon</div>\
<div class=palettedye onclick=palettedyeclick(event) style="background-color:#808000;">olive</div>\
<div class=palettedye onclick=palettedyeclick(event) style="background-color:#ffa500;">orange</div>\
<div class=palettedye onclick=palettedyeclick(event) style="background-color:#008080;">teal</div>\
<div class=palettedye onclick=palettedyeclick(event) style="background-color:#ff00ff;">fuchsia</div>\
<div class=palettedye onclick=palettedyeclick(event) style="background-color:#6a5acd;;">slateblue</div>\
<div class=palettedye onclick=palettedyeclick(event) style="background-color:#4b0082;;">indigo</div>\
<div class=palettedye onclick=palettedyeclick(event) style="background-color:#a52a2a;">brown</div>\
<div class=palettedye onclick=palettedyeclick(event) style="background-color:#DC143C;">crimson</div>\
<div class=palettedye onclick=palettedyeclick(event) style="background-color:#8A2BE2;;">bluevelvet</div>\
<div class=palettedye onclick=palettedyeclick(event) style="background-color:#696969;">dimgray</div>\
</td></tr></table>\
<div style="position:absolute;left:20px;top:172px;">\
<div style="position:relative;width:110px;">\
<canvas id=palettegrove width=100 height=20 style="position:absolute;left:13px;top:18px;" onclick=palettegrove_click(event)></canvas>\
<canvas id=paletteslider width=26 height=26 style="position:absolute;left:50px;top:0px;cursor:pointer;" onmousedown=palettesliderMD(event)></canvas>\
</div>\
</div>\
</div>';
    palette.grove = document.getElementById('palettegrove');
    palette.slider = document.getElementById('paletteslider');
    /*
     var c = document.getElementById("palettepointer");
     var ctx = c.getContext("2d");
     ctx.fillStyle = "black";
     ctx.beginPath();
     ctx.moveTo(0, 15);
     ctx.lineTo(18,0);
     ctx.lineTo(35,15);
     ctx.fill();
     */
    var c = document.getElementById('paletteslider');
    ctx = c.getContext("2d");
    lg = ctx.createLinearGradient(0, 0, 0, 30);
    lg.addColorStop(0, "#c3c3c3");
    lg.addColorStop(1, "#707070");
    ctx.fillStyle = lg;
    ctx.moveTo(0, 0);
    ctx.lineTo(26, 0);
    ctx.lineTo(26, 13);
    ctx.lineTo(13, 23);
    ctx.lineTo(0, 13);
    ctx.lineTo(0, 0);
    ctx.fill();

    menu2 = document.createElement('div');
    document.body.appendChild(menu2);
    menu2.style.position = 'absolute';
    menu2.style.backgroundColor = '#ededed';
    menu2.style.zIndex = 104;
    menu2.addEventListener('mouseover', menu2_mover, false);
    menu2.addEventListener('mouseout', menu2_mout, false);

    glasspane = dom_create('canvas', null, 'position:absolute;z-index:101;display:none;');
    glasspane.ctx = glasspane.getContext('2d');
    smear1 = dom_create('canvas', null, 'position:absolute;z-index:101;display:none;');
    smear1.ctx = smear1.getContext('2d');
    smear2 = dom_create('canvas', null, 'position:absolute;z-index:101;display:none;');
    smear2.ctx = smear2.getContext('2d');

    alertbox = dom_create('div', document.body, 'position:fixed;top:0px;padding:5px 13px;z-index:101;cursor:default;display:none;');
    alertbox.innerHTML = 0;
    alertbox.messages = [];
    alertbox.addEventListener('click', alertbox_click, false);
    alertbox.title = 'Click to see messages';
}


function alertbox_addmsg(stuff) {
    /* stuff.bgcolor, bg
     stuff.color, text
     stuff.text
     */
    if (!stuff.bgcolor) {
        stuff.bgcolor = '#900';
        stuff.color = 'white';
    }
    alertbox.style.backgroundColor = stuff.bgcolor;
    alertbox.style.color = stuff.color;
    var i = parseInt(alertbox.innerHTML);
    alertbox.innerHTML = i + 1;
    alertbox.messages.push(stuff);
    alertbox.style.display = 'block';
    if (typeof(floatingtoolbox) == 'undefined') {
        alertbox.style.left = '';
        alertbox.style.right = 0;
    } else {
        alertbox.style.left = parseInt(floatingtoolbox.style.left) - 40;
        alertbox.style.right = '';
    }
}

function alertbox_click(event) {
    menu_blank();
    menu_show(0, event.clientX, event.clientY);
    for (var i = 0; i < alertbox.messages.length; i++) {
        var m = alertbox.messages[i];
        var d = dom_create('div', menu.c32, 'margin:10px;padding:5px 10px;border-left:solid 2px ' + m.bgcolor);
        d.innerHTML = m.text;
        if (m.refreshcachehandle) {
            d.appendChild(m.refreshcachehandle);
        }
    }
    alertbox.style.display = 'none';
    alertbox.innerHTML = 0;
    alertbox.messages = [];
}


function menu_smoothwindow_checkbox() {
// change checkbox on the menu
    var bbj = gflag.menu.bbj;
    var tklst = bbj.tklstfrommenu();
    if (menu.c46.checkbox.checked) {
        menu.c46.div.style.display = 'block';
        menu.c46.says.innerHTML = '5-pixel window';
    } else {
        menu.c46.div.style.display = 'none';
    }
    menu_update_track(8);
}

function menu_smoothwindow_change(event) {
    var v = parseInt(menu.c46.says.innerHTML);
    if (isNaN(v)) {
        v = 5;
    } else {
        v = Math.max(3, v + event.target.change);
    }
    menu.c46.says.innerHTML = v + '-pixel window';
    menu_update_track(8);
}


function menu_tkbg_change() {
// from config menu
    var usebg = menu.c44.checkbox.checked;
    var bg = null;
    if (usebg) {
        menu.c44.color.style.display = 'block';
        bg = menu.c44.color.style.backgroundColor;
    } else {
        menu.c44.color.style.display = 'none';
    }
    menu_update_track(38);
}

function menu_tkcurveonly_change() {
    menu_update_track(40);
}

function menu_barplotbg_change() {
// from config menu
    var usebg = menu.c29.checkbox.checked;
    var bg = null;
    if (usebg) {
        menu.c29.color.style.display = 'block';
        bg = menu.c29.color.style.backgroundColor;
    } else {
        menu.c29.color.style.display = 'none';
    }
    menu_update_track(37);
}

function menu_hammock_choosescore(event) {
    gflag.menu.hammock_focus = {scoreidx: event.target.idx};
    menu_update_track(30);
}


function menu2_show() {
    menu2.style.display = 'block';
    document.body.addEventListener('mousedown', menu2_hide, false);
}
function menu2_hide() {
    menu2.style.display = 'none';
    document.body.removeEventListener('mousedown', menu2_hide, false);
}
function menu2_mover(event) {
    document.body.removeEventListener('mousedown', menu_hide, false);
    document.body.removeEventListener('mousedown', menu2_hide, false);
}
function menu2_mout(event) {
    document.body.addEventListener('mousedown', menu_hide, false);
    document.body.addEventListener('mousedown', menu2_hide, false);
}
function menu2ele_click(event) {
    menu2_hide();
    menu.relocate.gene.value = event.target.genename;
    menuJump();
}


function qtrack_logtransform(data, _qtc) {
    /* data is nested array
     returns new vector same as data
     */
    if (_qtc.logtype == undefined || _qtc.logtype == log_no) return data;
    var nd = [];
    for (var i = 0; i < data.length; i++) {
        nd.push([]);
    }
    for (i = 0; i < data.length; i++) {
        for (var j = 0; j < data[i].length; j++) {
            switch (_qtc.logtype) {
                case log_2:
                    nd[i][j] = Math.log(data[i][j]) * Math.LOG2E;
                    break;
                case log_e:
                    nd[i][j] = Math.log(data[i][j]);
                    break;
                case log_10:
                    nd[i][j] = Math.log(data[i][j]) * Math.LOG10E;
                    break;
                default:
                    fatalError('unknown log type');
            }
        }
    }
    return nd;
}

Browser.prototype.get_tkyscale = function (tk) {
    /* only from view range
     do not deal with tkgroup, only get it from data
     */
    if (tk.ft == FT_matplot) {
        return this.tklst_yscale(tk.tracks);
    }
    if (isNumerical(tk)) {
        var data2 = qtrack_logtransform(tk.data, tk.qtc);
        return qtrack_getthreshold(data2, tk.qtc, this.dspBoundary.vstartr, this.dspBoundary.vstopr, this.dspBoundary.vstarts, this.dspBoundary.vstops);
    }
    if (tk.showscoreidx != undefined && tk.showscoreidx >= 0) {
        var scale = tk.scorescalelst[tk.showscoreidx];
        if (scale.type == scale_auto) {
            var s_max = s_min = null;
            for (var i = this.dspBoundary.vstartr; i <= this.dspBoundary.vstopr; i++) {
                for (var j = 0; j < tk.data[i].length; j++) {
                    var item = tk.data[i][j];
                    if (item.boxstart == undefined || item.boxwidth == undefined || !item.scorelst || item.scorelst.length == 0) continue;
                    if (item.boxstart > this.hmSpan - this.move.styleLeft || item.boxstart + item.boxwidth < -this.move.styleLeft) continue;
                    var s = item.scorelst[tk.showscoreidx];
                    if (s_max == null || s_max < s) {
                        s_max = s;
                    }
                    if (s_min == null || s_min > s) {
                        s_min = s;
                    }
                }
            }
            // TODO make it an option: 0-based or dynamic range
            if (s_min > 0) {
                s_min = 0;
            }
            return [s_max, s_min];
        } else {
            return [scale.max, scale.min];
        }
    }
    return [null, null]
};


Browser.prototype.set_tkYscale = function (tk) {
    if (tk.group != undefined) {
        // group scale should have been computed
        var t = this.tkgroup[tk.group];
        tk.maxv = t.max;
        tk.minv = t.min;
        return;
    }
    var max, min;
    if (this.trunk) {
        // one splinter
        var tmp = this.get_tkyscale(tk);
        max = tmp[0];
        min = tmp[1];
        var _o = this.trunk.findTrack(tk.name);
        if (_o) {
            tmp = this.trunk.get_tkyscale(_o);
            max = Math.max(max, tmp[0]);
            min = Math.min(min, tmp[1]);
        }
        for (var h in this.trunk.splinters) {
            if (h != this.horcrux) {
                var b = this.trunk.splinters[h];
                _o = b.findTrack(tk.name);
                if (_o) {
                    tmp = b.get_tkyscale(_o);
                    max = Math.max(max, tmp[0]);
                    min = Math.min(min, tmp[1]);
                }
            }
        }
    } else {
        // is trunk
        var tmp = this.get_tkyscale(tk);
        max = tmp[0];
        min = tmp[1];
        for (var h in this.splinters) {
            var b = this.splinters[h];
            var _o = b.findTrack(tk.name);
            if (_o) {
                tmp = b.get_tkyscale(_o);
                max = Math.max(max, tmp[0]);
                min = Math.min(min, tmp[1]);
            }
        }
    }
    /*
     if(max>0) {
     if(min>0) {
     } else {
     min=0;
     }
     } else {
     max=0;
     }
     */
    tk.maxv = max;
    tk.minv = min;
};

function qtrack_getthreshold(data, qtconfig, startRidx, stopRidx, startDidx, stopDidx) {
    /* figure out threshold for a quantitative track for plotting
     compute for positive/negative data separately
     if not using threshold, use max value
     args:
     data: nested array
     qtconfig is qtc object of the track
     startRidx/stopRidx: data array index
     startDidx/stopDidx: data[x] array index
     */
    if (qtconfig.thtype == scale_fix) {
        return [qtconfig.thmax, qtconfig.thmin];
    }
    var pth; // positive threshold value
    var nth; // negative
    if (qtconfig.thtype == scale_percentile) {
        /*** fixed percentile ***/
        var plst = [];
        var nlst = [];
        for (var i = startRidx; i <= stopRidx; i++) {
            var start = (i == startRidx) ? startDidx : 0;
            var stop = (i == stopRidx) ? stopDidx : data[i].length;
            for (var j = start; j < stop; j++) {
                var v = data[i][j];
                if (isNaN(v) || v == Infinity || v == -Infinity) {
                } else if (v > 0) {
                    plst.push(v);
                } else if (v < 0) {
                    nlst.push(v);
                }
            }
        }
        if (plst.length > 0) {
            plst.sort(numSort);
            var n = parseInt(plst.length * qtconfig.thpercentile / 100);
            if (n >= plst.length)
                n = plst.length - 1;
            pth = plst[n];
        } else {
            pth = 0;
        }
        if (nlst.length > 0) {
            nlst.sort(numSort);
            var n = parseInt(nlst.length * (100 - qtconfig.thpercentile) / 100);
            if (n < 0) n = 0;
            nth = nlst[n];
        } else {
            nth = 0;
        }
    } else if (qtconfig.thtype == scale_auto) {
        /*** auto scale
         bug fixed 2013/9/18
         originally set nth=0, but all values are >0 so nth never set to true min
         ***/
        pth = null;
        nth = null;
        for (var i = startRidx; i <= stopRidx; i++) {
            //if(!data[i]) fatalError(i);
            var start = (i == startRidx) ? startDidx : 0;
            var stop = (i == stopRidx) ? stopDidx : data[i].length;
            for (var j = start; j < stop; j++) {
                var v = data[i][j];
                if (isNaN(v) || v == Infinity || v == -Infinity) {
                } else {
                    if (pth == null) {
                        pth = v;
                    } else if (v > pth) {
                        pth = v;
                    }
                    if (nth == null) {
                        nth = v;
                    } else if (v < nth) {
                        nth = v;
                    }
                }
            }
            if (qtconfig.min_fixed != undefined) {
                nth = Math.max(qtconfig.min_fixed, nth);
            }
            if (qtconfig.max_fixed != undefined) {
                pth = Math.min(qtconfig.max_fixed, pth);
            }
            if (pth < nth) {
                pth = nth;
            }
        }
    } else {
        fatalError("qtrack_getthreshold: unknown threshold type");
    }
    return [pth, nth];
}

function qtcpanel_setdisplay(pm) {
// color
    menu.c50.style.display = "block";
    menu.c50.row2.style.display = 'none';
    if (pm.color1) {
        menu.c50.color1.style.display = 'inline-block';
        menu.c50.color1.innerHTML = pm.color1text ? pm.color1text : 'choose color';
        menu.c50.color1.style.backgroundColor = pm.color1;
    } else {
        menu.c50.color1.style.display = 'none';
    }
    if (pm.color2) {
        menu.c50.row2.style.display = 'block';
        menu.c50.color2.style.display = 'inline-block';
        menu.c50.color2.innerHTML = pm.color2text ? pm.color2text : 'choose color';
        menu.c50.color2.style.backgroundColor = pm.color2;
    } else {
        menu.c50.color2.style.display = 'none';
    }
    menu.c50.color1_1.style.display = menu.c50.color2_1.style.display = 'none';
    if (pm.qtc) {
        qtc_thresholdcolorcell(pm.qtc);
    }
// scale
    if (!pm.no_scale && pm.qtc && pm.qtc.thtype != undefined) {
        menu.c51.style.display = 'block';
        menu.c51.fix.style.display = menu.c51.percentile.style.display = 'none';
        menu.c51.select.firstChild.text = pm.qtc.min_fixed != undefined ? 'Auto (min set at ' + pm.qtc.min_fixed + ')' : (pm.qtc.max_fixed != undefined ? 'Auto (max set at ' + pm.qtc.max_fixed + ')' : 'Automatic scale');
        switch (pm.qtc.thtype) {
            case scale_auto:
                menu.c51.select.selectedIndex = 0;
                break;
            case scale_fix:
                menu.c51.select.selectedIndex = 1;
                menu.c51.fix.style.display = 'block';
                menu.c51.fix.min.value = pm.qtc.thmin;
                menu.c51.fix.max.value = pm.qtc.thmax;
                break;
            case scale_percentile:
                menu.c51.select.selectedIndex = 2;
                menu.c51.percentile.style.display = 'block';
                menu.c51.percentile.says.innerHTML = pm.qtc.thpercentile + ' percentile';
                break;
            default:
                print2console('unknown scale type ' + pm.qtc.thtype, 2);
        }
    } else {
        menu.c51.style.display = 'none';
    }
// log
    if (!pm.no_log && pm.qtc) {
        menu.c52.style.display = 'block';
        if (pm.qtc.logtype == undefined || pm.qtc.logtype == log_no) {
            menu.c52.select.selectedIndex = 0;
        } else {
            menu.c52.select.selectedIndex = pm.qtc.logtype == log_2 ? 1 : (pm.qtc.logtype == log_e ? 2 : 3);
        }
    } else {
        menu.c52.style.display = 'none';
    }
// smoothing
    if (!pm.no_smooth && pm.qtc) {
        menu.c46.style.display = 'block';
        if (pm.qtc.smooth == undefined) {
            menu.c46.checkbox.checked = false;
            menu.c46.div.style.display = 'none';
        } else {
            menu.c46.checkbox.checked = true;
            menu.c46.div.style.display = 'block';
            menu.c46.says.innerHTML = pm.qtc.smooth + '-pixel window';
        }
    } else {
        menu.c46.style.display = 'none';
    }
// summary method
    if (pm.qtc && pm.qtc.summeth != undefined) {
        menu.c59.style.display = 'block';
        menu.c59.select.selectedIndex = pm.qtc.summeth - 1;
        menu.c59.select.options[3].disabled = (pm.ft == FT_bigwighmtk_n || pm.ft == FT_bigwighmtk_c);
    }
    if (pm.ft == FT_bedgraph_n || pm.ft == FT_bedgraph_c) {
        menu.c29.style.display = 'block';
        if (pm.qtc.barplotbg) {
            menu.c29.checkbox.checked = true;
            menu.c29.color.style.display = 'block';
            menu.c29.color.style.backgroundColor = pm.qtc.barplotbg;
        } else {
            menu.c29.checkbox.checked = false;
            menu.c29.color.style.display = 'none';
        }
    }
    if (menu.c66) {
        menu.c66.style.display = 'block';
        menu.c66.checkbox.checked = pm.qtc.curveonly;
    }
}

function qtc_paramCopy(from, to) {
    /* 'from' 'to' are qtc objects (or equipped with same attributes)
     copy values from one to the other */
    for (var p in from) to[p] = from[p];
}


Browser.prototype.trackHeightChanged = function () {
    /* call this whenever track height is changed, any one of them
     */
    if (!this.hmdiv) return;
    this.hmdiv.parentNode.style.height = this.hmdiv.clientHeight;
//if(this.mcm) this.mcmPlaceheader();
    if (this.decordiv) {
        this.decordiv.parentNode.style.height = this.decordiv.clientHeight;
    }
    if (this.onupdatey) {
        this.onupdatey(this);
    }
};


/*** __render__ ends ***/