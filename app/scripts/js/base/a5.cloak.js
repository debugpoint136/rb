/**
 * Created by dpuru on 2/27/15.
 */
Browser.prototype.pixelwidth2bp = function (pxw) {
// argument: pixel width
    return this.entire.atbplevel ? pxw / this.entire.bpwidth : pxw * this.entire.summarySize;
};

Browser.prototype.bp2sw = function (rid, bpw) {
// do not consider gaps
    if (this.entire.atbplevel) return bpw * this.entire.bpwidth;
    return bpw / this.regionLst[rid][7];
};

Browser.prototype.cumoffset = function (rid, coord, include) {
    /* anti sx2rcoord 
     recalculate xoffset for each coordinate-anchor, no need to keep track of global xoffset, lazy
     from region coord to c-u-mulative x offset
     special case for cottonbbj
     */
    if (rid >= this.regionLst.length) return -1;
    var x = 0;
    var r = this.regionLst[rid];
    if (r[8]) {
        /* is cotton, calling from cotton bbj, r[8] has xoffset on canvas
         coord is on query genome
         */
        if (coord < r[3] || coord > r[4]) return -1;
        var fv = r[8].item.hsp.strand == '+';
        x = r[8].canvasxoffset + this.bp2sw(rid, fv ? (coord - r[3] + (include ? 1 : 0)) : (r[4] - coord + (include ? 1 : 0)));
        for (var c in this.weaver.insert[rid]) {
            var use = false;
            if (include) {
                if (fv) use = parseInt(c) <= coord;
                else use = parseInt(c) >= coord;
            } else {
                if (fv) use = parseInt(c) < coord;
                else use = parseInt(c) > coord;
            }
            if (use) {
                x += this.bp2sw(rid, this.weaver.insert[rid][c]);
            }
        }
        return x;
    }
    for (var i = 0; i < this.regionLst.length; i++) {
        var r = this.regionLst[i];
        var islk = this.weaver ? this.weaver.insert[i] : null;
        if (rid == i) {
            if (coord < r[3] || coord > r[4]) return -1;
            x += this.bp2sw(i, coord - r[3] + (include ? 1 : 0));
            if (islk) {
                for (var j in islk) {
                    var use = false;
                    if (include) {
                        use = parseInt(j) <= coord;
                    } else {
                        use = parseInt(j) < coord;
                    }
                    if (use) x += this.bp2sw(i, islk[j]);
                }
            }
            return x;
        } else {
            x += this.bp2sw(i, r[4] - r[3] + 1);
            if (islk) {
                for (var j in islk) {
                    x += this.bp2sw(i, islk[j]);
                }
            }
        }
    }
    return -1;
};

Browser.prototype.sx2rcoord = function (sx, printcoord) {
    /* anti cumoffset
     screen/scrollable x to region coord, x from beginning of scrollable canvas
     */
    var bpl = this.entire.atbplevel;
    var hit = null;
    for (var i = 0; i < this.regionLst.length; i++) {
        var r = this.regionLst[i];
        if (r[8] && r[8].canvasxoffset > sx) {
            return null;
        }
        var fv = (r[8] && r[8].item.hsp.strand == '-') ? false : true;
        var x = this.cumoffset(i, fv ? r[4] : r[3]);
        if (x + regionSpacing.width < sx) {
            continue;
        }
        if (x == sx || x + regionSpacing.width == sx) {
            // hit at region rightmost edge
            hit = {
                rid: i,
                sid: fv ? (bpl ? (r[4] - r[3]) : r[5]) : 0,
                coord: fv ? r[4] : r[3]
            };
            break;
        }
        // within this region
        var c = this.cumoffset(i, fv ? r[3] : r[4]);
        var rint = this.weaver ? this.weaver.insert[i] : null;
        // see if rint is empty
        if (rint) {
            var a = true;
            for (var b in rint) {
                if (b) {
                    a = false;
                    break;
                }
            }
            if (a) rint = null;
        }
        if (bpl) {
            if (fv) {
                for (var j = r[3]; j <= r[4]; j++) {
                    if (rint && (j in rint)) {
                        c += rint[j] * this.entire.bpwidth;
                        if (c >= sx) {
                            // fall into gap, may check which insert
                            hit = {rid: i, sid: j - r[3], coord: j, gap: rint[j]};
                            break;
                        }
                    }
                    if (c + this.entire.bpwidth >= sx) {
                        hit = {rid: i, sid: j - r[3], coord: j};
                        break;
                    }
                    c += this.entire.bpwidth;
                }
            } else {
                for (var j = r[4]; j >= r[3]; j--) {
                    if (rint && (j in rint)) {
                        c += rint[j] * this.entire.bpwidth;
                        if (c >= sx) {
                            // fall into gap, may check which insert
                            hit = {rid: i, sid: r[4] - j, coord: j, gap: rint[j]};
                            break;
                        }
                    }
                    if (c + this.entire.bpwidth >= sx) {
                        hit = {rid: i, sid: r[4] - j, coord: j};
                        break;
                    }
                    c += this.entire.bpwidth;
                }
            }
        } else {
            var incopy = null; //copy
            if (rint) {
                incopy = {};
                for (var ii in rint) incopy[ii] = rint[ii];
            }
            if (fv) {
                var coord = r[3];
                for (var j = 0; j < (r[4] - r[3]) / r[7]; j++) {
                    if (incopy) {
                        var got = false;
                        for (var k = 0; k < Math.ceil(r[7]); k++) {
                            var cc = parseInt(coord) + k;
                            if (cc in incopy) {
                                c += incopy[cc] / r[7];
                                if (c >= sx) {
                                    hit = {rid: i, sid: j, coord: cc, gap: incopy[cc]};
                                    got = true;
                                    break;
                                }
                                delete incopy[cc];
                            }
                        }
                        if (got) break;
                    }
                    coord += r[7];
                    c++;
                    if (c >= sx) {
                        hit = {rid: i, sid: j, coord: coord};
                        break;
                    }
                }
            } else {
                var coord = r[4];
                for (var j = 0; j < (r[4] - r[3]) / r[7]; j++) {
                    if (incopy) {
                        var got = false;
                        for (var k = 0; k < Math.ceil(r[7]); k++) {
                            var cc = parseInt(coord) - k;
                            if (cc in incopy) {
                                c += incopy[cc] / r[7];
                                if (c >= sx) {
                                    hit = {rid: i, sid: j, coord: cc, gap: incopy[cc]};
                                    got = true;
                                    break;
                                }
                                delete incopy[cc];
                            }
                        }
                        if (got) break;
                    }
                    coord -= r[7];
                    c++;
                    if (c >= sx) {
                        hit = {rid: i, sid: j, coord: coord};
                        break;
                    }
                }
            }
        }
        break;
    }
    if (!hit) return null;
    if (printcoord) {
        hit.str = this.genome.temporal_ymd ?
        month2str[parseInt(hit.coord / 100)] + ' ' + (hit.coord % 100) + ', ' + this.regionLst[hit.rid][0] :
        this.regionLst[hit.rid][0] + ' ' + parseInt(hit.coord);
    }
    return hit;
};


Browser.prototype.drawTrack_header = function (tkobj, tosvg) {
    if (tkishidden(tkobj)) return;
    var color = colorCentral.foreground;
    if (this.weaver && this.weaver.iscotton) {
        // cottonbbj drawing its own track
        color = this.weaver.track.qtc.bedcolor;
    }
    var svgdata = [];
    tkobj.header.width = this.leftColumnWidth;
    tkobj.header.height = tk_height(tkobj);
    var ctx = tkobj.header.getContext('2d'); // for header
    ctx.fillStyle = colorCentral.foreground_faint_1;
    ctx.fillRect(0, 0, tkobj.header.width, 1);
    if (tosvg) svgdata.push({
        type: svgt_line_notscrollable,
        x1: 0,
        y1: 0,
        x2: tkobj.header.width,
        y2: 0,
        color: ctx.fillStyle
    });

    if (tkobj.ft == FT_cm_c) {
        if (tkobj.cm.combine || !tkobj.cm.set.rd_r) {
            var min = 0, max;
            if (tkobj.cm.scale) {
                max = parseInt(tkobj.cm.rdmax);
            } else {
                max = 1;
            }
            var d = plot_ruler({
                ctx: ctx,
                stop: densitydecorpaddingtop,
                start: densitydecorpaddingtop + tkobj.qtc.height - 1,
                xoffset: tkobj.header.width - 1,
                horizontal: false,
                color: color,
                min: 0, max: max,
                extremeonly: true,
                max_offset: -4,
                tosvg: tosvg,
            });
            if (tosvg) svgdata = svgdata.concat(d);
            if (!tkobj.cm.scale) {
                // read depth
                b = densitydecorpaddingtop + 1 + tkobj.qtc.height - 10;
                var m = tkobj.cm.rdmax == 0 ? 'No data' : 'Read depth max: ' + parseInt(tkobj.cm.rdmax);
                ctx.fillText(m, 1, b);
                if (tosvg) svgdata.push({type: svgt_text_notscrollable, x: 1, y: b, text: m, color: ctx.fillStyle});
            }
        } else {
            ctx.fillStyle = color;
            var ss = drawscale_compoundtk({
                ctx: ctx,
                x: tkobj.header.width - 1,
                y: densitydecorpaddingtop,
                h: tkobj.qtc.height,
                v1: tkobj.cm.scale ? parseInt(tkobj.cm.rdmax) : 1,
                v2: 0,
                v3: tkobj.cm.scale ? parseInt(tkobj.cm.rdmax) : 1,
                scrollable: false,
                tosvg: tosvg
            });

            if (tosvg) svgdata = svgdata.concat(ss);

            if (!tkobj.cm.scale) {
                // read depth
                b = densitydecorpaddingtop + 1 + 2 * tkobj.qtc.height - 10;
                var m = tkobj.cm.rdmax == 0 ? 'No data' : 'Read depth max: ' + parseInt(tkobj.cm.rdmax);
                ctx.fillText(m, 1, b);
                if (tosvg) svgdata.push({type: svgt_text_notscrollable, x: 1, y: b, text: m, color: ctx.fillStyle});
            }
            // f,r
            if (tkobj.qtc.height >= 40) {
                a = tkobj.header.width - 50;
                b = densitydecorpaddingtop + tkobj.qtc.height - 10;
                ctx.fillText('Forward', a, b);
                if (tosvg) svgdata.push({
                    type: svgt_text_notscrollable,
                    x: a,
                    y: b,
                    text: 'Forward',
                    color: ctx.fillStyle
                });
                b = densitydecorpaddingtop + tkobj.qtc.height + 20;
                ctx.fillText('Reverse', a, b);
                if (tosvg) svgdata.push({
                    type: svgt_text_notscrollable,
                    x: a,
                    y: b,
                    text: 'Reverse',
                    color: ctx.fillStyle
                });
            }
        }
        // label
        ctx.fillText(tkobj.label, 1, 25);
        if (tosvg) svgdata.push({type: svgt_text_notscrollable, x: 1, y: 25, text: tkobj.label, color: ctx.fillStyle});
        return svgdata;
    }

    if (tkobj.ft == FT_weaver_c) {
        ctx.font = "bold 9pt Sans-serif";
        ctx.fillStyle = weavertkcolor_target;
        ctx.fillRect(0, 1, this.leftColumnWidth, 1);
        if (tosvg) svgdata.push({
            type: svgt_line_notscrollable,
            x1: 0,
            y1: 2,
            x2: this.leftColumnWidth,
            y2: 1,
            color: ctx.fillStyle
        });
        var w = ctx.measureText(this.genome.name).width;
        var x = this.leftColumnWidth - w - 2;
        var y = 12 + weavertkpad;
        ctx.fillText(this.genome.name, x, y);
        if (tosvg) svgdata.push({
            type: svgt_text_notscrollable,
            x: x,
            y: y,
            text: this.genome.name,
            color: ctx.fillStyle
        });
        ctx.fillStyle = tkobj.qtc.bedcolor;
        ctx.fillRect(0, tkobj.canvas.height - 2, this.leftColumnWidth, 1);
        if (tosvg) svgdata.push({
            type: svgt_line_notscrollable,
            x1: 0,
            y1: tkobj.canvas.height - 2,
            x2: this.leftColumnWidth,
            y2: tkobj.canvas.height - 1,
            color: ctx.fillStyle
        });
        y = tkobj.header.height - weavertkpad - 2;
        var w = ctx.measureText(tkobj.cotton).width;
        var x = this.leftColumnWidth - w - 2;
        ctx.fillText(tkobj.cotton, x, y);
        if (tosvg) svgdata.push({type: svgt_text_notscrollable, x: x, y: y, text: tkobj.cotton, color: ctx.fillStyle});
        return svgdata;
    }

    var maxv = tkobj.maxv; // may not be used
    var minv = tkobj.minv;
    if (tkobj.group != undefined) {
        var t = this.tkgroup[tkobj.group];
        maxv = t.max_show;
        minv = t.min_show;
    } else if (tkobj.normalize) {
        maxv = this.track_normalize(tkobj, maxv);
        minv = this.track_normalize(tkobj, minv);
    }

    var y = 0;
    if (tkobj.mode == M_bar || (isNumerical(tkobj) && tkobj.qtc.height >= 20) || tkobj.ft == FT_matplot || tkobj.ft == FT_qcats) {
        var d = plot_ruler({
            ctx: ctx,
            stop: densitydecorpaddingtop,
            start: densitydecorpaddingtop + tkobj.qtc.height - 1,
            xoffset: tkobj.header.width - 1,
            horizontal: false,
            color: color,
            min: minv,
            max: maxv,
            extremeonly: true,
            max_offset: -4,
            tosvg: tosvg,
        });
        if (tosvg) svgdata = svgdata.concat(d);
        if (tkobj.mode == M_bar && tkobj.showscoreidx >= 0) {
            var s = tkobj.scorenamelst[tkobj.showscoreidx];
            ctx.fillText(s, 1, tkobj.qtc.height + 12);
            if (tosvg) svgdata.push({type: svgt_text_notscrollable, x: 1, y: 30, text: s});
        } else if (isNumerical(tkobj) && tkobj.qtc.height >= 20 && tkobj.qtc.logtype != undefined && tkobj.qtc.logtype != log_no) {
            var s;
            if (tkobj.qtc.logtype == log_2) {
                s = '(log2 scale)';
            } else if (tkobj.qtc.logtype == log_e) {
                s = '(ln scale)';
            } else {
                s = '(log10 scale)';
            }
            ctx.fillText(s, 1, 36);
            if (tosvg) svgdata.push({type: svgt_text_notscrollable, x: 1, y: 36, text: s});
        }
        y = 10;
    }

// plot label
    ctx.font = "8pt Sans-serif";
    if (ctx.measureText(tkobj.label).width >= this.leftColumnWidth - 7) {
        // clear things in the path, digit 0 is usually there when track height is not big
        var w = this.leftColumnWidth - 7;
        ctx.clearRect(0, y, w, 13);
        if (tosvg) svgdata.push({type: svgt_rect_notscrollable, x: 0, y: y, w: w, h: 13, fill: 'white'});
    }

    y += 10;
    ctx.fillStyle = color;
    var label = (tkobj.cotton ? tkobj.cotton + ' ' : '') + tkobj.label;
    ctx.fillText(label, 1, y);
    if (tosvg) svgdata.push({type: svgt_text_notscrollable, x: 1, y: y, text: label});

    if (tkobj.ft == FT_matplot) {
        ctx.font = 'bold 8pt Sans-serif';
        var w = this.leftColumnWidth - 2;
        var sh = 11; // h for tklabel
        y += 5;
        for (var i = 0; i < tkobj.tracks.length; i++) {
            if (y >= tkobj.qtc.height - sh - 6) break;
            var q = tkobj.tracks[i].qtc;
            ctx.fillStyle = 'rgb(' + q.pr + ',' + q.pg + ',' + q.pb + ')';
            ctx.fillText(tkobj.tracks[i].label, 2, y + 10);
            if (tosvg) svgdata.push({
                type: svgt_text_notscrollable,
                x: 2,
                y: y + 10,
                text: tkobj.tracks[i].label,
                color: ctx.fillStyle,
                bold: true
            });
            y += 12;
        }
        return svgdata;
    }

    if ((tkobj.mode == M_full || tkobj.mode == M_thin) && tkobj.showscoreidx != undefined && tkobj.showscoreidx >= 0) {
        var t = 'max: ' + tkobj.maxv;
        y += 10;
        ctx.fillText(t, 1, y);
        if (tosvg) svgdata.push({type: svgt_text_notscrollable, x: 1, y: y, text: t});
        var t = 'min: ' + tkobj.minv;
        y += 10;
        ctx.fillText(t, 1, y);
        if (tosvg) svgdata.push({type: svgt_text_notscrollable, x: 1, y: y, text: t});
    }
    if (tkobj.skipped > 0) {
        y += 15;
        ctx.fillText(tkobj.skipped + ' items not shown', 1, y);
        if (tosvg) svgdata.push({type: svgt_text_notscrollable, x: 1, y: y, text: t});
        y += 10;
        ctx.fillText('(data exceeds limit)', 1, y);
    }

    if (tosvg) return svgdata;
};


