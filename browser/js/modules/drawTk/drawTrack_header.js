/**
 * ===BASE===// drawTk // drawTrack_header.js
 * @param __Browser.prototype__
 * @param 
 */

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