Browser.prototype.drawTrack_browser = function (tkobj, tosvg) {
    /* draw one regular track in browser panel
     not for bev or circlet
     will draw main canvas and header, but not mcm
     to draw a cottontk, must call from cottonbbj (but not target bbj)
     */

    var yoffset = 0; // reserved for future use

    var tc = tkobj.canvas;
    var ctx = tc.getContext("2d");
    if (this.targetBypassQuerytk(tkobj)) {
        return [];
    }
    if (tkobj.mastertk) {
        // this tk is in a compound track, it will be drawn by its master
        return;
    }
    var svgdata = [];
    var unitwidth = this.entire.atbplevel ? this.entire.bpwidth : 1;
    if (tkobj.qtc.bg) {
        tc.style.backgroundColor = tkobj.qtc.bg;
        /* error if c is not initialized
         but no trouble as no svg would be made in beginning
         */
        if (tosvg) svgdata.push({
            type: svgt_rect,
            x: 0,
            y: 0,
            w: tc.width,
            h: tc.height + parseInt(tc.style.paddingBottom),
            fill: tkobj.qtc.bg
        });
    } else {
        tc.style.backgroundColor = '';
    }
// set canvas dimension
    tc.width = this.entire.spnum;
// height needs to be set for a few cases, otherwise already set when stacking
    if (tkobj.ft == FT_matplot || tkobj.ft == FT_qcats) {
        tc.height = tkobj.qtc.height + densitydecorpaddingtop;
    } else if (isNumerical(tkobj)) {
        tc.height = tkobj.qtc.height + (tkobj.qtc.height >= 20 ? densitydecorpaddingtop : 0);
    } else if (tkobj.ft == FT_cat_c || tkobj.ft == FT_cat_n || tkobj.ft == FT_catmat) {
        tc.height = 1 + tkobj.qtc.height;
    } else if (tkobj.ft == FT_catmat) {
    }
    ctx.clearRect(0, 0, tc.width, tc.height);

    if (this.weaver) {
        if (this.weaver.iscotton && this.regionLst.length == 0) {
            // cottonbbj drawing a cotton tk, but got no regions
            ctx.fillStyle = colorCentral.foreground_faint_5;
            var s = tkobj.label + ' - NO MATCH BETWEEN ' + this.genome.name + ' AND ' + this.weaver.target.genome.name + ' IN VIEW RANGE';
            var w = ctx.measureText(s).width;
            ctx.fillText(s, (this.hmSpan - w) / 2 - this.move.styleLeft, tc.height / 2 + 5);
            this.drawTrack_header(tkobj);
            return;
        }
        if (tkobj.ft != FT_weaver_c) {
            /* paint gap
             gap should only happen in fine mode
             */
            ctx.fillStyle = gapfillcolor;
            for (var i = 0; i < this.regionLst.length; i++) {
                var r = this.regionLst[i];
                var ins = this.weaver.insert[i];
                var fvd = (r[8] && r[8].item.hsp.strand == '-') ? false : true;
                for (var c in ins) {
                    ctx.fillRect(
                        this.cumoffset(i, parseInt(c)),
                        yoffset,
                        this.bp2sw(i, ins[c]),
                        tc.height);
                }
            }
        }
    }
    ctx.fillStyle = colorCentral.foreground_faint_1;
    ctx.fillRect(0, yoffset, tc.width, 1);
    yoffset += 1;

    if (tkobj.ft == FT_matplot) {
        if (!tkobj.tracks) fatalError('matplot .tracks missing');
        if (tkobj.tracks.length == 0) fatalError('matplot empty .tracks');
        /* when matplot y scale has been changed, need to apply to members to take effect!
         */
        for (var i = 0; i < tkobj.tracks.length; i++) {
            var n = tkobj.tracks[i];
            if (typeof(n) == 'string') {
                this.tklst.forEach(function (t) {
                    if (t.name == n) {
                        t.mastertk = tkobj;
                        tkobj.tracks[i] = t;
                    }
                });
            }
            qtc_paramCopy(tkobj.qtc, tkobj.tracks[i].qtc);
        }

        for (var i = 0; i < tkobj.tracks.length; i++) {
            var mtk = tkobj.tracks[i];
            if (mtk.qtc.smooth) {
                smooth_tkdata(mtk);
            }
        }
        this.set_tkYscale(tkobj);
        for (var i = 0; i < tkobj.tracks.length; i++) {
            var mtk = tkobj.tracks[i];
            var d = this.matplot_drawtk(tkobj, mtk, tosvg);
            if (tosvg) svgdata = svgdata.concat(d);
        }
        if (this.trunk) {
            // this is a splinter, need to plot scale
            var d = plot_ruler({
                ctx: ctx,
                stop: densitydecorpaddingtop,
                start: densitydecorpaddingtop + tkobj.qtc.height - 1,
                xoffset: this.hmSpan - this.move.styleLeft - 10,
                horizontal: false,
                color: colorCentral.foreground,
                min: tkobj.minv,
                max: tkobj.maxv,
                extremeonly: true,
                max_offset: -4,
                tosvg: tosvg,
            });
            if (tosvg) svgdata = svgdata.concat(d);
        }
    } else if (tkobj.ft == FT_cm_c) {
        var d = this.cmtk_prep_draw(tkobj, tosvg);
        if (tosvg) svgdata = svgdata.concat(d);
    } else if (isNumerical(tkobj)) {
        if (tkobj.qtc.smooth) {
            // smoothing may have been done upon no-move update
            if (!tkobj.data_raw) fatalError('data_raw missing');
            smooth_tkdata(tkobj);
        }
        var _d = this.drawTrack_altregiondecor(ctx, tc.height, tosvg);
        if (tosvg) svgdata = svgdata.concat(_d);

        this.set_tkYscale(tkobj);
        var data2 = qtrack_logtransform(tkobj.data, tkobj.qtc);
        for (var i = 0; i < this.regionLst.length; i++) {
            var r = this.regionLst[i];
            var svd = this.barplot_base({
                data: data2[i],
                ctx: ctx,
                colors: {
                    p: 'rgb(' + tkobj.qtc.pr + ',' + tkobj.qtc.pg + ',' + tkobj.qtc.pb + ')',
                    n: 'rgb(' + tkobj.qtc.nr + ',' + tkobj.qtc.ng + ',' + tkobj.qtc.nb + ')',
                    pth: tkobj.qtc.pth,
                    nth: tkobj.qtc.nth,
                    barbg: tkobj.qtc.barplotbg
                },
                tk: tkobj,
                rid: i,
                x: this.cumoffset(i, r[3]),
                y: tkobj.qtc.height >= 20 ? densitydecorpaddingtop : 0,
                h: tkobj.qtc.height,
                pointup: true,
                tosvg: tosvg
            });
            if (tosvg) svgdata = svgdata.concat(svd);
            if (tosvg) {
                var _th = tk_height(tkobj);
                var x = this.cumoffset(i, r[4]);
                svgdata.push({
                    type: svgt_line,
                    x1: x, y1: 0,
                    x2: x, y2: _th,
                    w: regionSpacing.width,
                    color: regionSpacing.color
                });
            }
        }
        if ((this.splinterTag || !this.hmheaderdiv) && tkobj.qtc.height >= 20) {
            // splinter tk, draw a in-track scale as its scale is usually different with trunk
            var d = plot_ruler({
                ctx: ctx,
                stop: densitydecorpaddingtop,
                start: densitydecorpaddingtop + tkobj.qtc.height - 1,
                xoffset: this.hmSpan - this.move.styleLeft - 10,
                horizontal: false,
                color: colorCentral.foreground,
                min: tkobj.minv,
                max: tkobj.maxv,
                extremeonly: true,
                max_offset: -4,
                tosvg: tosvg,
                scrollable: true, // because scale is on tk canvas, its position subject to adjustment
            });
            if (tosvg) svgdata = svgdata.concat(d);
        }
    } else if (tkobj.ft == FT_cat_c || tkobj.ft == FT_cat_n) {
        // consider merge cat to hammock
        for (var i = 0; i < this.regionLst.length; i++) {
            var r = this.regionLst[i];
            var bpincrement = this.entire.atbplevel ? 1 : r[7];
            var pastj = 0;
            var pastcat = tkobj.data[i][pastj];
            while (pastcat == -1 || !(pastcat in tkobj.cateInfo)) {
                pastj++;
                if (pastj == tkobj.data[i].length) break;
                pastcat = tkobj.data[i][pastj];
            }
            for (var j = pastj + 1; j < tkobj.data[i].length; j++) {
                var v = tkobj.data[i][j];
                if (v != pastcat) {
                    if (pastcat != -1 && (pastcat in tkobj.cateInfo)) {
                        var s = this.tkcd_box({
                            ctx: ctx,
                            rid: i,
                            start: r[3] + bpincrement * pastj,
                            stop: r[3] + bpincrement * (j),
                            y: yoffset,
                            h: tkobj.qtc.height,
                            fill: tkobj.cateInfo[pastcat][1],
                            tosvg: tosvg,
                        });
                        if (tosvg) svgdata = svgdata.concat(s);
                    }
                    pastj = j;
                    pastcat = v;
                }
            }
            if (pastcat in tkobj.cateInfo) {
                var s = this.tkcd_box({
                    ctx: ctx,
                    rid: i,
                    start: r[3] + bpincrement * pastj,
                    stop: r[4],
                    y: yoffset,
                    h: tkobj.qtc.height,
                    fill: tkobj.cateInfo[pastcat][1],
                    tosvg: tosvg,
                });
                if (tosvg) svgdata = svgdata.concat(s);
            }
            if (tosvg) {
                var x = this.cumoffset(i, r[4]);
                svgdata.push({
                    type: svgt_line,
                    x1: x, y1: yoffset,
                    x2: x, y2: yoffset + tkobj.qtc.height,
                    w: regionSpacing.width,
                    color: regionSpacing.color
                });
            }
        }
    } else if (tkobj.ft == FT_catmat) {
        /* no way to be integrated with cat since cat data is summarized but
         catmat is like stack track with all data, no summary!
         */
        var _y = yoffset;
        for (var layer = 0; layer < tkobj.rowcount; layer++) {
            for (var i = 0; i < this.regionLst.length; i++) {
                if (!tkobj.data[i] || tkobj.data[i].length == 0) continue;
                var r = this.regionLst[i];
                var pastj = 0,
                    pastcat = tkobj.data[i][pastj].layers[layer],
                    paststart = Math.max(r[3], tkobj.data[i][pastj].start);
                while (pastcat == -1 || !(pastcat in tkobj.cateInfo)) {
                    pastj++;
                    if (pastj == tkobj.data[i].length) break;
                    pastcat = tkobj.data[i][pastj].layers[layer];
                    paststart = Math.max(r[3], tkobj.data[i][pastj].start);
                }
                for (var j = pastj + 1; j < tkobj.data[i].length; j++) {
                    var v = tkobj.data[i][j].layers[layer];
                    if (v != pastcat) {
                        if (pastcat != -1 && (pastcat in tkobj.cateInfo)) {
                            // must apply bar width to barplot(), or else damned
                            var s = this.tkcd_box({
                                ctx: ctx,
                                rid: i,
                                start: paststart,
                                stop: Math.min(r[4], tkobj.data[i][j].start),
                                y: _y,
                                h: tkobj.rowheight,
                                fill: tkobj.cateInfo[pastcat][1],
                                tosvg: tosvg,
                            });
                            if (tosvg) svgdata = svgdata.concat(s);
                        }
                        pastj = j;
                        pastcat = v;
                        paststart = Math.max(r[3], tkobj.data[i][j].start);
                    }
                }
                if (pastcat in tkobj.cateInfo) {
                    var s = this.tkcd_box({
                        ctx: ctx,
                        rid: i,
                        start: paststart,
                        stop: Math.min(r[4], tkobj.data[i][tkobj.data[i].length - 1].stop),
                        y: _y,
                        h: tkobj.rowheight,
                        fill: tkobj.cateInfo[pastcat][1],
                        tosvg: tosvg,
                    });
                    if (tosvg) svgdata = svgdata.concat(s);
                }
                if (tosvg) {
                    var x = this.cumoffset(i, r[4]);
                    svgdata.push({
                        type: svgt_line,
                        x1: x, y1: _y,
                        x2: x, y2: _y + tc.height,
                        w: regionSpacing.width,
                        color: regionSpacing.color
                    });
                }
            }
            _y += tkobj.rowheight;
        }
    } else if (tkobj.ft == FT_qcats) {
        // set y scale first
        yoffset += densitydecorpaddingtop;
        var _min = 0, _max = 0;
        for (var i = this.dspBoundary.vstartr; i <= this.dspBoundary.vstopr; i++) {
            if (!tkobj.data[i] || tkobj.data[i].length == 0) continue;
            var r = this.regionLst[i];
            var start = i == this.dspBoundary.vstartr ? this.dspBoundary.vstartc : r[3];
            var stop = i == this.dspBoundary.vstopr ? this.dspBoundary.vstopc : r[4];
            for (var j = 0; j < tkobj.data[i].length; j++) {
                var qcats = tkobj.data[i][j].qcat;
                if (!qcats) continue;
                var __min = 0, __max = 0;
                for (var k = 0; k < qcats.length; k++) {
                    var a = qcats[k][0];
                    if (a > 0) __max += a;
                    else __min += a;
                }
                // cache y range for each data point
                var __c = __min;
                for (k = 0; k < qcats.length; k++) {
                    var a = qcats[k][0];
                    if (a == 0) continue;
                    qcats[k][2] = a < 0 ? __c - a : __c + a;
                    __c = qcats[k][2];
                }
                if (Math.max(tkobj.data[i][j].start, start) < Math.min(tkobj.data[i][j].stop, stop)) {
                    _min = Math.min(_min, __min);
                    _max = Math.max(_max, __max);
                }
            }
        }
        tkobj.minv = _min;
        tkobj.maxv = _max;
        // plot data
        for (var i = this.dspBoundary.vstartr; i <= this.dspBoundary.vstopr; i++) {
            if (!tkobj.data[i] || tkobj.data[i].length == 0) continue;
            var r = this.regionLst[i];
            for (var j = 0; j < tkobj.data[i].length; j++) {
                var qcats = tkobj.data[i][j].qcat;
                if (!qcats) continue;
                for (var k = 0; k < qcats.length; k++) {
                    var v = qcats[k][0];
                    if (v == 0) continue;
                    // must apply bar width to barplot(), or else damned
                    var _y = yoffset + tkobj.qtc.height * (_max - qcats[k][2]) / (_max - _min);
                    var _h = tkobj.qtc.height * Math.abs(v) / (_max - _min);
                    var s = this.tkcd_box({
                        ctx: ctx,
                        rid: i,
                        start: tkobj.data[i][j].start,
                        stop: tkobj.data[i][j].stop,
                        y: _y,
                        h: _h,
                        fill: tkobj.cateInfo[qcats[k][1]][1],
                        tosvg: tosvg,
                    });
                    qcats[k][3] = _y;
                    qcats[k][4] = _h;
                    if (tosvg) svgdata = svgdata.concat(s);
                }
            }
            if (tosvg) {
                var x = this.cumoffset(i, r[4]);
                svgdata.push({
                    type: svgt_line,
                    x1: x, y1: yoffset,
                    x2: x, y2: yoffset + tc.height,
                    w: regionSpacing.width,
                    color: regionSpacing.color
                });
            }
        }
    } else {
        /* stack/bar/arc/trihm/weaver
         */
        if (tkobj.ft == FT_ld_c || tkobj.ft == FT_ld_n) {
            this.regionLst = this.decoy_dsp.regionLst;
            this.dspBoundary = this.decoy_dsp.dspBoundary;
        } else if (tkobj.ft == FT_weaver_c) {
            if (!this.weaver) fatalError('but browser.weaver is unknown');
        }

        if (tkobj.qtc) {
            ctx.font = (tkobj.qtc.fontbold ? 'bold' : '') + ' ' +
            (tkobj.qtc.fontsize ? tkobj.qtc.fontsize : '8pt') + ' ' +
            (tkobj.qtc.fontfamily ? tkobj.qtc.fontfamily : 'sans-serif');
        }

        var drawTriheatmap = tkobj.mode == M_trihm;
        var drawArc = tkobj.mode == M_arc;
        var isSam = (tkobj.ft == FT_bam_c || tkobj.ft == FT_bam_n);
        var isChiapet = (tkobj.ft == FT_lr_n || tkobj.ft == FT_lr_c);

        var isThin = tkobj.mode == M_thin;
        var stackHeight = tkobj.qtc.stackheight ? tkobj.qtc.stackheight : (isThin ? thinStackHeight : fullStackHeight);

        var startRidx = 0, stopRidx = this.regionLst.length - 1,
            startViewCoord = this.dspBoundary.vstartc,
            stopViewCoord = this.dspBoundary.vstopc;
        if (tkobj.ft == FT_ld_c || tkobj.ft == FT_ld_n) {
            startRidx = this.dspBoundary.vstartr;
            stopRidx = this.dspBoundary.vstopr;
        }

        var Data = tkobj.data;
        var Data2 = tkobj.data_chiapet;
        if (isChiapet && (!drawArc && !drawTriheatmap)) Data = Data2;

        var old_yoffset = yoffset;

        var i, j;

        var _d = this.drawTrack_altregiondecor(ctx, tc.height, tosvg);
        if (tosvg) svgdata = svgdata.concat(_d);

        if (tkobj.ft == FT_ld_c || tkobj.ft == FT_ld_n) {
            // leave space for snp
            yoffset += tkobj.ld.ticksize + tkobj.ld.topheight;
        }

        var vstartRidx = this.dspBoundary.vstartr,
            vstopRidx = this.dspBoundary.vstopr;

        /* score-graded tk items: lr, ld, hammock
         */
        var pcolorscore = ncolorscore = // lr
            colorscore_min = colorscore_max = null; // hammock
        if (tkobj.ft == FT_lr_c || tkobj.ft == FT_lr_n) {
            pcolorscore = tkobj.qtc.pcolorscore;
            ncolorscore = tkobj.qtc.ncolorscore;
            if (tkobj.qtc.thtype == scale_auto) {
                var s_max = s_min = 0;
                for (var i = vstartRidx; i <= vstopRidx; i++) {
                    if (drawArc || drawTriheatmap) {
                        for (var j = 0; j < Data2[i].length; j++) {
                            var item = Data2[i][j];
                            if (item.boxstart == undefined || item.boxwidth == undefined) continue;
                            if (item.boxstart > this.hmSpan - this.move.styleLeft || item.boxstart + item.boxwidth < -this.move.styleLeft) continue;
                            var s = item.name;
                            if (s > 0 && s > s_max) s_max = s;
                            else if (s < 0 && s < s_min) s_min = s;
                        }
                    } else {
                        for (var j = 0; j < Data[i].length; j++) {
                            var item = Data[i][j];
                            if (item.boxstart == undefined || item.boxwidth == undefined) continue;
                            if (item.boxstart > this.hmSpan - this.move.styleLeft || item.boxstart + item.boxwidth < -this.move.styleLeft) continue;
                            var s;
                            if (item.struct) {
                                s = item.name;
                            } else {
                                // unmatched
                                s = parseInt(item.name.split(',')[1]);
                            }
                            if (s > 0 && s > s_max) s_max = s;
                            else if (s < 0 && s < s_min) s_min = s;
                        }
                    }
                }
                pcolorscore = tkobj.qtc.pcolorscore = s_max;
                ncolorscore = tkobj.qtc.ncolorscore = s_min;
            }
        } else if (tkobj.ft == FT_ld_c || tkobj.ft == FT_ld_n) {
            if (tkobj.showscoreidx >= 0) {
                var scale = tkobj.scorescalelst[tkobj.showscoreidx];
                if (scale.type == scale_auto) {
                    var s_max = s_min = 0;
                    for (var i = vstartRidx; i <= vstopRidx; i++) {
                        for (var j = 0; j < Data2[i].length; j++) {
                            var item = Data2[i][j];
                            if (item.boxstart == undefined || item.boxwidth == undefined) continue;
                            if (item.boxstart > this.hmSpan - this.move.styleLeft || item.boxstart + item.boxwidth < -this.move.styleLeft) continue;
                            var s = item.name;
                            if (s > 0 && s > s_max) s_max = s;
                            else if (s < 0 && s < s_min) s_min = s;
                        }
                    }
                    pcolorscore = tkobj.qtc.pcolorscore = s_max;
                    ncolorscore = tkobj.qtc.ncolorscore = s_min;
                } else {
                    pcolorscore = tkobj.qtc.pcolorscore = scale.max;
                    ncolorscore = tkobj.qtc.ncolorscore = scale.min;
                }
            } else {
            }
        } else if (tkobj.showscoreidx != undefined && tkobj.showscoreidx >= 0) {
            // hammock
            this.set_tkYscale(tkobj);
            colorscore_min = tkobj.minv;
            colorscore_max = tkobj.maxv;
        }

        // in case of drawing trihm in main panel, will measure highest dome within dsp to set track height
        var canvasstart = 0 - this.move.styleLeft;
        var canvasstop = canvasstart + this.hmSpan;
        var viewrangeblank = true; // if any item is drawn within view range
        if (drawArc) {
            var arcdata = [];
            /* store arc data for clicking on canvas
             each ele is for one arc/pair:
             [center x, center y, radius, region idx, array idx]
             canvas yoffset must be subtracted
             */
            for (i = startRidx; i <= stopRidx; i++) {
                if (!Data2[i]) continue;
                for (var j = 0; j < Data2[i].length; j++) {
                    var item = Data2[i][j];
                    if (!item.struct || item.boxstart == undefined || item.boxwidth == undefined) continue;
                    if (Math.max(item.boxstart, canvasstart) < Math.min(item.boxstart + item.boxwidth, canvasstop)) {
                        viewrangeblank = false;
                    }
                    // TODO replace pcolorscore with tkobj.maxv/.minv
                    var color = (item.name >= 0) ?
                    'rgba(' + tkobj.qtc.pr + ',' + tkobj.qtc.pg + ',' + tkobj.qtc.pb + ',' + Math.min(1, item.name / pcolorscore) + ')' :
                    'rgba(' + tkobj.qtc.nr + ',' + tkobj.qtc.ng + ',' + tkobj.qtc.nb + ',' + Math.min(1, item.name / ncolorscore) + ')';

                    var centerx = item.boxstart + item.boxwidth / 2;
                    var centery = yoffset - item.boxwidth / 2;
                    var arcwidth = 1; // TODO arc width auto-adjust
                    var radius = Math.max(0, item.boxwidth / Math.SQRT2 - arcwidth / 2);
                    ctx.strokeStyle = color;
                    ctx.lineWidth = arcwidth;
                    ctx.beginPath();
                    ctx.arc(centerx, centery, radius, 0.25 * Math.PI, 0.75 * Math.PI, false);
                    ctx.stroke();
                    arcdata.push([centerx, centery, radius, i, j, arcwidth]);
                    if (tosvg) {
                        svgdata.push({
                            type: svgt_arc, radius: radius,
                            x1: item.boxstart, y1: 0,
                            x2: item.boxstart + item.boxwidth, y2: 0,
                            color: color
                        });
                    }
                }
            }
            tkobj.data_arc = arcdata;
        } else if (drawTriheatmap) {
            // canvas yoffset must be subtracted
            var hmdata = []; // for mouse click detection
            for (i = startRidx; i <= stopRidx; i++) {
                if (!(Data2[i])) continue;
                for (var j = 0; j < Data2[i].length; j++) {
                    var item = Data2[i][j];
                    if (!item.struct || item.boxstart == undefined || item.boxwidth == undefined) continue;
                    if (item.boxstart < 0) continue;
                    if (item.boxwidth >= this.hmSpan * 2) {
                        /*** if the loci spans over 2 hmspan on canvas, skip
                         ***/
                        continue;
                    }
                    if (Math.max(item.boxstart, canvasstart) < Math.min(item.boxstart + item.boxwidth, canvasstop)) {
                        viewrangeblank = false;
                    }

                    /* horizontal width of two mates
                     the width is used as horizontal side of a isosceles
                     */
                    // left
                    var e = item.struct.L;
                    var _r = this.regionLst[e.rid];
                    var leftw = Math.max(this.cumoffset(e.rid, Math.min(_r[4], e.stop)) - this.cumoffset(e.rid, Math.max(_r[3], e.start)), 2);
                    // right
                    e = item.struct.R;
                    _r = this.regionLst[e.rid];
                    var rightw = Math.max(this.cumoffset(e.rid, Math.min(_r[4], e.stop)) - this.cumoffset(e.rid, Math.max(_r[3], e.start)), 2);
                    var color = (item.name >= 0) ?
                    'rgba(' + tkobj.qtc.pr + ',' + tkobj.qtc.pg + ',' + tkobj.qtc.pb + ',' + Math.min(1, item.name / pcolorscore) + ')' :
                    'rgba(' + tkobj.qtc.nr + ',' + tkobj.qtc.ng + ',' + tkobj.qtc.nb + ',' + Math.min(1, item.name / ncolorscore) + ')';
                    // top corner point position
                    var _tan = Math.tan(tkobj.qtc.anglescale * Math.PI / 4);
                    var top_x = item.boxstart + item.boxwidth / 2;
                    var top_y = yoffset + item.boxwidth * _tan / 2;
                    ctx.fillStyle = color;
                    ctx.beginPath();
                    /*		p3
                     p4		p2
                     p1
                     */
                    var a1 = top_x,
                        b1 = top_y,
                        a2 = top_x + leftw / 2,
                        b2 = top_y - leftw * _tan / 2;
                    a3 = top_x + leftw / 2 - rightw / 2,
                        b3 = top_y - leftw * _tan / 2 - rightw * _tan / 2,
                        a4 = top_x - rightw / 2,
                        b4 = top_y - rightw * _tan / 2;
                    ctx.moveTo(a1, b1);
                    ctx.lineTo(a2, b2);
                    ctx.lineTo(a3, b3);
                    ctx.lineTo(a4, b4);
                    ctx.closePath();
                    ctx.fill();
                    hmdata.push([top_x, top_y, leftw, rightw, i, j]);
                    if (tosvg) {
                        svgdata.push({
                            type: svgt_trihm,
                            x1: a1, y1: b1,
                            x2: a2, y2: b2,
                            x3: a3, y3: b3,
                            x4: a4, y4: b4,
                            color: color
                        });
                    }
                }
            }
            tkobj.data_trihm = hmdata;
        } else if (tkobj.mode == M_bar) {
            /***** hammock barplot
             */
            var y0 = densitydecorpaddingtop + tkobj.qtc.height + 1 + yoffset;
            var bedcolor = tkobj.qtc.bedcolor,
                textcolor = tkobj.qtc.textcolor;
            var bedcolorlst = colorstr2int(bedcolor).join(','),
                textcolorlst = colorstr2int(textcolor).join(',');
            for (i = startRidx; i <= stopRidx; i++) {
                var r = this.regionLst[i];
                if (Data[i] == undefined) {
                    continue;
                }
                var regionstart = r[3];
                var regionstop = r[4];
                for (var j = 0; j < Data[i].length; j++) {
                    var item = Data[i][j];
                    if (item.boxstart == undefined || !item.boxwidth) continue;
                    if (Math.max(item.boxstart, canvasstart) < Math.min(item.boxstart + item.boxwidth, canvasstop)) {
                        viewrangeblank = false;
                    }
                    // may category-specific style
                    if (item.category != undefined && tkobj.cateInfo && (item.category in tkobj.cateInfo)) {
                        // apply category color
                        textcolor = bedcolor = tkobj.cateInfo[item.category][1];
                        bedcolorlst = colorstr2int(bedcolor).join(',');
                    }
                    // item
                    var a = y0 + item.stack * (fullStackHeight + 1);
                    var _d = this.tkcd_item({
                        item: item,
                        ctx: ctx,
                        stackHeight: fullStackHeight,
                        y: a,
                        tkobj: tkobj,
                        bedcolor: bedcolor,
                        textcolor: textcolor,
                        region_idx: i,
                        tosvg: tosvg,
                    });
                    if (tosvg) svgdata = svgdata.concat(_d);
                    // bar
                    var score = Infinity;
                    var thiscolor = bedcolorlst;
                    if (item.scorelst && tkobj.showscoreidx != undefined && tkobj.showscoreidx != -1) {
                        score = item.scorelst[tkobj.showscoreidx];
                    }
                    _d = this.barplot_uniform({
                        score: score,
                        ctx: ctx,
                        colors: {
                            p: 'rgba(' + thiscolor + ',.6)',
                            n: 'rgba(' + thiscolor + ',.6)',
                        },
                        tk: tkobj,
                        rid: i,
                        y: densitydecorpaddingtop,
                        h: tkobj.qtc.height,
                        pointup: true,
                        tosvg: tosvg,
                        start: Math.max(r[3], item.start),
                        stop: Math.min(r[4], item.stop)
                    });
                    if (tosvg) svgdata = svgdata.concat(_d);
                }
            }
            if (!viewrangeblank && (this.splinterTag || !this.hmheaderdiv)) {
                // scale
                var d = plot_ruler({
                    ctx: ctx,
                    stop: densitydecorpaddingtop,
                    start: y0 - 2,
                    xoffset: this.hmSpan - this.move.styleLeft - 10,
                    horizontal: false,
                    color: colorCentral.foreground,
                    min: colorscore_min,
                    max: colorscore_max,
                    extremeonly: true,
                    max_offset: -4,
                    tosvg: tosvg,
                    scrollable: true, // because scale is on tk canvas, its position subject to adjustment
                });
                if (tosvg) svgdata = svgdata.concat(d);
            }
        } else if (tkobj.ft == FT_weaver_c && tkobj.weaver.mode == W_rough) {
            // stitched hsp
            /* rank stitch by combined length:
             sum of target length of all hsp pieces
             entire span of query
             */
            var srank = [];
            for (var i = 0; i < tkobj.weaver.stitch.length; i++) {
                var a = tkobj.weaver.stitch[i];
                var c = 0;
                for (var j = 0; j < a.lst.length; j++) {
                    c += a.lst[j].targetstop - a.lst[j].targetstart;
                }
                srank.push([c, i, c + a.stop - a.start]);
            }
            srank.sort(function (m, n) {
                return n[2] - m[2];
            });
            var xspacer = 5;
            var blob = [];
            // go over all stitches
            for (var i = 0; i < srank.length; i++) {
                var stp = tkobj.weaver.stitch[srank[i][1]];
                var targetx1 = 9999, targetx2 = 0;
                for (var j = 0; j < stp.lst.length; j++) {
                    targetx1 = Math.min(targetx1, stp.lst[j].t1);
                    targetx2 = Math.max(targetx2, stp.lst[j].t2);
                }
                var stpw = (stp.stop - stp.start) / this.entire.summarySize; // stitch width on canvas
                // ideal stitch position
                stp.canvasstart = (targetx1 + targetx2) / 2 - stpw / 2;
                stp.canvasstop = Math.min(stp.canvasstart + stpw, this.entire.spnum);

                // 1: horizontal shift to fit unbalanced hsp distribution on target
                var mc = srank[i][0]; // mid target coord (adding up)
                var x0 = stp.t1, x9 = stp.t2;
                if (stpw > x9 - x0) {
                    // stitch on screen width wider than target, no shifting
                } else {
                    mc /= 2;
                    var midx0 = (x9 + x0) / 2;
                    // find middle point of all hsp on canvas
                    var add = 0;
                    var midx = -1;
                    for (j = 0; j < stp.lst.length; j++) {
                        var h = stp.lst[j];
                        if (mc >= add && mc <= add + h.targetstop - h.targetstart) {
                            midx = this.cumoffset(h.targetrid, h.targetstart + mc - add);
                            break;
                        }
                        add += h.targetstop - h.targetstart;
                    }
                    if (midx > midx0) {
                        // shift to right
                        stp.canvasstop = Math.min(x9, stp.canvasstop + midx - midx0);
                        stp.canvasstart = stp.canvasstop - stpw;
                    } else {
                        stp.canvasstart = Math.max(x0, stp.canvasstart - (midx0 - midx));
                        stp.canvasstop = stp.canvasstart + stpw;
                    }
                }

                // 2: find a slot to put this one and look through previously placed stitches
                var nohit = true;
                for (var j = 0; j < blob.length; j++) {
                    if (Math.max(blob[j][0], stp.canvasstart) < Math.min(blob[j][1], stp.canvasstop)) {
                        // hit one
                        nohit = false;
                        if (stp.canvasstart + stp.canvasstop < blob[j][0] + blob[j][1]) {
                            // new one is towards blob's left
                            if (blob[j][0] < stpw + xspacer - this.move.styleLeft) {
                                // no space on left
                                stitchblob_insertright(blob, j, stp, stpw, xspacer);
                            } else {
                                var succ = stitchblob_insertleft(blob, j, stp, stpw, xspacer);
                                if (!succ) {
                                    stitchblob_insertright(blob, j, stp, stpw, xspacer);
                                }
                            }
                        } else {
                            stitchblob_insertright(blob, j, stp, stpw, xspacer);
                        }
                    }
                }
                if (nohit) {
                    // no hit to blob
                    stitchblob_new(blob, stp);
                }
            }

            /* try to fit the last stitch all inside view range
             so that a flipped query region with items on its tail can be seen joining with the previous query region
             (as of fusion gene)
             if(tkobj.weaver.stitch.length>0) {
             var stch=tkobj.weaver.stitch[tkobj.weaver.stitch.length-1];
             if(stch.canvasstart<this.hmSpan-this.move.styleLeft) {
             stch.canvasstop=Math.min(stch.canvasstop,this.entire.spnum);
             }
             }
             */

            // shrink and shift if any stitch is outside viewrange
            var outvr = false;
            for (var i = 0; i < tkobj.weaver.stitch.length; i++) {
                var a = tkobj.weaver.stitch[i];
                if (a.canvasstart < -this.move.styleLeft || a.canvasstop > this.hmSpan - this.move.styleLeft) {
                    outvr = true;
                    break;
                }
            }
            if (outvr) {
                var minx = 9999, maxx = 0; // min/max x pos of all stitches
            }

            var stitchbarh = 10;
            var y2 = tc.height - 11;

            // rank stitch again by xpos
            srank = [];
            for (var i = 0; i < tkobj.weaver.stitch.length; i++) {
                srank.push([tkobj.weaver.stitch[i].canvasstart, i]);
            }
            srank.sort(function (m, n) {
                return m[0] - n[0];
            });
            var newlst = [];
            for (var i = 0; i < srank.length; i++) {
                newlst.push(tkobj.weaver.stitch[srank[i][1]]);
            }
            tkobj.weaver.stitch = newlst;

            for (var i = 0; i < tkobj.weaver.stitch.length; i++) {
                var stp = tkobj.weaver.stitch[i];
                viewrangeblank = false;
                ctx.clearRect(stp.canvasstart - xspacer, y2, stp.canvasstart + 300, 20);
                // query bar
                var clst = colorstr2int(tkobj.qtc.bedcolor);
                ctx.fillStyle = lightencolor(clst, .8);
                var a = stp.canvasstop - stp.canvasstart;
                ctx.fillRect(stp.canvasstart, y2, a, stitchbarh);
                if (tosvg) svgdata.push({
                    type: svgt_rect,
                    x: stp.canvasstart,
                    y: y2,
                    w: a,
                    h: stitchbarh,
                    fill: ctx.fillStyle
                });
                // query coord
                var a = stp.chr + ':' + stp.start + '-' + stp.stop + ', ' + bp2neatstr(stp.stop - stp.start);
                var w = ctx.measureText(a).width;
                ctx.fillStyle = tkobj.qtc.bedcolor;
                var b = Math.max(stp.canvasstart, (stp.canvasstart + stp.canvasstop - w) / 2);
                ctx.fillText(a, b, tc.height - 1);
                if (w < stp.canvasstop - stp.canvasstart) {
                    if (tosvg) svgdata.push({type: svgt_text, x: b, y: tc.height - 1, text: a, color: ctx.fillStyle});
                }
                // hsps
                var sf = (stp.canvasstop - stp.canvasstart) / (stp.stop - stp.start); // px / bp on stitch
                for (var j = 0; j < stp.lst.length; j++) {
                    var y3 = y2 - 1;
                    var hsp = stp.lst[j];
                    var t1 = hsp.t1;
                    var t2 = hsp.t2;
                    var q1 = stp.canvasstart + sf * ((hsp.strand == '+' ? hsp.querystart : hsp.querystop) - stp.start);
                    var q2 = stp.canvasstart + sf * ((hsp.strand == '+' ? hsp.querystop : hsp.querystart) - stp.start);
                    hsp.q1 = q1;
                    hsp.q2 = q2;

                    ctx.fillStyle = weavertkcolor_target;
                    ctx.fillRect(t1, yoffset, Math.max(1, t2 - t1), 1);
                    if (tosvg) svgdata.push({
                        type: svgt_line,
                        x1: t1,
                        y1: yoffset + .5,
                        x2: t2,
                        y2: yoffset + .5,
                        w: 1,
                        color: ctx.fillStyle
                    });
                    ctx.fillStyle = tkobj.qtc.bedcolor;
                    if (hsp.strand == '+') {
                        ctx.fillRect(q1, y3, Math.max(1, q2 - q1), 1);
                    } else {
                        ctx.fillRect(q2, y3, Math.max(1, q1 - q2), 1);
                    }
                    if (tosvg) svgdata.push({
                        type: svgt_line,
                        x1: q1,
                        y1: y3 - .5,
                        x2: q2,
                        y2: y3 - .5,
                        w: 1,
                        color: ctx.fillStyle
                    });
                    // thinner the band, darker the color
                    var op = 0.3;
                    if (t2 - t1 < 1) {
                        op = 0.5;
                    } else if (t2 - t1 < 5) {
                        op = 0.3 + (5 - t2 + t1) * 0.2 / 5;
                    }
                    ctx.fillStyle = 'rgba(' + clst + ',' + op.toFixed(2) + ')';
                    ctx.beginPath();
                    ctx.moveTo(t1, yoffset + 1);
                    ctx.lineTo(t2 - t1 < 1 ? t1 + 1 : t2, yoffset + 1);
                    ctx.lineTo(Math.abs(q2 - q1) < 1 ? q1 + 1 : q2, y3);
                    ctx.lineTo(q1, y3);
                    ctx.closePath();
                    ctx.fill();
                    if (tosvg) svgdata.push({
                        type: svgt_polygon,
                        points: [[t1, yoffset + 1], [t2, yoffset + 1], [q2, y3], [q1, y3]],
                        fill: ctx.fillStyle
                    });
                }
            }
            this.weaver_stitch2cotton(tkobj);
        } else {
            /** stack **/
            if (tkobj.ft == FT_weaver_c) {
                if (tkobj.weaver.mode != W_fine) fatalError('weavertk supposed to be in fine mode');
                this.weaver_hsp2cotton(tkobj);
            }
            var bedcolor, textcolor, bedcolorlst, textcolorlst,
                fcolor, rcolor, mcolor;
            if (isSam) {
                fcolor = tkobj.qtc.forwardcolor;
                rcolor = tkobj.qtc.reversecolor;
                mcolor = tkobj.qtc.mismatchcolor;
            } else if (isChiapet) {
                // include lr and ld
                textcolor = tkobj.qtc.textcolor;
                textcolorlst = colorstr2int(textcolor).join(',');
                // cannot use bedcolor as it use different color for +/- score
            } else {
                bedcolor = tkobj.qtc.bedcolor;
                textcolor = tkobj.qtc.textcolor;
                bedcolorlst = colorstr2int(bedcolor).join(',');
                if (!textcolor) {
                    // not given in weavertk
                    textcolor = colorCentral.foreground;
                }
                textcolorlst = colorstr2int(textcolor).join(',');
            }
            var hspdiststrx = 0; // for weaver fine hsp
            for (i = startRidx; i <= stopRidx; i++) {
                var r = this.regionLst[i];
                if (Data[i] == undefined) {
                    continue;
                }
                var regionstart = r[3];
                var regionstop = r[4];
                for (var j = 0; j < Data[i].length; j++) {
                    if (Data[i][j].stack == undefined) {
                        continue;
                    }
                    var item = Data[i][j];
                    if (Math.max(item.boxstart, canvasstart) < Math.min(item.boxstart + item.boxwidth, canvasstop)) {
                        viewrangeblank = false;
                    }
                    // plotting will be curbed by start/stop of both item and region
                    var curbstart = Math.max(regionstart, item.start);
                    var curbstop = Math.min(regionstop, item.stop);

                    var y = yoffset + item.stack * ( stackHeight + 1 );

                    if (tkobj.ft == FT_weaver_c) {
                        // fine hsp
                        var _d = this.tkcd_item({
                            item: item,
                            ctx: ctx,
                            y: y + 1 + weavertkpad,
                            tkobj: tkobj,
                            region_idx: i,
                            tosvg: tosvg,
                        });
                        if (tosvg) svgdata = svgdata.concat(_d);
                        var phs = null; // previous hsp
                        if (j > 0) {
                            phs = Data[i][j - 1].hsp;
                        } else if (i > 0) {
                            var bi = i - 1;
                            while (bi >= 0) {
                                if (Data[bi].length > 0) {
                                    phs = Data[bi][Data[bi].length - 1];
                                    break;
                                }
                                bi--;
                            }
                        }
                        if (!phs) continue;
                        // target dist
                        var s = bp2neatstr(item.hsp.targetstart - phs.targetstop);
                        var w = ctx.measureText(s).width;
                        var cspace = item.hsp.canvasstart - phs.canvasstop;
                        if (w + 6 < cspace) {
                            ctx.fillStyle = weavertkcolor_target;
                            var x = (item.hsp.canvasstart + phs.canvasstop - w) / 2,
                                y2 = y + weavertkpad + 10;
                            ctx.fillText(s, x, y2);
                            if (tosvg) svgdata.push({type: svgt_text, x: x, y: y2, text: s, color: ctx.fillStyle});
                        }
                        // query dist
                        ctx.fillStyle = tkobj.qtc.bedcolor;
                        var s;
                        if (phs.querychr == item.hsp.querychr) {
                            if (Math.max(phs.querystart, item.hsp.querystart) < Math.min(phs.querystop, item.hsp.querystop)) {
                                s = 'overlap';
                            } else {
                                var dist = phs.querystop == item.hsp.querystart ? 0 :
                                    (phs.querystop < item.hsp.querystart ?
                                        (item.hsp.querystart - phs.querystop) :
                                        (phs.querystart - item.hsp.querystop));
                                s = bp2neatstr(dist);
                            }
                        } else {
                            s = 'not connected';
                        }
                        var w = ctx.measureText(s).width;
                        var y2 = y + weavertkpad + (item.stack + 1) * tkobj.qtc.stackheight;
                        var x = (item.hsp.canvasstart + phs.canvasstop - w) / 2;
                        if (w + 6 < cspace) {
                            ctx.fillText(s, x, y2);
                            if (tosvg) svgdata.push({type: svgt_text, x: x, y: y2, text: s, color: ctx.fillStyle});
                        } else {
                            // underneath
                            ctx.strokeStyle = tkobj.qtc.bedcolor;
                            ctx.beginPath();
                            var b = y2 + weavertk_hspdist_strpad;
                            if (x - 10 > hspdiststrx) {
                                var a = phs.canvasstop;
                                ctx.moveTo(a, y2);
                                ctx.lineTo(a - 3, b);
                                if (tosvg) svgdata.push({
                                    type: svgt_line,
                                    x1: a,
                                    y1: y2,
                                    x2: a - 3,
                                    y2: b,
                                    w: 1,
                                    color: ctx.strokeStyle
                                });
                                a = item.hsp.canvasstart;
                                ctx.moveTo(a, y2);
                                ctx.lineTo(a + 3, y2 + weavertk_hspdist_strpad);
                                ctx.stroke();
                                if (tosvg) svgdata.push({
                                    type: svgt_line,
                                    x1: a,
                                    y1: y2,
                                    x2: a + 3,
                                    y2: b,
                                    w: 1,
                                    color: ctx.strokeStyle
                                });
                            } else {
                                x = hspdiststrx + 10;
                                var x2 = (phs.canvasstop + item.hsp.canvasstart) / 2;
                                ctx.moveTo(x2, y2);
                                ctx.lineTo(x + w / 2, b);
                                ctx.stroke();
                                if (tosvg) svgdata.push({
                                    type: svgt_line,
                                    x1: x2,
                                    y1: y2,
                                    x2: x + w / 2,
                                    y2: b,
                                    w: 1,
                                    color: ctx.strokeStyle
                                });
                            }
                            hspdiststrx = x + w + 3;
                            var y3 = y2 + weavertk_hspdist_strpad + weavertk_hspdist_strh;
                            ctx.fillText(s, x, y3);
                            if (tosvg) svgdata.push({type: svgt_text, x: x, y: y3, text: s, color: ctx.fillStyle});
                        }
                        continue;
                    }

                    if (isSam) {
                        /**************
                         bam read
                         **************/
                        if (item.hasmate) {
                            /** paired read **/
                            var rd1 = item.struct.L;
                            var rd2 = item.struct.R;
                            var _s = this.plotSamread(ctx,
                                rd1.rid,
                                rd1.start,
                                rd1.bam,
                                y,
                                stackHeight,
                                rd1.strand == '>' ? fcolor : rcolor,
                                mcolor,
                                tosvg);
                            if (tosvg) svgdata = svgdata.concat(_s);
                            var _s = this.plotSamread(ctx,
                                rd2.rid,
                                rd2.start,
                                rd2.bam,
                                y,
                                stackHeight,
                                rd2.strand == '>' ? fcolor : rcolor,
                                mcolor,
                                tosvg);
                            if (tosvg) svgdata = svgdata.concat(_s);

                            // line joining the pair
                            var linestart, linestop;
                            if (rd1.rid == rd2.rid) {
                                linestart = this.cumoffset(i, Math.min(rd1.stop, rd2.stop));
                                linestop = this.cumoffset(i, Math.max(rd1.start, rd2.start));
                            } else {
                                var fvd = (r[8] && r[8].item.hsp.strand == '-') ? false : true;
                                linestart = this.cumoffset(i, fvd ?
                                    Math.min(r[4], rd1.stop) : Math.max(r[3], rd1.start));
                                var r2 = this.regionLst[rd2.rid];
                                fvd = (r2[8] && r2[8].item.hsp.strand == '-') ? false : true;
                                linestop = this.cumoffset(rd2.rid, fvd ?
                                    Math.max(r2[3], rd2.start) : Math.min(r2[4], rd2.stop));
                            }
                            if (linestart >= 0 && linestop >= 0) {
                                var y2 = (isThin ? y : y + 4) + .5;
                                ctx.strokeStyle = colorCentral.foreground_faint_5;
                                ctx.lineWidth = 1;
                                ctx.moveTo(linestart, y2);
                                ctx.lineTo(linestop, y2);
                                ctx.stroke();
                                if (tosvg) svgdata.push({
                                    type: svgt_line,
                                    x1: linestart,
                                    y1: y2,
                                    x2: linestop,
                                    y2: y2,
                                    w: 1,
                                    color: ctx.fillStyle
                                });
                            }
                            continue;
                        }
                        /** single read **/
                        var _s = this.plotSamread(ctx,
                            i,
                            item.start,
                            item.bam,
                            y,
                            stackHeight,
                            item.strand == '>' ? fcolor : rcolor,
                            mcolor,
                            tosvg);
                        if (tosvg) svgdata = svgdata.concat(_s);
                        continue;
                    }

                    // figure out box/text color for this item
                    if (isChiapet) {
                        /* if has mate, .name is score
                         else, name is coord plus score, joined by comma
                         */
                        var thisscore = (item.struct) ? item.name : parseFloat(item.name.split(',')[1]);
                        bedcolor = (thisscore >= 0) ?
                        'rgba(' + tkobj.qtc.pr + ',' + tkobj.qtc.pg + ',' + tkobj.qtc.pb + ',' + Math.min(1, thisscore / pcolorscore) + ')' :
                        'rgba(' + tkobj.qtc.nr + ',' + tkobj.qtc.ng + ',' + tkobj.qtc.nb + ',' + Math.min(1, thisscore / ncolorscore) + ')';
                        textcolor = (thisscore >= 0) ?
                        'rgba(' + textcolorlst + ',' + Math.min(1, thisscore / pcolorscore) + ')' :
                        'rgba(' + textcolorlst + ',' + Math.min(1, thisscore / ncolorscore) + ')';
                    } else {
                        if (item.category != undefined && tkobj.cateInfo && (item.category in tkobj.cateInfo)) {
                            textcolor = bedcolor = tkobj.cateInfo[item.category][1];
                            bedcolorlst = colorstr2int(bedcolor).join(',');
                            textcolorlst = colorstr2int(textcolor).join(',');
                        }
                        if (item.scorelst && tkobj.showscoreidx != undefined && tkobj.showscoreidx >= 0) {
                            // here it allows an item to be not having score data!
                            var _rv = tkobj.maxv - tkobj.minv;
                            var thisscore = item.scorelst[tkobj.showscoreidx];
                            textcolor = 'rgba(' + textcolorlst + ',' + Math.min(1, (thisscore - tkobj.minv) / _rv) + ')';
                            bedcolor = 'rgba(' + bedcolorlst + ',' + Math.min(1, (thisscore - tkobj.minv) / _rv) + ')';
                        }
//leepc12_hotfix for bed color strand
                        if (tkobj.ft == FT_bed_c) {
                            ctx.font = '0pt Sans-serif';
                            if (item.strand == '+' || item.strand == '>')
                                bedcolor = '#FF0000';//'#800000'; // maroon
                            if (item.strand == '-' || item.strand == '<')
                                bedcolor = '#0000FF';//'#0000A0'; // dark blue
                        }
//leepc12
                    }

                    if (isThin) {
                        /***  thin  TODO thin/full merge ***/
                        var _d = this.tkcd_box({
                            ctx: ctx,
                            rid: i,
                            start: item.start,
                            stop: item.stop,
                            viziblebox: true,
                            y: y,
                            h: stackHeight,
                            fill: bedcolor,
                            tosvg: tosvg,
                        });
                        if (tosvg) svgdata = svgdata.concat(_d);
                    } else {
                        /* full mode */
                        var _d = this.tkcd_item({
                            item: item,
                            ctx: ctx,
                            stackHeight: stackHeight,
                            y: y,
                            tkobj: tkobj,
                            bedcolor: bedcolor,
                            textcolor: textcolor,
                            isChiapet: isChiapet,
                            region_idx: i,
                            tosvg: tosvg,
                        });
                        if (tosvg) svgdata = svgdata.concat(_d);
                    }
                }
            }
            if (tkobj.ft == FT_weaver_c) {
                // done fiddling with hsp
                if (tkobj.weaver.mode != W_fine) fatalError('weavertk supposed to be in fine mode');
                var cbj = this.weaver.q[tkobj.cotton];
                if (cbj.tklst.length > 0 || cbj.init_bbj_param) {
                    for (var a = 0; a < cbj.regionLst.length; a++) {
                        var b = cbj.regionLst[a];
                        b[8].canvasxoffset = b[8].item.hsp.canvasstart;
                    }
                    this.weaver_cotton_spin(cbj);
                }
            }
        }
        if (viewrangeblank) {
            ctx.fillStyle = colorCentral.foreground_faint_5;
            var s = tkobj.label + ' - NO DATA IN VIEW RANGE';
            var w = ctx.measureText(s).width;
            ctx.fillText(s, (this.hmSpan - w) / 2 - this.move.styleLeft, tc.height / 2 + 5);
        } else if (tkobj.ft == FT_ld_c || tkobj.ft == FT_ld_n) {
            // plot snps from the LD track
            yoffset = old_yoffset;
            ctx.strokeStyle = colorCentral.foreground;
            ctx.beginPath();
            var a = yoffset + tkobj.ld.ticksize + .5;
            ctx.moveTo(0, a);
            ctx.lineTo(tc.width, a);
            if (tosvg) svgdata.push({type: svgt_line, x1: 0, y1: a, x2: tc.width, y2: a, color: ctx.strokeStyle});
            for (var n in tkobj.ld.hash) {
                var rs = tkobj.ld.hash[n];
                var a = rs.topx,
                    b = yoffset,
                    c = yoffset + tkobj.ld.ticksize,
                    d = rs.bottomx,
                    e = yoffset + tkobj.ld.ticksize + tkobj.ld.topheight;
                // tick
                ctx.moveTo(a, b);
                ctx.lineTo(a, c);
                if (tosvg) svgdata.push({type: svgt_line, x1: a, y1: b, x2: a, y2: c, color: ctx.strokeStyle});
                // link
                ctx.lineTo(d, e);
                if (tosvg) svgdata.push({type: svgt_line, x1: a, y1: c, x2: d, y2: e, color: ctx.strokeStyle});
            }
            ctx.stroke();
        }

        /* always redraw .atC
         as the .atC height must be same as .canvas and it would be shown in ghm */
        this.drawMcm_onetrack(tkobj);

        if (tkobj.ft == FT_ld_c || tkobj.ft == FT_ld_n) {
            this.regionLst = this.decoy_dsp.bak_regionLst;
            this.dspBoundary = this.decoy_dsp.bak_dspBoundary;
        }
    }

// horizontal line
    if (tkobj.horizontallines &&
        (isNumerical(tkobj) || tkobj.ft == FT_matplot || tkobj.ft == FT_cm_c) &&
        tkobj.qtc.height >= 20 &&
        (tkobj.maxv != undefined && tkobj.minv != undefined)) {
        for (var i = 0; i < tkobj.horizontallines.length; i++) {
            var v = tkobj.horizontallines[i];
            if (v.value > tkobj.minv && v.value < tkobj.maxv) {
                var y = parseInt(densitydecorpaddingtop + tkobj.qtc.height * (tkobj.maxv - v.value) / (tkobj.maxv - tkobj.minv));
                ctx.fillStyle = v.color;
                ctx.fillRect(0, y, tc.width, 1);
                if (tosvg) svgdata.push({
                    type: svgt_line,
                    x1: 0,
                    y1: y,
                    x2: tc.width,
                    y2: y,
                    w: 1,
                    color: ctx.fillStyle
                });
                v._y = y;
            }
        }
    }

    this.drawTrack_header(tkobj);

    if (this.trunk) {
        // is splinter
        this.trunk.synctkh_padding(tkobj.name);
    } else {
        // is trunk
        for (var tag in this.splinters) {
            var b = this.splinters[tag];
            var o = b.findTrack(tkobj.name);
            if (o) {
                o.canvas.width = o.canvas.width;
                b.drawTrack_browser(o, false);
            } else {
                /* in case of splinting, unfinished chip is inserted into trunk.splinters
                 and resizing trunk will re-draw all tracks in trunk
                 but the splinter tracks are not ready
                 */
            }
        }
        this.synctkh_padding(tkobj.name);
    }
// highlight region
    if (!this.is_gsv()) {
        for (var i = 0; i < this.highlight_regions.length; i++) {
            var pos = this.region2showpos(this.highlight_regions[i]);
            if (!pos) continue;
            var hc = colorstr2int(colorCentral.hl);
            for (var j = 0; j < pos.length; j++) {
                var w = pos[j][1];
                if (!w || w > this.hmSpan * .75) continue;
                ctx.fillStyle = 'rgba(' + hc[0] + ',' + hc[1] + ',' + hc[2] + ',' + 0.5 * (1 - w / (this.hmSpan * .75)) + ')';
                ctx.fillRect(pos[j][0], 0, Math.max(2, w), tc.height);
            }
        }
    }

    return svgdata;
};


Browser.prototype.drawTrack_altregiondecor = function (ctx, height, tosvg) {
    if (this.juxtaposition.type == this.genome.defaultStuff.runmode) return [];
    var svgdata = [];
    for (var i = 0; i < this.regionLst.length; i++) {
        var x1 = this.cumoffset(i, this.regionLst[i][3]),
            x2 = this.cumoffset(i, this.regionLst[i][4]);
        if (i % 2) {
            ctx.fillStyle = colorCentral.background_faint_5;
            ctx.fillRect(x1, 0, x2 - x1, height);
        }
        ctx.fillStyle = regionSpacing.color;
        ctx.fillRect(x2, 0, 1, height);
        if (tosvg) svgdata.push({type: svgt_line, x1: x2, y1: 0, x2: x2, y2: height, w: 1, color: ctx.fillStyle});
    }
    return svgdata;
};


Browser.prototype.stack_track = function (tkobj, yoffset) {
    var ft = tkobj.ft;
    if (tkishidden(tkobj) || isNumerical(tkobj) || ft == FT_cat_n || ft == FT_cat_c || ft == FT_cm_c ||
        ft == FT_matplot || ft == FT_catmat) return;

    if (tkobj.ft == FT_ld_c || tkobj.ft == FT_ld_n) {
        if (tkobj.ld.data.length == 0) return;
    } else {
        if (tkobj.data.length == 0) return;
    }

    if (this.targetBypassQuerytk(tkobj)) return;

    var canvas = tkobj.canvas; // will also set canvas height
    canvas.width = this.entire.spnum;
    var ctx = canvas.getContext('2d');


    /* list of regions to be used for data processing:
     ldtk - view range only!
     rest - lw to rw
     */
    var startRidx, stopRidx,
        startViewCoord, stopViewCoord;

    if (ft == FT_ld_c || ft == FT_ld_n) {
        startRidx = this.dspBoundary.vstartr;
        stopRidx = this.dspBoundary.vstopr;
        startViewCoord = this.dspBoundary.vstartc;
        stopViewCoord = this.dspBoundary.vstopc;

        /* ld data preprocessing
         in case of multi-region (juxtaposition or geneset)
         synthetic lr items would not be in multiregions
         */
        tkobj.ld.hash = {}; // key: snp rs, val: {rid:?, coord:?, topx:?, bottomx:? }
        // 
        /* rid/coord is real info
         topx/bottomx: plotting offset on the linkage graph
         */
        // 1. get all snps
        var count = 0; // total count of snp
        for (i = startRidx; i <= stopRidx; i++) {
            var r = this.regionLst[i];
            var startcoord = i == startRidx ? startViewCoord : r[3];
            var stopcoord = i == stopRidx ? stopViewCoord : r[4];
            for (var j = 0; j < tkobj.ld.data[i].length; j++) {
                var k = tkobj.ld.data[i][j];
                if (k.start < startcoord) continue;
                if (k.stop <= stopcoord) {
                    // valid pair
                    var x1 = this.cumoffset(i, k.start),
                        x2 = this.cumoffset(i, k.stop);
                    if (x1 >= 0 && x2 > x1) {
                        tkobj.ld.hash[k.rs1] = {rid: i, coord: k.start, topx: x1};
                        tkobj.ld.hash[k.rs2] = {rid: i, coord: k.stop, topx: x2};
                    }
                } else {
                    /* look through remaining regions
                     snp pairs that form ld are always on same chr, so no chr info is given for each snp
                     will only use coord to detect region
                     */
                    for (var m = i + 1; m <= stopRidx; m++) {
                        var r2 = this.regionLst[m];
                        if (r2[0] != r[0]) continue;
                        var startcoord2 = m == startRidx ? startViewCoord : r2[3];
                        var stopcoord2 = m == stopRidx ? stopViewCoord : r2[4];
                        if (k.stop >= startcoord2 && k.stop <= stopcoord2) {
                            // valid pair
                            var x1 = this.cumoffset(i, k.start),
                                x2 = this.cumoffset(m, k.stop);
                            if (x1 >= 0 && x2 > x1) {
                                tkobj.ld.hash[k.rs1] = {rid: i, coord: k.start, topx: x1};
                                tkobj.ld.hash[k.rs2] = {rid: m, coord: k.stop, topx: x2};
                            }
                            break;
                        }
                    }
                }
            }
        }
        // 2. count and sort snp
        var lst = [];
        for (var x in tkobj.ld.hash) {
            var k = tkobj.ld.hash[x];
            lst.push([k.rid, k.coord, x]);
        }
        // doesn't matter if lst is empty?
        lst.sort(snpSort);
        /* 3. assign bottom xpos in the link graph
         */
        var w = this.hmSpan / lst.length;
        for (var i = 0; i < lst.length; i++) {
            var rs = lst[i][2];
            tkobj.ld.hash[rs].bottomx = w * (i + .5) - this.move.styleLeft;
        }
        var chr = this.genome.scaffold.current[0];
        /* hypothetical region, scale is consistant with this.entire
         */
        var hy_r = [chr, 0, this.genome.scaffold.len[chr],
            0, // dstart
            -1, // dstop
            this.entire.spnum, // width, region stretches widest
            null,
            -1, // summary size
        ];
        if (this.entire.atbplevel) {
            hy_r[4] = (this.entire.spnum) / this.entire.bpwidth;
            // hy_r[7] not used
        } else {
            hy_r[7] = this.entire.summarySize;
            hy_r[4] = parseInt(this.entire.spnum * hy_r[7]);
        }

        this.decoy_dsp = {
            regionLst: [hy_r],
            dspBoundary: {vstartr: 0, vstarts: this.hmSpan, vstopr: 0, vstops: this.hmSpan * 2},
            bak_regionLst: this.regionLst,
            bak_dspBoundary: this.dspBoundary,
        };
        this.regionLst = this.decoy_dsp.regionLst;
        this.dspBoundary = this.decoy_dsp.dspBoundary;

        /* 4. make lr items that exist in the hypothetical region
         */
        // window bp length
        if (this.entire.atbplevel) {
            w /= this.entire.bpwidth;
        } else {
            w *= hy_r[7];
        }
        var _data = [];
        for (i = startRidx; i <= stopRidx; i++) {
            for (j = 0; j < tkobj.ld.data[i].length; j++) {
                var k = tkobj.ld.data[i][j];
                if ((k.rs1 in tkobj.ld.hash) && (k.rs2 in tkobj.ld.hash)) {
                    var a = tkobj.ld.hash[k.rs1].bottomx;
                    var b = tkobj.ld.hash[k.rs2].bottomx;
                    if (this.entire.atbplevel) {
                        a /= this.entire.bpwidth;
                        b /= this.entire.bpwidth;
                    } else {
                        a *= hy_r[7];
                        b *= hy_r[7];
                    }
                    _data.push({
                        id: k.id,
                        start: parseInt(a - w / 2),
                        stop: parseInt(a + w / 2),
                        name: chr + ':' + parseInt(b - w / 2) + '-' + parseInt(b + w / 2) + ',' + k.scorelst[tkobj.showscoreidx],
                        strand: '>',
                    });
                }
            }
        }
        tkobj.data = [_data];
        // all hypothetical!
        startRidx = stopRidx = 0;
        if (this.entire.atbplevel) {
            startViewCoord = (-this.move.styleLeft) / this.entire.bpwidth;
            stopViewCoord = (this.hmSpan - this.move.styleLeft) / this.entire.bpwidth;
        } else {
            startViewCoord = (-this.move.styleLeft) * hy_r[7];
            stopViewCoord = (this.hmSpan - this.move.styleLeft) * hy_r[7];
        }
        startViewCoord = hy_r[3];
        stopViewCoord = hy_r[4];
        ft = FT_lr_c; // ld is pretending to be lr track
    } else {
        // non-ld
        startRidx = this.dspBoundary.vstartr;
        startViewCoord = this.dspBoundary.vstartc;
        stopRidx = this.dspBoundary.vstopr;
        stopViewCoord = this.dspBoundary.vstopc;
    }

    var Data = []; // stack data of all tracks
    var Data2 = []; // only for arc or trihm

    var isChiapet = (ft == FT_lr_n || ft == FT_lr_c);
    var isSam = (ft == FT_sam_c || ft == FT_sam_n || ft == FT_bam_c || ft == FT_bam_n);
    var drawTriheatmap = tkobj.mode == M_trihm;
    var drawArc = tkobj.mode == M_arc;

    /* both for arc and triangular heatmap:
     if the on-canvas distance between two paired items is greater than hmSpan,
     it will make the canvas too high, and the two items won't both show up
     so limit it
     */

    if (isSam) {
        /* bam/sam read pre-processing
         read alignment stop is not provided, figure out from cigar
         item.start/stop is for stacking only
         item.bam.start/stop is actual alignment
         */
        for (var i = 0; i < startRidx; i++) {
            Data.push(tkobj.data[i]);
        }
        var pairedReads = {}; // key: read name, val: 1
        for (i = startRidx; i <= stopRidx; i++) {
            if (!tkobj.data[i] || tkobj.data[i].length == 0) {
                Data.push([]);
                continue;
            }
            /* adjust read start/stop coord by clipping
             */
            for (var j = 0; j < tkobj.data[i].length; j++) {
                var item = tkobj.data[i][j];
                if (item.existbeforepan) {
                    // when padding, existing data is ready and must escape recomputing
                    continue;
                }
                setBamreadcoord(item);
            }
            tkobj.data[i].sort(gfSort_coord);
            var newarray = [];
            for (j = 0; j < tkobj.data[i].length; j++) {
                var item = tkobj.data[i][j];
                var f = item.bam.flag;
                if (((f >> 2) & 1) == 1) {
                    // it is umapped?
                    continue;
                }
                if (item.hasmate) {
                    // already paired, perhaps before moving
                    newarray.push(item);
                    continue;
                }
                item.strand = (((f >> 4) & 1) == 1) ? '<' : '>';
                if (((f >> 0) & 1) == 1) {
                    // paired
                    if (item.id in pairedReads) continue;
                    if (((f >> 3) & 1) == 1) {
                        // mate is unmapped
                        item.bam.status = 'paired but mate is unmapped';
                    } else {
                        // mate is mapped
                        var mateRidx = -1, // mate region idx
                            mateDidx = -1; // mate data idx (in this region)
                        // search in same region i
                        for (var k = j + 1; k < tkobj.data[i].length; k++) {
                            if (tkobj.data[i][k].id == item.id) {
                                mateRidx = i;
                                mateDidx = k;
                                break;
                            }
                        }
                        if (mateRidx == -1) {
                            // mate is not found in this region, look through the remainder
                            for (var k = i + 1; k <= stopRidx; k++) {
                                if (mateRidx != -1) break;
                                for (var x = 0; x < tkobj.data[k].length; x++) {
                                    if (tkobj.data[k][x].id == item.id) {
                                        mateRidx = k;
                                        mateDidx = x;
                                        break;
                                    }
                                }
                            }
                        }
                        if (mateRidx == -1) {
                            item.bam.status = 'paired but mate is out of view range';
                        } else {
                            item.bam.status = 'paired';
                            item.hasmate = true;
                            pairedReads[item.id] = 1;
                            var mate = tkobj.data[mateRidx][mateDidx];
                            if (mateRidx != i) {
                                if (mateRidx < i) fatalError('mateRidx<i');
                                setBamreadcoord(mate);
                            }
                            var Li = i,
                                Ri = mateRidx,
                                L = item,
                                R = mate;
                            Ls = item.strand,
                                Rs = (((f >> 5) & 1) == 1) ? '<' : '>';
                            if (mateRidx == i && mate.start < item.start) {
                                // swap
                                L = mate;
                                R = item;
                                var tt = Rs;
                                Rs = Ls;
                                Ls = tt;
                            }
                            item.struct = {
                                L: {rid: Li, start: L.start, stop: L.stop, strand: Ls, bam: L.bam},
                                R: {rid: Ri, start: R.start, stop: R.stop, strand: Rs, bam: R.bam}
                            };
                        }
                    }
                } else {
                    // single
                    item.bam.status = 'single';
                }
                newarray.push(item);
            }
            Data.push(newarray);
        }
        for (i = stopRidx + 1; i < this.regionLst.length; i++) {
            Data.push(tkobj.data[i]);
        }
        tkobj.data = Data;
    } else if (isChiapet) {
        /* long-range data pre-processing...
         a new Data object will be made containing:
         - complete pairs in displayed region that are joined
         - singletons
         */
        Data = tkobj.data;
        var newdata = [];
        for (var i = 0; i < startRidx; i++) {
            newdata.push([]);
        }

        /* "item" means the from-item
         "mate" means the to-item
         */
        var usedItems = {}; // key: "mate chr start stop", val: "item chr start stop"

        /* sorting must be enabled, though expensive
         because during panning, new data is appended to the .data
         and it won't draw anything if not sorted...
         */
        for (i = startRidx; i <= stopRidx; i++) {
            Data[i].sort(gfSort_coord);
        }
        for (i = startRidx; i <= stopRidx; i++) {
            var itemchr = this.regionLst[i][0];
            newdata.push([]);
            for (var j = 0; j < Data[i].length; j++) {
                var item = Data[i][j];

                /* skip items outside the view and to the left */
                if (i == startRidx) {
                    if (item.stop <= startViewCoord) continue;
                }
                /* quit searching if outside the view and to the right */
                if (i == stopRidx) {
                    if (item.start >= stopViewCoord) break;
                }

                /* skip items with incorrect name */
                if (item.name.indexOf(',') == -1) continue;
                var tmp = item.name.split(',');

                /* skip item if it has already been paired */
                var tmp3 = itemchr + ':' + item.start + '-' + item.stop;
                if (tmp3 in usedItems && usedItems[tmp3] == tmp[0]) continue;

                var score = tmp[1];

                var tmp2 = this.genome.parseCoordinate(tmp[0], 2);
                if (!tmp2) continue;
                var matechr = tmp2[0];
                var matestart = tmp2[1];
                var matestop = tmp2[3];

                var mateRegionidx = -1;
                if (matechr == itemchr && matestop <= this.regionLst[i][3]) {
                    /* do nothing, item will be unpaired in this rare case
                     when running gsv, the item at left side will have its mate at
                     upstream outside of the region, such item shall be unpaired */
                } else {
                    var distoncanvas = 0; // curb by distance on canvas
                    for (var k = i; k <= stopRidx; k++) {
                        // for each region, see if mate fits in
                        if (distoncanvas >= this.hmSpan) break;
                        if (this.regionLst[k][0] == matechr) {
                            if (Math.max(this.regionLst[k][3], matestart) < Math.min(this.regionLst[k][4], matestop)) {
                                mateRegionidx = k;
                                usedItems[tmp[0]] = tmp3;
                                break;
                            }
                        }
                        // increment dist on canvas
                        if (k == i) {
                            distoncanvas += this.cumoffset(i, this.regionLst[i][4]) - this.cumoffset(i, item.stop);
                        } else {
                            distoncanvas += this.cumoffset(k, this.regionLst[k][4]) - this.cumoffset(k, this.regionLst[k][3]);
                        }
                    }
                }
                var newitem = {};
                if (mateRegionidx == -1) {
                    // mate not found for this item
                    if (!drawArc && !drawTriheatmap) {
                        // save singleton for stack mode, but not arc or triheamap
                        newitem.id = item.id;
                        newitem.start = item.start;
                        newitem.stop = item.stop;
                        newitem.name = item.name;
                        newitem.strand = item.strand;
                        newitem.hasmate = false;
                        newdata[i].push(newitem);
                    }
                } else {
                    var L, R;
                    if (i < mateRegionidx) {
                        // item and its mate in separate region
                        L = {rid: i, start: item.start, stop: item.stop};
                        R = {rid: mateRegionidx, start: matestart, stop: matestop};
                    } else {
                        // in same region
                        if (item.start > matestart) {
                            R = {rid: i, start: item.start, stop: item.stop};
                            L = {rid: i, start: matestart, stop: matestop};
                        } else {
                            L = {rid: i, start: item.start, stop: item.stop};
                            R = {rid: i, start: matestart, stop: matestop};
                        }
                    }
                    // i can never be bigger than mateRegionidx...
                    newitem.id = item.id;
                    newitem.start = L.start;
                    newitem.stop = R.stop;
                    newitem.name = parseFloat(score);
                    newitem.struct = {L: L, R: R};
                    newitem.hasmate = true;
                    newdata[i].push(newitem);
                }
            }
        }
        if (drawArc || drawTriheatmap) {
            Data2 = newdata;
        } else {
            Data2 = null;
            Data = newdata;
        }
        tkobj.data_chiapet = newdata; // attach for clicking on canvas
    } else {
        Data = tkobj.data;
        Data2 = null;
    }

    /* convert item coord into box start/width 
     only do for items within lws and rws
     those fit in will have valid .boxstart/boxwidth computed,
     else they will be left undefined
     serve as a way to quickly tell if to process this item later

     in case of paired read or long-range interaction,
     start coord will be start of query,
     stop coord will be stop of mate,
     must detect if query/mate are in *separate* regions
     */
    var longrangemaxspan = 0; // for both arcs and triheatmap, to determine/curb canvas height
    if (isSam) {
        /* sam reads, use Data
         */
        for (var i = startRidx; i <= stopRidx; i++) {
            if (!Data[i]) continue;
            var r = this.regionLst[i];
            var fvd = (r[8] && r[8].item.hsp.strand == '-') ? false : true;
            for (var j = 0; j < Data[i].length; j++) {
                var item = Data[i][j];
                item.stack = undefined; // by default
                if (item.hasmate) {
                    // two reads might be in *separate* regions
                    var materid = item.struct.R.rid;
                    if (materid == i) {
                        var a = Math.max(r[3], Math.min(item.struct.L.start, item.struct.R.start)),
                            b = Math.min(r[4], Math.max(item.struct.L.stop, item.struct.R.stop));
                        if (fvd) {
                            item.boxstart = this.cumoffset(i, a);
                            item.boxwidth = this.cumoffset(i, b) - item.boxstart;
                        } else {
                            item.boxstart = this.cumoffset(i, b);
                            item.boxwidth = this.cumoffset(i, a) - item.boxstart;
                        }
                    } else {
                        // materid is sure to be bigger than i
                        item.boxstart = this.cumoffset(i,
                            fvd ? Math.max(item.start, r[3]) : Math.min(item.stop, r[4]));
                        var r2 = this.regionLst[materid];
                        var fvd2 = (r2[8] && r2[8].item.hsp.strand == '-') ? false : true;
                        item.boxwidth = this.cumoffset(materid,
                            (fvd2 ? Math.min(item.struct.R.stop, r2[4]) :
                                Math.max(item.struct.R.start, r2[3]))
                        ) - item.boxstart;
                    }
                } else {
                    item.boxstart = this.cumoffset(i,
                        fvd ? Math.max(item.start, r[3]) : Math.min(item.stop, r[4]));
                    item.boxwidth = Math.max(1,
                        this.cumoffset(i, fvd ? Math.min(item.stop, r[4]) : Math.max(item.start, r[3]))
                        - item.boxstart);
                }
            }
        }
    } else if (drawArc || drawTriheatmap) {
        /* long-range data,
         do it for Data2, set longrangemaxspan here */
        for (var i = startRidx; i <= stopRidx; i++) {
            var r = this.regionLst[i];
            var rstart = r[3]; // region start coord
            var rstop = r[4]; // region stop coord
            for (var j = 0; j < Data2[i].length; j++) {
                var item = Data2[i][j];
                item.stack = undefined; // stack is not used in arc or trihm
                if (item.hasmate) {
                    /** item's mate might be in *separate* regions **/
                    item.boxstart = this.cumoffset(i, Math.max(item.start, r[3]));
                    var materid = item.struct.R.rid;
                    for (var k = i; k <= stopRidx; k++) {
                        var rr = this.regionLst[k];
                        if (k == materid) {
                            var istop = Math.min(item.stop, rr[4]);
                            item.boxwidth = this.cumoffset(k, Math.min(item.stop, rr[4])) - item.boxstart;
                            /* dirty filter, to restrict track height */
                            if (item.boxwidth > this.hmSpan) {
                                item.boxstart = item.boxwidth = undefined;
                            }
                            break;
                        }
                    }
                    // however, item stop coord might be beyond this region, so just skip it?
                    if (item.boxwidth != undefined) {
                        longrangemaxspan = Math.max(longrangemaxspan, item.boxwidth);
                    }
                } else {
                    /* unpaired item
                     TODO plot a mark on canvas
                     */
                    item.boxstart = item.boxwidth = undefined;
                }
            }
        }
    } else if (tkobj.ft == FT_weaver_c && tkobj.weaver.mode == W_rough) {
        // do not compute boxstart
        this.weaver_stitch(tkobj);
    } else {
        /* stack-style or barplot
         */
        for (var i = startRidx; i <= stopRidx; i++) {
            var r = this.regionLst[i];
            var fvd = (r[8] && r[8].item.hsp.strand == '-') ? false : true;
            for (var j = 0; j < Data[i].length; j++) {
                var item = Data[i][j];
                item.stack = undefined; // by default
                item.boxstart = this.cumoffset(i,
                    fvd ? Math.max(item.start, r[3]) : Math.min(item.stop, r[4]));
                if (isChiapet && item.hasmate) {
                    // assume start point must be in this region? check using item start
                    /** mate might be in *separate* regions **/
                    var materid = item.struct.R.rid;
                    var rr = this.regionLst[materid];
                    a = Math.min(item.stop, rr[4]);
                    // TODO fvd?
                    item.boxwidth = this.cumoffset(materid, Math.min(item.stop, rr[4])) - item.boxstart;
                } else {
                    item.boxwidth = Math.max(1, this.cumoffset(i,
                        (fvd ? Math.min(item.stop, r[4]) : Math.max(item.start, r[3])))
                    - item.boxstart);
                }
            }
        }
    }

// TODO tkobj.qtc.stackheight come on...
    var isThin = tkobj.mode == M_thin;
    var stackHeight = tkobj.qtc.stackheight ? tkobj.qtc.stackheight : (isThin ? thinStackHeight : fullStackHeight);

    var viewstart_px = -this.move.styleLeft;
    var viewstop_px = viewstart_px + this.hmSpan;
    var maxstack = 0;

    /* set track canvas height */
    if (drawArc || drawTriheatmap) {
        if (tkobj.ft == FT_ld_c || tkobj.ft == FT_ld_n) {
            canvas.height = parseInt(longrangemaxspan * Math.tan(Math.PI * tkobj.qtc.anglescale / 4) / 2) + 2 + yoffset + tkobj.ld.ticksize + tkobj.ld.topheight;
        } else if (drawArc && longrangemaxspan > 0) {
            canvas.height = Math.max(10, longrangemaxspan * ((1 / Math.SQRT2) - 0.5) + 2 + yoffset);
        } else if (drawTriheatmap && longrangemaxspan > 0) {
            canvas.height = Math.min(this.hmSpan / 2, parseInt(longrangemaxspan * Math.tan(Math.PI * tkobj.qtc.anglescale / 4) / 2) + 2 + yoffset);
        } else {
            canvas.height = 10;
        }
    } else if (tkobj.ft == FT_weaver_c && tkobj.weaver.mode == W_rough) {
        // rough weaver, no stacking
        canvas.height = tkobj.qtc.height + fullStackHeight;
        // may adjust to ..
    } else if (tkobj.mode == M_bar || tkobj.ft == FT_weaver_c) {
        /* duplicative
         barplot or weaver, do stacking only by item coord, but not boxstart/stop, and not including name
         */
        var stack = [], // coord
            stackcanvas = []; // on canvas x
        for (i = startRidx; i <= stopRidx; i++) {
            if (Data[i] == undefined) {
                continue;
            }
            var r = this.regionLst[i];
            var fvd = (r[8] && r[8].item.hsp.strand == '-') ? false : true;
            if (fvd) {
                Data[i].sort(gfSort_coord);
            } else {
                Data[i].sort(gfSort_coord_rev);
            }
            //var max_x=0;
            for (var j = 0; j < Data[i].length; j++) {
                var item = Data[i][j];
                if (item.boxstart == undefined || item.boxwidth == undefined) continue;
                item.namestart = undefined;
                var sid = 0;

                if (j > 0) {
                    if (fvd) {
                        while (stack[sid] > item.start) sid++;
                    } else {
                        while (stack[sid] < item.start) sid++;
                    }
                }
                if (stack[sid] == undefined) {
                    stack[sid] = stackcanvas[sid] = -1;
                }

                var _iN = item.name2 ? item.name2 : item.name;
                var ivr = Math.max(viewstart_px, item.boxstart) < Math.min(viewstop_px, item.boxstart + item.boxwidth);
                if (_iN && ivr) {
                    // only deals with name if box overlaps with view range
                    item.namewidth = ctx.measureText(_iN).width;
                    if (item.struct || item.namewidth >= item.boxwidth) {
                        // try to put name outside
                        if (item.namewidth <= item.boxstart - stackcanvas[sid] - 2) {
                            item.namestart = item.boxstart - item.namewidth - 1;
                        }
                    } else {
                        item.namestart = item.boxstart + (item.boxwidth - item.namewidth) / 2;
                    }
                }

                stack[sid] = item.stop;
                stackcanvas[sid] = item.boxstart + item.boxwidth;
                item.stack = sid;
                /* not used, to decide if an item overlaps with another
                 item.__overlap= item.start<max_x;
                 max_x=Math.max(max_x,item.stop);
                 */
                if (ivr && maxstack < sid) {
                    maxstack = sid;
                }
            }
            // must clear stack as coord will be different in another region
            stack = [-1];
        }
        if (tkobj.ft == FT_weaver_c) {
            canvas.height = (stackHeight + 1) * (maxstack + 1) + yoffset + weavertkpad * 2 +
            (tkobj.weaver.mode == W_fine ? weavertk_hspdist_strpad + weavertk_hspdist_strh : 0);
        } else {
            canvas.height = densitydecorpaddingtop + tkobj.qtc.height + 1 + (fullStackHeight + 1) * (maxstack + 1);
        }
    } else {
        /***
         tk stack

         in thin mode, allow items sit right next to each other in one stack
         in full mode:
         1px spacing between items in same stack
         determine whether to draw name
         if draw, decide namestart

         for each region between left/right wing:
         for each bed item:
         define stack start/width by full/thin, if item has name, name width, ...
         try stacking item
         if successfully stacked:
         set stack id
         else:
         left stack id unspecified
         don't cap number of items plotted in JS, that's capped in C
         TODO bam reads must be capped in C, so that excessive data won't be passed to client
         ***/
        /* to properly set canvas height,
         need to count max stack # within [dspBoundary.vstarts, dspBoundary.vstops]
         but need to know pixel position of .vstarts and .vstops
         */
        // need to set font here to measure text width
        if (tkobj.qtc) {
            ctx.font = (tkobj.qtc.fontbold ? 'bold' : '') + ' ' +
            (tkobj.qtc.fontsize ? tkobj.qtc.fontsize : '8pt') + ' ' +
            (tkobj.qtc.fontfamily ? tkobj.qtc.fontfamily : 'sans-serif');
        }
        var stack = [-1000];
        for (i = startRidx; i <= stopRidx; i++) {
            if (Data[i] == undefined) {
                continue;
            }
            /* to enable sorting using score, need to tell gfSort the score index being used
             do not risk of appending that to gflag, it won't guard against paralelle rendering
             need to append scoreidx to each item
             */
            if (tkobj.showscoreidx != undefined) {
                for (var j = 0; j < Data[i].length; j++) {
                    Data[i][j].__showscoreidx = tkobj.showscoreidx;
                }
            }
            Data[i].sort(gfSort);
            if (tkobj.showscoreidx != undefined) {
                for (var j = 0; j < Data[i].length; j++) {
                    delete Data[i][j].__showscoreidx;
                }
            }
            for (var j = 0; j < Data[i].length; j++) {
                var item = Data[i][j];
                if (item.boxstart == undefined) {
                    // filtered by score !
                    continue;
                }
                item.stack = undefined; // by default
                // make stack start/width for stacking
                var k = 0; // stack id iterator
                item.stackstart = item.boxstart;
                item.stackwidth = item.boxwidth;
                item.namestart = undefined;
                if (isThin) { // thin
                    while (stack[k] > item.stackstart) {
                        k++;
                        if (k == stack.length) stack.push(-1000);
                    }
                } else { // full
                    var _iN = item.name2 ? item.name2 : item.name;
                    if (_iN && (Math.max(0 - this.move.styleLeft, item.boxstart) < Math.min(this.hmSpan - this.move.styleLeft, item.boxstart + item.boxwidth))) {
                        // only deals with name if box overlaps with view range
                        item.namewidth = ctx.measureText(_iN).width;
                        if (item.struct || item.namewidth >= item.boxwidth) {
                            // try to put name outside
                            if (item.boxstart <= 0 - this.move.styleLeft) {
                                // left end out
                                if (item.boxstart + item.boxwidth + item.namewidth > this.hmSpan - this.move.styleLeft) {
                                    // name forced into box
                                    item.namestart = 10 - this.move.styleLeft;
                                } else {
                                    // name on the right
                                    item.namestart = item.boxstart + item.boxwidth + 1;
                                    item.stackwidth = item.boxwidth + item.namewidth + 1;
                                }
                            } else {
                                if (item.boxstart + this.move.styleLeft < item.namewidth) {
                                    // not enough space on left
                                    if (item.boxstart + item.boxwidth + item.namewidth > this.hmSpan - this.move.styleLeft) {
                                        // name forced into box
                                        item.namestart = item.boxstart + 10;
                                    } else {
                                        // on right
                                        item.namestart = item.boxstart + item.boxwidth + 1;
                                        item.stackwidth = item.boxwidth + item.namewidth + 1;
                                    }
                                } else {
                                    // on left
                                    item.namestart = item.boxstart - item.namewidth - 1;
                                    item.stackstart = item.namestart;
                                    item.stackwidth = item.boxwidth + item.namewidth + 1;
                                }
                            }
                        } else {
                            // name fits into box
                            item.stackstart = item.boxstart;
                            item.stackwidth = item.boxwidth;
                            item.namestart = item.boxstart + (item.boxwidth - item.namewidth) / 2;
                        }
                    }
                    // need items in same stack to have one pixel spacing,
                    while (stack[k] + 1 > item.stackstart) {
                        k++;
                        //if(k == stackNumberLimit) break;
                        // big negative value help process items with 0 or negative box start
                        if (k == stack.length) stack.push(-10000);
                    }
                }
                // this item is stacked
                stack[k] = item.stackstart + item.stackwidth + 1;
                item.stack = k;
                if ((Math.max(viewstart_px, item.boxstart) < Math.min(viewstop_px, item.boxstart + item.boxwidth)) && maxstack < k) {
                    maxstack = k;
                }
            }
        }
        canvas.height = Math.max(10, (stackHeight + 1) * (maxstack + 1) + yoffset);
    }
    if (tkobj.ft == FT_ld_c || tkobj.ft == FT_ld_n) {
        this.regionLst = this.decoy_dsp.bak_regionLst;
        this.dspBoundary = this.decoy_dsp.bak_dspBoundary;
    }
};


function setBamreadcoord(item) {
    var c = item.bam.cigar;
    item.stop = item.bam.start = item.bam.stop = item.start; // position of aligned portion
    if (c.length == 0) {
        item.stop = item.bam.stop = item.start + item.bam.seq.length;
    } else {
        if (c[0][0] == 'S') { // move start to left if soft clip on left
            item.start -= c[0][1];
        }
        // compute stop
        for (var k = 0; k < c.length; k++) {
            var op = c[k][0];
            var cl = c[k][1];
            item.stop += cl;
            if (op == 'M' || op == 'D' || op == 'N') {
                item.bam.stop += cl;
            }
        }
    }
}


Browser.prototype.region2showpos = function (c) {
// arg: ['chr',111,222], might hit at multiple locations!!
    if (typeof(c) == 'string') {
        var lst = this.genome.parseCoordinate(c, 2);
        if (!lst) {
            return null;
        }
        c = lst;
    } else if (c.length != 3) {
        print2console('region2showpos: wrong input', 2);
        return null;
    }
    var hits = [];
    for (var i = 0; i < this.regionLst.length; i++) {
        var r = this.regionLst[i];
        if (r[0] == c[0]) {
            var x = this.cumoffset(i, c[1]);
            if (x) {
                hits.push([x, this.bp2sw(i, Math.min(c[2], r[4]) - Math.max(c[1], r[3]))]);
            }
        }
    }
    if (hits.length == 0) return null;
    return hits;
};

Browser.prototype.drawRuler_browser = function (tosvg) {
    /* ruler bar above genome heatmap, height is fixed
     */
    if (!this.rulercanvas) return [];
    this.rulercanvas.width = this.entire.spnum;
    this.rulercanvas.height = 20;
    var ctx = this.rulercanvas.getContext('2d');
    var h = this.rulercanvas.height;

    if (this.highlight_regions.length > 0) {
        var cl = colorCentral.hl;
        for (var j = 0; j < this.highlight_regions.length; j++) {
            var lst = this.region2showpos(this.highlight_regions[j]);
            if (!lst) continue;
            for (var i = 0; i < lst.length; i++) {
                var p = lst[i];
                if (!p[1]) continue;
                ctx.fillStyle = cl;
                ctx.fillRect(p[0], 0, p[1], h - 1);
                // always make a mark
                var center = p[0] + p[1] / 2;
                ctx.beginPath();
                ctx.moveTo(center - 8, 0);
                ctx.lineTo(center + 8, 0);
                ctx.lineTo(center, h - 1);
                ctx.closePath();
                ctx.fill();
                ctx.fillStyle = cl;
                ctx.fillRect(p[0], h - 3, p[1], 2);
            }
        }
    }
    if (this.is_gsv()) {
        // only draw hollow boxes in one row
        ctx.fillStyle = colorCentral.foreground_faint_5;
        for (var i = 0; i < this.regionLst.length; i++) {
            var x = this.cumoffset(i, this.regionLst[i][4], true);
            ctx.fillRect(x, 0, 1, h);
        }
        return [];
    }
    var previousplotstop = 0;
    var svgdata = [];
    ctx.lineWidth = 1;
    var y = h - 3.5;
    ctx.strokeStyle = ctx.fillStyle = colorCentral.foreground_faint_5;
    ctx.beginPath();
    var pastx = 0;
    for (var i = 0; i < this.regionLst.length; i++) {
        var r = this.regionLst[i];
        // mark region boundary
        var x1 = parseInt(this.cumoffset(i, r[3])) + .5;
        var svgx = x1;
        ctx.moveTo(x1, y - 1.5);
        ctx.lineTo(x1, y + 1.5);
        if (tosvg) svgdata.push({type: svgt_line, x1: x1, y1: y - 1.5, x2: x1, y2: y + 1.5});
        ctx.moveTo(x1, y);
        var incarr = this.weaver_gotgap(i);
        if (incarr) {
            for (var j = 0; j < incarr.length; j++) {
                var x2 = this.cumoffset(i, incarr[j]);
                ctx.lineTo(x2, y);
                if (tosvg) svgdata.push({type: svgt_line, x1: svgx, y1: y, x2: x2, y2: y});
                var gw = this.bp2sw(i, this.weaver.insert[i][incarr[j]]);
                if (gw >= 1) {
                    // mark gap
                    var a = parseInt(x2) + .5;
                    ctx.moveTo(a, y - 4);
                    ctx.lineTo(a, y + 4);
                    if (tosvg) svgdata.push({type: svgt_line, x1: a, y1: y - 2, x2: a, y2: y + 2});
                    a = parseInt(x2 + gw) + .5;
                    ctx.moveTo(a, y - 4);
                    ctx.lineTo(a, y + 4);
                    if (tosvg) svgdata.push({type: svgt_line, x1: a, y1: y - 2, x2: a, y2: y + 2});
                }
                ctx.moveTo(x2 + gw, y);
                svgx = x2 + gw;
            }
        }
        var x2 = parseInt(this.cumoffset(i, r[4], true)) - .5;
        ctx.lineTo(x2, y);
        if (tosvg) svgdata.push({type: svgt_line, x1: svgx, y1: y, x2: x2, y2: y});
        ctx.moveTo(x2, y - 1.5);
        ctx.lineTo(x2, y + 1.5);
        if (tosvg) svgdata.push({type: svgt_line, x1: x2, y1: y - 1.5, x2: x2, y2: y + 1.5});

        // bp span within the on screen width of a region
        var bpspan = r[4] - r[3];
        var plotwidth = this.bp2sw(i, bpspan);
        var u = Math.pow(10, 10);
        while (u > bpspan / (plotwidth / 100)) {
            u /= 10;
        }
        for (var j = Math.ceil(r[3] / u); j <= Math.floor(r[4] / u); j++) {
            var v = u * j; // coord
            var x = this.cumoffset(i, v, true) + .5;
            var w = ctx.measureText(v).width;
            if (w / 2 + 10 <= x - pastx) {
                ctx.fillText(v, x - w / 2, 10);
                if (tosvg) svgdata.push({type: svgt_text, x: x - w / 2, y: 10, text: v});
                ctx.moveTo(parseInt(x) + .5, 12);
                ctx.lineTo(parseInt(x) + .5, h - 3);
                if (tosvg) svgdata.push({type: svgt_line, x1: x, y1: 12, x2: x, y2: h - 3});
                pastx = x + w / 2;
            } else {
                ctx.moveTo(parseInt(x) + .5, 14);
                ctx.lineTo(parseInt(x) + .5, h - 3);
                if (tosvg) svgdata.push({type: svgt_line, x1: x, y1: 15, x2: x, y2: h - 3});
            }
        }
    }
    ctx.stroke();
    if (tosvg) return svgdata;
};


Browser.prototype.synctkh_padding = function (tkname) {
// should be calling from trunk
    var tkobj = this.findTrack(tkname);
    var maxH = tkobj.canvas.height;
    for (var tag in this.splinters) {
        var b = this.splinters[tag];
        var o = b.findTrack(tkname);
        /* in case of splinting
         unfinished chip is inserted into trunk.splinters
         and resizing trunk will re-draw all tracks in trunk
         but the splinter tracks are not ready
         */
        if (o) {
            maxH = Math.max(o.canvas.height, maxH);
        }
    }
// apply padding to trunk track
    var _p = maxH - tkobj.canvas.height;
    tkobj.canvas.style.paddingBottom = _p;
    if (this.hmheaderdiv) {
        tkobj.header.style.paddingBottom = _p;
    }
    if (this.mcm) {
        tkobj.atC.style.paddingBottom = _p;
    }
    this.trackHeightChanged();
// apply to each splinter
    for (tag in this.splinters) {
        var b = this.splinters[tag];
        var o = b.findTrack(tkobj.name);
        if (o) {
            o.canvas.style.paddingBottom = maxH - o.canvas.height;
            b.trackHeightChanged();
        }
    }
};

function menu_update_track(updatecontext) {
    /* splinter tk no longer shares qtc with trunk tk
     all style changes are applied on trunk
     and must be copied to splinter, what a labor
     calling drawTrack_browser(trunk_tk) will automatically redraw splinter
     */
    var bbj = gflag.menu.bbj;
    switch (gflag.menu.context) {
        case 1:
        case 2:
            // always switch to trunk
            if (bbj.splinterTag) {
                bbj = bbj.trunk;
            }
            var _lst = bbj.tklstfrommenu();
            var A = false, // will re-issue ajax
                A_tklst = [];
            var groupScaleChange = []; // array idx is group idx, ele: {scale: min: max:}
            var takelog = false;
            for (var i = 0; i < _lst.length; i++) {
                // just in case it's splinter's tk
                var tk = bbj.findTrack(_lst[i].name);
                if (!tk || tk.mastertk) {
                    continue;
                }
                var tkreg = bbj.genome.getTkregistryobj(tk.name);
                if (!tkreg) {
                    print2console('registry object not found: ' + tk.label, 2);
                }
                // when changing y scale, need to tell if is numerical, apart from isNumerical also if using score
                var useScore = (tk.showscoreidx != undefined && tk.showscoreidx >= 0);
                var U = false, // re-rendering
                    M = false, // update config menu on tk
                    H = false; // tk height changed
                switch (updatecontext) {
                    case 1:
                        var c = menu.c50.color1.style.backgroundColor;
                        if (isNumerical(tk)) {
                            var x = colorstr2int(c);
                            tk.qtc.pr = x[0];
                            tk.qtc.pg = x[1];
                            tk.qtc.pb = x[2];
                            tkreg.qtc.pr = x[0];
                            tkreg.qtc.pg = x[1];
                            tkreg.qtc.pb = x[2];
                            for (var a in bbj.splinters) {
                                var tk2 = bbj.splinters[a].findTrack(tk.name);
                                if (!tk2) continue;
                                tk2.qtc.pr = x[0];
                                tk2.qtc.pg = x[1];
                                tk2.qtc.pb = x[2];
                            }
                            U = true;
                        }
                        break;
                    case 2:
                        var c = menu.c50.color2.style.backgroundColor;
                        if (isNumerical(tk)) {
                            var x = colorstr2int(c);
                            tk.qtc.nr = x[0];
                            tk.qtc.ng = x[1];
                            tk.qtc.nb = x[2];
                            tkreg.qtc.nr = x[0];
                            tkreg.qtc.ng = x[1];
                            tkreg.qtc.nb = x[2];
                            for (var a in bbj.splinters) {
                                var tk2 = bbj.splinters[a].findTrack(tk.name);
                                if (!tk2) continue;
                                tk2.qtc.nr = x[0];
                                tk2.qtc.ng = x[1];
                                tk2.qtc.nb = x[2];
                            }
                            U = true;
                        }
                        break;
                    case 3:
                        if (isNumerical(tk)) {
                            tk.qtc.pth = menu.c50.color1_1.style.backgroundColor;
                            tkreg.qtc.pth = tk.qtc.pth;
                            for (var a in bbj.splinters) {
                                var tk2 = bbj.splinters[a].findTrack(tk.name);
                                if (!tk2) continue;
                                tk2.qtc.pth = tk.qtc.pth;
                            }
                            U = true;
                        }
                        break;
                    case 4:
                        if (isNumerical(tk)) {
                            tk.qtc.nth = menu.c50.color2_1.style.backgroundColor;
                            tkreg.qtc.nth = tk.qtc.nth;
                            for (var a in bbj.splinters) {
                                var tk2 = bbj.splinters[a].findTrack(tk.name);
                                if (!tk2) continue;
                                tk2.qtc.nth = tk.qtc.nth;
                            }
                            U = true;
                        }
                        break;
                    case 5:
                        var v = parseInt(menu.c51.select.options[menu.c51.select.selectedIndex].value);
                        // should not be scale_fix
                        if (isNumerical(tk) || tk.ft == FT_matplot) {
                            tk.qtc.thtype = v;
                            tkreg.qtc.thtype = v;
                            if (v == scale_percentile) {
                                tk.qtc.thpercentile = parseInt(menu.c51.percentile.says.innerHTML);
                                tkreg.qtc.thpercentile = tk.qtc.thpercentile;
                            }
                            qtc_thresholdcolorcell(tk.qtc);
                            for (var a in bbj.splinters) {
                                var tk2 = bbj.splinters[a].findTrack(tk.name);
                                if (!tk2) continue;
                                tk2.qtc.thtype = v;
                                if (v == scale_percentile) {
                                    tk2.qtc.thpercentile = tk.qtc.thpercentile;
                                }
                            }
                            U = true;
                            if (tk.group != undefined) {
                                groupScaleChange[tk.group] = {scale: scale_auto};
                            }
                        } else if (useScore) {
                            // "Apply to all" spilling over
                            // no matter if auto or percentile, force to auto
                            tk.scorescalelst[tk.showscoreidx].type = scale_auto;
                            tkreg.scorescalelst[tk.showscoreidx].type = scale_auto;
                            for (var a in bbj.splinters) {
                                var tk2 = bbj.splinters[a].findTrack(tk.name);
                                if (!tk2) continue;
                                tk2.scorescalelst[tk.showscoreidx].type = scale_auto;
                            }
                            U = true;
                            if (tk.group != undefined) {
                                groupScaleChange[tk.group] = {scale: scale_auto};
                            }
                        }
                        break;
                    case 6:
                        if (isNumerical(tk) || tk.ft == FT_matplot) {
                            tk.qtc.thtype = scale_fix;
                            tk.qtc.thmin = parseFloat(menu.c51.fix.min.value);
                            tk.qtc.thmax = parseFloat(menu.c51.fix.max.value);
                            tkreg.qtc.thtype = tk.qtc.thtype;
                            tkreg.qtc.thmin = tk.qtc.thmin;
                            tkreg.qtc.thmax = tk.qtc.thmax;
                            qtc_thresholdcolorcell(tk.qtc);
                            for (var a in bbj.splinters) {
                                var tk2 = bbj.splinters[a].findTrack(tk.name);
                                if (!tk2) continue;
                                tk2.qtc.thtype = scale_fix;
                                tk2.qtc.thmin = tk.qtc.thmin;
                                tk2.qtc.thmax = tk.qtc.thmax;
                            }
                            U = true;
                            if (tk.group != undefined) {
                                groupScaleChange[tk.group] = {scale: scale_fix, min: tk.qtc.thmin, max: tk.qtc.thmax};
                            }
                        } else if (useScore) {
                            // "Apply to all" spilling over
                            var scale = tk.scorescalelst[tk.showscoreidx];
                            scale.type = scale_fix;
                            scale.min = parseFloat(menu.c51.fix.min.value);
                            scale.max = parseFloat(menu.c51.fix.max.value);
                            var s2 = tk.scorescalelst[tk.showscoreidx];
                            s2.type = scale_fix;
                            s2.min = scale.min;
                            s2.max = scale.max;
                            for (var a in bbj.splinters) {
                                var tk2 = bbj.splinters[a].findTrack(tk.name);
                                if (!tk2) continue;
                                s2 = tk2.scorescalelst[tk.showscoreidx];
                                s2.type = scale_fix;
                                s2.min = scale.min;
                                s2.max = scale.max;
                            }
                            U = true;
                            if (tk.group != undefined) {
                                groupScaleChange[tk.group] = {scale: scale_fix, min: scale.min, max: scale.max};
                            }
                        }
                        break;
                    case 7:
                        if (isNumerical(tk) || tk.ft == FT_matplot) {
                            tk.qtc.thtype = scale_percentile;
                            tk.qtc.thpercentile = parseInt(menu.c51.percentile.says.innerHTML);
                            tkreg.qtc.thtype = tk.qtc.thtype;
                            tkreg.qtc.thpercentile = tk.qtc.thpercentile;
                            qtc_thresholdcolorcell(tk.qtc);
                            for (var a in bbj.splinters) {
                                var tk2 = bbj.splinters[a].findTrack(tk.name);
                                if (!tk2) continue;
                                tk2.qtc.thtype = scale_percentile;
                                tk2.qtc.thpercentile = tk.qtc.thpercentile;
                            }
                            U = true;
                            if (tk.group != undefined) {
                                // but is forced to auto for group
                                groupScaleChange[tk.group] = {scale: scale_auto};
                            }
                        } else if (useScore) {
                            // "Apply to all" spilling over
                            tk.scorescalelst[tk.showscoreidx].type = scale_auto;
                            tkreg.scorescalelst[tk.showscoreidx].type = scale_auto;
                            for (var a in bbj.splinters) {
                                var tk2 = bbj.splinters[a].findTrack(tk.name);
                                if (!tk2) continue;
                                tk2.scorescalelst[tk.showscoreidx].type = scale_auto;
                            }
                            U = true;
                            if (tk.group != undefined) {
                                groupScaleChange[tk.group] = {scale: scale_auto};
                            }
                        }
                        break;
                    case 8:
                        var windowsize = parseInt(menu.c46.says.innerHTML);
                        if (isNumerical(tk)) {
                            if (menu.c46.checkbox.checked) {
                                // apply smoothing, no matter whether it is already smoothed or not
                                tk.qtc.smooth = windowsize;
                                tkreg.qtc.smooth = windowsize;
                                if (!tk.data_raw) {
                                    tk.data_raw = tk.data;
                                }
                                for (var a in bbj.splinters) {
                                    var tk2 = bbj.splinters[a].findTrack(tk.name);
                                    if (!tk2) continue;
                                    tk2.qtc.smooth = windowsize;
                                    if (!tk2.data_raw) {
                                        tk2.data_raw = tk2.data;
                                    }
                                }
                                U = true;
                            } else {
                                // remove smoothing effect
                                if (tk.qtc.smooth) {
                                    tk.qtc.smooth = undefined;
                                    tkreg.qtc.smooth = undefined;
                                    tk.data = tk.data_raw;
                                    delete tk.data_raw;
                                    for (var a in bbj.splinters) {
                                        var tk2 = bbj.splinters[a].findTrack(tk.name);
                                        if (!tk2) continue;
                                        tk2.qtc.smooth = undefined;
                                        tk2.data = tk2.data_raw;
                                        delete tk2.data_raw;
                                    }
                                    U = true;
                                }
                            }
                        } else if (tk.ft == FT_cm_c) {
                            var rdf = tk.cm.set.rd_f;
                            var rdr = tk.cm.set.rd_r;
                            if (!rdf) continue;
                            if (menu.c46.checkbox.checked) {
                                // apply for cmtk
                                rdf.qtc.smooth = windowsize;
                                var _reg = bbj.genome.getTkregistryobj(rdf.name);
                                if (!_reg) fatalError('regobj missing for forward read depth');
                                _reg.qtc.smooth = windowsize;
                                if (rdr) {
                                    rdr.qtc.smooth = windowsize;
                                    var _reg = bbj.genome.getTkregistryobj(rdr.name);
                                    if (!_reg) fatalError('regobj missing for reverse read depth');
                                    _reg.qtc.smooth = windowsize;
                                }
                                if (!rdf.data_raw) {
                                    rdf.data_raw = rdf.data;
                                    if (rdr) {
                                        rdr.data_raw = rdr.data;
                                    }
                                }
                                for (var a in bbj.splinters) {
                                    var tk2 = bbj.splinters[a].findTrack(tk.name);
                                    if (!tk2) continue;
                                    rdf = tk2.cm.set.rd_f;
                                    rdr = tk2.cm.set.rd_r;
                                    rdf.qtc.smooth = windowsize;
                                    if (rdr) {
                                        rdr.qtc.smooth = windowsize;
                                    }
                                    if (!rdf.data_raw) {
                                        rdf.data_raw = rdf.data;
                                        if (rdr) {
                                            rdr.data_raw = rdr.data;
                                        }
                                    }
                                }
                                U = true;
                            } else {
                                // cmtk cancel
                                if (!rdf.qtc.smooth) continue;
                                rdf.qtc.smooth = undefined;
                                rdf.data = rdf.data_raw;
                                delete rdf.data_raw;
                                var _reg = bbj.genome.getTkregistryobj(rdf.name);
                                if (!_reg) fatalError('regobj missing for forward read depth');
                                _reg.qtc.smooth = undefined;
                                if (rdr) {
                                    rdr.qtc.smooth = undefined;
                                    rdr.data = rdr.data_raw;
                                    delete rdr.data_raw;
                                    var _reg = bbj.genome.getTkregistryobj(rdr.name);
                                    if (!_reg) fatalError('regobj missing for reverse read depth');
                                    _reg.qtc.smooth = undefined;
                                }
                                for (var a in bbj.splinters) {
                                    var tk2 = bbj.splinters[a].findTrack(tk.name);
                                    if (!tk2) continue;
                                    rdf = tk2.cm.set.rd_f;
                                    rdr = tk2.cm.set.rd_r;
                                    rdf.qtc.smooth = undefined;
                                    rdf.data = rdf.data_raw;
                                    delete rdf.data_raw;
                                    if (rdr) {
                                        rdr.qtc.smooth = undefined;
                                        rdr.data = rdr.data_raw;
                                        delete rdr.data_raw;
                                    }
                                }
                                U = true;
                            }
                        } else if (tk.ft == FT_matplot) {
                            print2console('matplot smoothing not available yet', 2);
                        }
                        break;
                    case 9:
                        if (isNumerical(tk)) {
                            tk.qtc.logtype = parseInt(menu.c52.select.options[menu.c52.select.selectedIndex].value);
                            tkreg.qtc.logtype = tk.qtc.logtype;
                            for (var a in bbj.splinters) {
                                var tk2 = bbj.splinters[a].findTrack(tk.name);
                                if (!tk2) continue;
                                tk2.qtc.logtype = tk.qtc.logtype;
                            }
                            U = true;
                            takelog = true;
                        }
                        break;
                    case 10:
                        if (tk.qtc.bedcolor) {
                            tk.qtc.bedcolor = menu.bed.color.style.backgroundColor;
                            if (!tkreg.qtc) tkreg.qtc = {};
                            tkreg.qtc.bedcolor = tk.qtc.bedcolor;
                            for (var a in bbj.splinters) {
                                var tk2 = bbj.splinters[a].findTrack(tk.name);
                                if (!tk2) continue;
                                tk2.qtc.bedcolor = tk.qtc.bedcolor;
                            }
                            U = true;
                        }
                        break;
                    case 11:
                        if (tk.qtc.textcolor) {
                            tk.qtc.textcolor = menu.font.color.style.backgroundColor;
                            if (!tkreg.qtc) tkreg.qtc = {};
                            tkreg.qtc.textcolor = tk.qtc.textcolor;
                            for (var a in bbj.splinters) {
                                var tk2 = bbj.splinters[a].findTrack(tk.name);
                                if (!tk2) continue;
                                tk2.qtc.textcolor = tk.qtc.textcolor;
                            }
                            U = true;
                        }
                        break;
                    case 12:
                        if (tk.qtc.fontfamily) {
                            var s = menu.font.family;
                            tk.qtc.fontfamily = s.options[s.selectedIndex].value;
                            if (!tkreg.qtc) tkreg.qtc = {};
                            tkreg.qtc.fontfamily = tk.qtc.fontfamily;
                            for (var a in bbj.splinters) {
                                var tk2 = bbj.splinters[a].findTrack(tk.name);
                                if (!tk2) continue;
                                tk2.qtc.fontfamily = tk.qtc.fontfamily;
                            }
                            U = true;
                        }
                        break;
                    case 13:
                        if (tk.qtc.fontbold != undefined) {
                            tk.qtc.fontbold = menu.font.bold.checked;
                            if (!tkreg.qtc) tkreg.qtc = {};
                            tkreg.qtc.fontbold = tk.qtc.fontbold;
                            for (var a in bbj.splinters) {
                                var tk2 = bbj.splinters[a].findTrack(tk.name);
                                if (!tk2) continue;
                                tk2.qtc.fontbold = tk.qtc.fontbold;
                            }
                            U = true;
                        }
                        break;
                    case 14:
                        if (tk.qtc.fontsize) {
                            var s = parseInt(tk.qtc.fontsize);
                            s += menu.font.sizeincrease ? 1 : -1;
                            if (s <= 5) s = 5;
                            tk.qtc.fontsize = s + 'pt';
                            if (!tkreg.qtc) tkreg.qtc = {};
                            tkreg.qtc.fontsize = tk.qtc.fontsize;
                            for (var a in bbj.splinters) {
                                var tk2 = bbj.splinters[a].findTrack(tk.name);
                                if (!tk2) continue;
                                tk2.qtc.fontsize = tk.qtc.fontsize;
                            }
                            U = true;
                        }
                        break;
                    case 15:
                        if (tk.qtc.forwardcolor) {
                            tk.qtc.forwardcolor = menu.bam.f.style.backgroundColor;
                            if (!tkreg.qtc) tkreg.qtc = {};
                            tkreg.qtc.forwardcolor = tk.qtc.forwardcolor;
                            for (var a in bbj.splinters) {
                                var tk2 = bbj.splinters[a].findTrack(tk.name);
                                if (!tk2) continue;
                                tk2.qtc.forwardcolor = tk.qtc.forwardcolor;
                            }
                            U = true;
                        }
                        break;
                    case 16:
                        if (tk.qtc.reversecolor) {
                            tk.qtc.reversecolor = menu.bam.r.style.backgroundColor;
                            if (!tkreg.qtc) tkreg.qtc = {};
                            tkreg.qtc.reversecolor = tk.qtc.reversecolor;
                            for (var a in bbj.splinters) {
                                var tk2 = bbj.splinters[a].findTrack(tk.name);
                                if (!tk2) continue;
                                tk2.qtc.reversecolor = tk.qtc.reversecolor;
                            }
                            U = true;
                        }
                        break;
                    case 17:
                        if (tk.qtc.mismatchcolor) {
                            tk.qtc.mismatchcolor = menu.bam.m.style.backgroundColor;
                            if (!tkreg.qtc) tkreg.qtc = {};
                            tkreg.qtc.mismatchcolor = tk.qtc.mismatchcolor;
                            for (var a in bbj.splinters) {
                                var tk2 = bbj.splinters[a].findTrack(tk.name);
                                if (!tk2) continue;
                                tk2.qtc.mismatchcolor = tk.qtc.mismatchcolor;
                            }
                            U = true;
                        }
                        break;
                    case 18:
                        if (tk.qtc.thtype != undefined) {
                            tk.qtc.thtype = menu.lr.autoscale.checked ? scale_auto : scale_fix;
                            tkreg.qtc.thtype = tk.qtc.thtype;
                            if (menu.lr.autoscale.checked) {
                                menu.lr.pcscoresays.innerHTML =
                                    menu.lr.ncscoresays.innerHTML = 'auto';
                            } else {
                                menu.lr.pcscore.value = tk.qtc.pcolorscore;
                                menu.lr.ncscore.value = tk.qtc.ncolorscore;
                            }
                            for (var a in bbj.splinters) {
                                var tk2 = bbj.splinters[a].findTrack(tk.name);
                                if (!tk2) continue;
                                tk2.qtc.thtype = tk.qtc.thtype;
                            }
                            U = true;
                        }
                        break;
                    case 19:
                        if (tk.ft == FT_lr_n || tk.ft == FT_lr_c) {
                            var c = colorstr2int(menu.lr.pcolor.style.backgroundColor);
                            tk.qtc.pr = c[0];
                            tk.qtc.pg = c[1];
                            tk.qtc.pb = c[2];
                            tkreg.qtc.pr = c[0];
                            tkreg.qtc.pg = c[1];
                            tkreg.qtc.pb = c[2];
                            for (var a in bbj.splinters) {
                                var tk2 = bbj.splinters[a].findTrack(tk.name);
                                if (!tk2) continue;
                                tk2.qtc.pr = c[0];
                                tk2.qtc.pg = c[1];
                                tk2.qtc.pb = c[2];
                            }
                            U = true;
                        }
                        break;
                    case 20:
                        if (tk.ft == FT_lr_n || tk.ft == FT_lr_c) {
                            var c = colorstr2int(menu.lr.ncolor.style.backgroundColor);
                            tk.qtc.nr = c[0];
                            tk.qtc.ng = c[1];
                            tk.qtc.nb = c[2];
                            tkreg.qtc.nr = c[0];
                            tkreg.qtc.ng = c[1];
                            tkreg.qtc.nb = c[2];
                            for (var a in bbj.splinters) {
                                var tk2 = bbj.splinters[a].findTrack(tk.name);
                                if (!tk2) continue;
                                tk2.qtc.nr = c[0];
                                tk2.qtc.ng = c[1];
                                tk2.qtc.nb = c[2];
                            }
                            U = true;
                        }
                        break;
                    case 21:
                        if (tk.qtc.pcolorscore != undefined) {
                            tk.qtc.pcolorscore = parseFloat(menu.lr.pcscore.value);
                            tkreg.qtc.pcolorscore = tk.qtc.pcolorscore;
                            for (var a in bbj.splinters) {
                                var tk2 = bbj.splinters[a].findTrack(tk.name);
                                if (!tk2) continue;
                                tk2.qtc.pcolorscore = tk.qtc.pcolorscore;
                            }
                            U = true;
                        }
                        break;
                    case 22:
                        if (tk.qtc.ncolorscore != undefined) {
                            tk.qtc.ncolorscore = parseFloat(menu.lr.ncscore.value);
                            tkreg.qtc.ncolorscore = tk.qtc.ncolorscore;
                            for (var a in bbj.splinters) {
                                var tk2 = bbj.splinters[a].findTrack(tk.name);
                                if (!tk2) continue;
                                tk2.qtc.ncolorscore = tk.qtc.ncolorscore;
                            }
                            U = true;
                        }
                        break;
                    case 23:
                        if (tk.qtc.pfilterscore != undefined) {
                            tk.qtc.pfilterscore = parseFloat(menu.lr.pfscore.value);
                            tkreg.qtc.pfilterscore = tk.qtc.pfilterscore;
                            for (var a in bbj.splinters) {
                                var tk2 = bbj.splinters[a].findTrack(tk.name);
                                if (!tk2) continue;
                                tk2.qtc.pfilterscore = tk.qtc.pfilterscore;
                            }
                            A = true;
                            U = H = M = false;
                            A_tklst.push(tk);
                        }
                        break;
                    case 24:
                        if (tk.qtc.nfilterscore != undefined) {
                            tk.qtc.nfilterscore = parseFloat(menu.lr.nfscore.value);
                            tkreg.qtc.nfilterscore = tk.qtc.nfilterscore;
                            for (var a in bbj.splinters) {
                                var tk2 = bbj.splinters[a].findTrack(tk.name);
                                if (!tk2) continue;
                                tk2.qtc.nfilterscore = tk.qtc.nfilterscore;
                            }
                            A = true;
                            U = H = M = false;
                            A_tklst.push(tk);
                        }
                        break;
                    case 25:
                        var check = menu.c45.combine.checked;
                        menu.c45.combine_chg.div.style.display = 'none';
                        if (tk.ft == FT_cm_c && tk.cm.combine != check) {
                            tk.cm.combine = check;
                            tkreg.cm.combine = check;
                            if (tk.cm.combine && tk.cm.set.chg_f && tk.cm.set.chg_r) {
                                menu.c45.combine_chg.div.style.display = 'block';
                                menu.c45.combine_chg.checkbox.checked = tk.cm.combine_chg;
                            }
                            for (var a in bbj.splinters) {
                                var tk2 = bbj.splinters[a].findTrack(tk.name);
                                if (!tk2) continue;
                                tk2.cm.combine = check;
                            }
                            U = true;
                            H = true;
                        }
                        break;
                    case 26:
                        var check = menu.c45.scale.checked;
                        if (tk.ft == FT_cm_c && tk.cm.scale != check) {
                            tk.cm.scale = check;
                            tkreg.cm.scale = check;
                            for (var a in bbj.splinters) {
                                var tk2 = bbj.splinters[a].findTrack(tk.name);
                                if (!tk2) continue;
                                tk2.cm.scale = check;
                            }
                            U = true;
                        }
                        break;
                    case 27:
                        if (tk.ft == FT_cm_c) {
                            var c = gflag.menu.cmtk_colorcell;
                            var cc = c.style.backgroundColor;
                            if (c.bg) {
                                tk.cm.bg[c.which] = cc;
                                tkreg.cm.bg[c.which] = cc;
                            } else {
                                tk.cm.color[c.which] = cc;
                                tkreg.cm.color[c.which] = cc;
                            }
                            for (var a in bbj.splinters) {
                                var tk2 = bbj.splinters[a].findTrack(tk.name);
                                if (!tk2) continue;
                                if (c.bg) {
                                    tk2.cm.bg[c.which] = cc;
                                } else {
                                    tk2.cm.color[c.which] = cc;
                                }
                            }
                            U = true;
                        }
                        break;
                    case 28:
                        if (useScore) {
                            var scale = tk.scorescalelst[tk.showscoreidx];
                            scale.type = scale_fix;
                            scale.min = gflag.menu.hammock_focus.min;
                            scale.max = gflag.menu.hammock_focus.max;
                            var s2 = tk.scorescalelst[tk.showscoreidx];
                            s2.type = scale_fix;
                            s2.min = scale.min;
                            s2.max = scale.max;
                            for (var a in bbj.splinters) {
                                var tk2 = bbj.splinters[a].findTrack(tk.name);
                                if (!tk2) continue;
                                s2 = tk2.scorescalelst[tk.showscoreidx];
                                s2.type = scale_fix;
                                s2.min = gflag.menu.hammock_focus.min;
                                s2.max = gflag.menu.hammock_focus.max;
                            }
                            U = true;
                            if (tk.group != undefined) {
                                groupScaleChange[tk.group] = {scale: scale_fix, min: scale.min, max: scale.max};
                            }
                        } else if (isNumerical(tk)) {
                            // "Apply to all" spilling over
                            tk.qtc.thtype = scale_fix;
                            tk.qtc.thmin = gflag.menu.hammock_focus.min;
                            tk.qtc.thmax = gflag.menu.hammock_focus.max;
                            tkreg.qtc.thtype = scale_fix;
                            tkreg.qtc.thmin = tk.qtc.thmin;
                            tkreg.qtc.thmax = tk.qtc.thmax;
                            qtc_thresholdcolorcell(tk.qtc);
                            for (var a in bbj.splinters) {
                                var tk2 = bbj.splinters[a].findTrack(tk.name);
                                if (!tk2) continue;
                                tk2.qtc.thtype = scale_fix;
                                tk2.qtc.thmin = tk.qtc.thmin;
                                tk2.qtc.thmax = tk.qtc.thmax;
                            }
                            U = true;
                            if (tk.group != undefined) {
                                groupScaleChange[tk.group] = {scale: scale_fix, min: tk.qtc.thmin, max: tk.qtc.thmax};
                            }
                        }
                        break;
                    case 29:
                        // must be calling with auto scale
                        if (useScore) {
                            tk.scorescalelst[tk.showscoreidx].type = scale_auto;
                            tkreg.scorescalelst[tk.showscoreidx].type = scale_auto;
                            for (var a in bbj.splinters) {
                                var tk2 = bbj.splinters[a].findTrack(tk.name);
                                if (!tk2) continue;
                                tk2.scorescalelst[tk.showscoreidx].type = scale_auto;
                            }
                            U = true;
                            M = true;
                            if (tk.group != undefined) {
                                groupScaleChange[tk.group] = {scale: scale_auto};
                            }
                        } else if (isNumerical(tk)) {
                            // "Apply to all" spilling over
                            tk.qtc.thtype = scale_auto;
                            tkreg.qtc.thtype = scale_auto;
                            for (var a in bbj.splinters) {
                                var tk2 = bbj.splinters[a].findTrack(tk.name);
                                if (!tk2) continue;
                                tk2.qtc.thtype = scale_auto;
                            }
                            U = true;
                            if (tk.group != undefined) {
                                groupScaleChange[tk.group] = {scale: scale_auto};
                            }
                        }
                        break;
                    case 30:
                        if (tk.showscoreidx != undefined) {
                            tk.showscoreidx = gflag.menu.hammock_focus.scoreidx;
                            tkreg.showscoreidx = tk.showscoreidx;
                            if (tk.ft == FT_ld_c || tk.ft == FT_ld_n) {
                                bbj.stack_track(tk, 0);
                            }
                            for (var a in bbj.splinters) {
                                var b2 = bbj.splinters[a];
                                var tk2 = b2.findTrack(tk.name);
                                if (!tk2) continue;
                                tk2.showscoreidx = tk.showscoreidx;
                                if (tk.ft == FT_ld_c || tk.ft == FT_ld_n) {
                                    b2.stack_track(tk2, 0);
                                }
                            }
                            U = true;
                            M = true;
                            if (tk.group != undefined) {
                                if (bbj.tkgroup[tk.group].scale == scale_auto) {
                                    // need updating group scale
                                    groupScaleChange[tk.group] = {scale: scale_auto};
                                }
                            }
                        }
                        break;
                    case 31:
                        if (menu.c45.filter.checkbox.checked) {
                            menu.c45.filter.div.style.display = 'block';
                            var fv = parseInt(menu.c45.filter.input.value);
                            if (isNaN(fv) || fv <= 0) print2console('Filter read depth value must be positive integer', 2);
                            if (tk.ft == FT_cm_c) {
                                tk.cm.filter = fv;
                                tkreg.cm.filter = fv;
                                for (var a in bbj.splinters) {
                                    var tk2 = bbj.splinters[a].findTrack(tk.name);
                                    if (!tk2) continue;
                                    tk2.cm.filter = fv;
                                }
                                U = true;
                            }
                        } else {
                            menu.c45.filter.div.style.display = 'none';
                            if (tk.ft == FT_cm_c) {
                                tk.cm.filter = 0;
                                tkreg.cm.filter = 0;
                                for (var a in bbj.splinters) {
                                    var tk2 = bbj.splinters[a].findTrack(tk.name);
                                    if (!tk2) continue;
                                    tk2.cm.filter = 0;
                                }
                                U = true;
                            }
                        }
                        break;
                    case 32:
                        if (isNumerical(tk)) {
                            // need to escape cmtk?
                            tk.qtc.summeth = parseInt(menu.c59.select.options[menu.c59.select.selectedIndex].value);
                            tkreg.qtc.summeth = tk.qtc.summeth;
                            for (var a in bbj.splinters) {
                                var tk2 = bbj.splinters[a].findTrack(tk.name);
                                if (!tk2) continue;
                                tk2.qtc.summeth = tk.qtc.summeth;
                            }
                            A = true;
                            U = H = M = false;
                            A_tklst.push(tk);
                        }
                        break;
                    case 33:
                        tk.qtc.bg = palette.output;
                        if (!tkreg.qtc) tkreg.qtc = {};
                        tkreg.qtc.bg = tk.qtc.bg;
                        for (var a in bbj.splinters) {
                            var tk2 = bbj.splinters[a].findTrack(tk.name);
                            if (!tk2) continue;
                            tk2.qtc.bg = tk.qtc.bg;
                        }
                        U = true;
                        break;
                    case 38:
                        var usebg = menu.c44.checkbox.checked;
                        tk.qtc.bg = usebg ? menu.c44.color.style.backgroundColor : null;
                        if (!tkreg.qtc) tkreg.qtc = {};
                        tkreg.qtc.bg = tk.qtc.bg;
                        for (var a in bbj.splinters) {
                            var tk2 = bbj.splinters[a].findTrack(tk.name);
                            if (!tk2) continue;
                            tk2.qtc.bg = tk.qtc.bg;
                        }
                        U = true;
                        break;
                    case 34:
                        if (tk.ft != FT_cat_n && tk.ft != FT_cat_c) continue;
                        tk.cateInfo[gflag.menu.catetk.itemidx][1] = palette.output;
                        for (var a in bbj.splinters) {
                            var tk2 = bbj.splinters[a].findTrack(tk.name);
                            if (!tk2) continue;
                            tk2.cateInfo[gflag.menu.catetk.itemidx][1] = palette.output;
                        }
                        U = true;
                        break;
                    case 35:
                        // restoring cate color on available for native tracks
                        if (tk.ft != FT_cat_n) continue;
                        var _o = bbj.genome.getTkregistryobj(tk.name, tk.ft);
                        if (!_o) continue;
                        cateInfo_copy(_o.cateInfo, tk.cateInfo);
                        cateCfg_show(tk, false);
                        for (var a in bbj.splinters) {
                            var tk2 = bbj.splinters[a].findTrack(tk.name);
                            if (!tk2) continue;
                            cateInfo_copy(_o.cateInfo, tk2.cateInfo);
                        }
                        U = true;
                        break;
                    case 37:
                        if (tk.ft != FT_bedgraph_n && tk.ft != FT_bedgraph_c) continue;
                        var usebg = menu.c29.checkbox.checked;
                        tk.qtc.barplotbg = usebg ? menu.c29.color.style.backgroundColor : null;
                        tkreg.qtc.barplotbg = tk.qtc.barplotbg;
                        for (var a in bbj.splinters) {
                            var tk2 = bbj.splinters[a].findTrack(tk.name);
                            if (!tk2) continue;
                            tk2.qtc.barplotbg = tk.qtc.barplotbg;
                        }
                        U = true;
                        break;
                    case 36:
                        if (tk.ft != FT_bedgraph_n && tk.ft != FT_bedgraph_c) continue;
                        tk.qtc.barplotbg = palette.output;
                        tkreg.qtc.barplotbg = tk.qtc.barplotbg;
                        for (var a in bbj.splinters) {
                            var tk2 = bbj.splinters[a].findTrack(tk.name);
                            if (!tk2) continue;
                            tk2.qtc.barplotbg = tk.qtc.barplotbg;
                        }
                        U = true;
                        break;
                    case 39:
                        var check = menu.c45.combine_chg.checkbox.checked;
                        if (tk.ft == FT_cm_c && tk.cm.set.chg_f && tk.cm.set.chg_r && tk.cm.combine_chg != check) {
                            tk.cm.combine_chg = check;
                            tkreg.cm.combine_chg = check;
                            for (var a in bbj.splinters) {
                                var tk2 = bbj.splinters[a].findTrack(tk.name);
                                if (!tk2) continue;
                                tk2.cm.combine_chg = check;
                            }
                            U = true;
                            H = true;
                        }
                        break;
                    case 40:
                        if (tk.ft == FT_bigwighmtk_n || tk.ft == FT_bigwighmtk_c || tk.ft == FT_bedgraph_n || tk.ft == FT_bedgraph_c) {
                            tk.qtc.curveonly = menu.c66.checkbox.checked;
                            U = true;
                        }
                        break;
                    // eee
                    default:
                        fatalError('bbj tk: unknown update context');
                }
                if (U) {
                    bbj.updateTrack(tk, H);
                }
                if (M) {
                    config_dispatcher(tk);
                }
            }
            for (var groupid = 0; groupid < groupScaleChange.length; groupid++) {
                var x = groupScaleChange[groupid];
                if (!x) continue;
                var y = bbj.tkgroup[groupid];
                if (!y) {
                    print2console('bbj.tkgroup[' + groupid + '] missing', 2);
                    bbj.tkgroup[groupid] = {scale: scale_auto, min: 0, min_show: 0, max: 1, max_show: 1};
                    y = bbj.tkgroup[groupid];
                }
                if (x.scale != undefined) {
                    y.scale = x.scale;
                }
                if (y.scale == scale_auto) {
                    bbj.tkgroup_setYscale(groupid);
                } else {
                    if (x.min == undefined || x.max == undefined) fatalError('not getting min/max for fixed group y scale');
                    y.min = y.min_show = x.min;
                    y.max = y.max_show = x.max;
                }
                for (var i = 0; i < bbj.tklst.length; i++) {
                    var t = bbj.tklst[i];
                    if (t.group == groupid) {
                        bbj.drawTrack_browser(t);
                    }
                }
            }
            if (takelog) {
                if (bbj.onupdatex) {
                    bbj.onupdatex();
                    menu_hide();
                }
            }
            if (A) {
                if (A_tklst.length == 0) {
                    print2console('A set to true A_tklst is empty', 2);
                } else {
                    bbj.ajax_addtracks(A_tklst);
                }
                return;
            }
            return;
        case 15:
            var hvobj = apps.circlet.hash[gflag.menu.viewkey];
            switch (updatecontext) {
                case 19:
                    hvobj.callingtk.pcolor = colorstr2int(menu.lr.pcolor.style.backgroundColor).join(',');
                    break;
                case 20:
                    hvobj.callingtk.ncolor = colorstr2int(menu.lr.ncolor.style.backgroundColor).join(',');
                    break;
                case 21:
                    hvobj.callingtk.pscore = parseFloat(menu.lr.pcscore.value);
                    break;
                case 22:
                    hvobj.callingtk.nscore = parseFloat(menu.lr.ncscore.value);
                    break;
                default:
                    fatalError('circlet callingtk: unknown update context');
            }
            hengeview_draw(gflag.menu.viewkey);
            return;
        case 19:
            // track idx identified in gflag.menu.wreathIdx
            var tk = apps.circlet.hash[gflag.menu.viewkey].wreath[gflag.menu.wreathIdx];
            switch (updatecontext) {
                case 1:
                    var c = colorstr2int(menu.c50.color1.style.backgroundColor);
                    tk.qtc.pr = c[0];
                    tk.qtc.pg = c[1];
                    tk.qtc.pb = c[2];
                    break;
                case 2:
                    var c = colorstr2int(menu.c50.color2.style.backgroundColor);
                    tk.qtc.nr = c[0];
                    tk.qtc.ng = c[1];
                    tk.qtc.nb = c[2];
                    break;
                case 3:
                    tk.qtc.pth = menu.c50.color1_1.style.backgroundColor;
                    break;
                case 4:
                    tk.qtc.nth = menu.c50.color2_1.style.backgroundColor;
                    break;
                case 34:
                    hvobj.cateInfo[gflag.menu.catetk.itemidx][1] = palette.output;
                    break;
                default:
                    fatalError('wreath tk: unknown update context');
            }
            hengeview_draw(gflag.menu.viewkey);
            return;
        case 20:
            var tk = bbj.genome.bev.tklst[gflag.menu.bevtkidx];
            switch (updatecontext) {
                case 1:
                    var c = colorstr2int(menu.c50.color1.style.backgroundColor);
                    tk.qtc.pr = c[0];
                    tk.qtc.pg = c[1];
                    tk.qtc.pb = c[2];
                    break;
                case 2:
                    var c = colorstr2int(menu.c50.color2.style.backgroundColor);
                    tk.qtc.nr = c[0];
                    tk.qtc.ng = c[1];
                    tk.qtc.nb = c[2];
                    break;
                case 3:
                    tk.qtc.pth = menu.c50.color1_1.style.backgroundColor;
                    break;
                case 4:
                    tk.qtc.nth = menu.c50.color2_1.style.backgroundColor;
                    break;
                case 5:
                    var v = parseInt(menu.c51.select.options[menu.c51.select.selectedIndex].value);
                    tk.qtc.thtype = v;
                    if (v == scale_percentile) {
                        tk.qtc.thpercentile = parseInt(menu.c51.percentile.says.innerHTML);
                    }
                    qtc_thresholdcolorcell(tk.qtc);
                    break;
                case 6:
                    tk.qtc.thtype = scale_fix;
                    tk.qtc.thmin = parseFloat(menu.c51.fix.min.value);
                    tk.qtc.thmax = parseFloat(menu.c51.fix.max.value);
                    qtc_thresholdcolorcell(tk.qtc);
                    break;
                case 32:
                    tk.qtc.summeth = parseInt(menu.c59.select.options[menu.c59.select.selectedIndex].value);
                    bbj.bev_ajax([tk]);
                    return;
                case 34:
                    tk.cateInfo[gflag.menu.catetk.itemidx][1] = palette.output;
                    break;
                default:
                    fatalError('bev tk: unknown update context');
            }
            bbj.genome.bev_draw_track(tk);
            return;
        default:
            fatalError('unknown menu context');
    }
}

Browser.prototype.updateTrack = function (tk, changeheight) {
// by updating various controls, color, scale, height.. no svg
    var bbj = this;
    if (this.splinterTag) {
        bbj = this.trunk;
        var t = bbj.findTrack(tk.name);
        if (!t) {
            print2console(tk.name + ' is missing from trunk', 2);
            return;
        }
        tk = t;
    }
    if (tk.cotton && tk.ft != FT_weaver_c) {
        // a cotton track
        if (!bbj.weaver.iscotton) {
            /* calling from target bbj but must use cottonbbj to draw cottontk
             since need to observe cotton.weaver.insert
             */
            bbj = bbj.weaver.q[tk.cotton];
        }
    }
    bbj.stack_track(tk, 0);
    bbj.drawTrack_browser(tk);
    if (changeheight) {
        bbj.drawMcm_onetrack(tk);
        bbj.trackHeightChanged();
        // must adjust for splinters
        for (var tag in bbj.splinters) {
            bbj.splinters[tag].trackHeightChanged();
        }
        if (indicator3.style.display == 'block') {
            /* adjust indicator3
             in case of right clicking on splinter, must use splinter bbj which is registered in gflag.menu.bbj
             */
            var b2 = menu.style.display == 'block' ? gflag.menu.bbj : bbj;
            if (menu.c53.checkbox.checked) {
                indicator3cover(b2);
            } else {
                b2.highlighttrack(gflag.menu.tklst);
            }
        }
    }
};


/*** __cloak__ ***/
function invisible_shield(dom) {
    var pos = absolutePosition(dom);
    if (pos[0] + pos[1] < 0) return;
// means div2 is visible
    invisibleBlanket.style.display = 'block';
    invisibleBlanket.style.left = pos[0];
    invisibleBlanket.style.top = pos[1];
    invisibleBlanket.style.width = dom.clientWidth;
    invisibleBlanket.style.height = dom.clientHeight;
}
function cloakPage() {
// cast shadow over entire page
    pagecloak.style.display = 'block';
    pagecloak.style.height = Math.max(window.innerHeight, document.body.offsetHeight);
    pagecloak.style.width = Math.max(window.innerWidth, document.body.offsetWidth);
}

Browser.prototype.cloak = function () {
    if (!this.main) return;
    loading_cloak(this.main);
};

Browser.prototype.shieldOn = function () {
    if (!this.main || !this.shield) return;
    var d = this.main;
    var s = this.shield;
    s.style.display = 'block';
    s.style.width = d.offsetWidth;
    s.style.height = d.offsetHeight;
};

Browser.prototype.shieldOff = function () {
    if (!this.shield) return;
    this.shield.style.display = 'none';
};

Browser.prototype.unveil = function () {
    loading_done();
};

function loading_cloak(dom) {
// images/loading.gif size: 128x128
    var pos = absolutePosition(dom);
    waitcloak.style.display = 'block';
    waitcloak.style.left = pos[0];
    waitcloak.style.top = pos[1];
    var w = dom.clientWidth;
    var h = dom.clientHeight;
    waitcloak.style.width = w;
    waitcloak.style.height = h;
// roller
    waitcloak.firstChild.style.marginTop = h > 128 ? (h - 128) / 2 : 0;
    waitcloak.firstChild.style.marginLeft = w > 128 ? (w - 128) / 2 : 0;
}
function loading_done() {
    waitcloak.style.display = 'none';
}

/*** __cloak__ ends ***/

