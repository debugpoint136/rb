/**
 * ===BASE===// preqtc // plotSamread .js
 * @param __Browser.prototype__
 * @param 
 */

Browser.prototype.plotSamread = function (ctx, rid, start, info, y, h, color, miscolor, tosvg) {
    /* plot a single read, not PE
     start/stop: read alignment start/stop coord on reference, including soft clipping
     info: {cigar:[], mismatch:xx,start,stop} (start/stop for aligned portion)
     y
     h
     color: box fill color
     miscolor: mismatch color
     tosvg:
     */
    var sdata = [];
    var r = this.regionLst[rid];
    var _c_d = 'rgba(' + colorstr2int(color).join(',') + ',0.3)';
    var _c_g = colorCentral.foreground_faint_3; // gray
    var coord = start;
    for (var i = 0; i < info.cigar.length; i++) {
        var op = info.cigar[i][0];
        var cl = info.cigar[i][1];
        if (op == 'M') {
            var s = this.tkcd_box({
                ctx: ctx,
                rid: rid,
                start: Math.max(r[3], coord),
                stop: Math.min(r[4], coord + cl),
                viziblebox: true,
                y: y,
                h: h,
                fill: color,
                tosvg: tosvg,
            });
            if (tosvg) sdata = sdata.concat(s);
        } else if (op == 'I') {
            // insertion
        } else if (op == 'D') {
            // deletion
            var s = this.tkcd_box({
                ctx: ctx,
                rid: rid,
                start: Math.max(r[3], coord),
                stop: Math.min(r[4], coord + cl),
                y: y,
                h: h,
                fill: _c_d,
                tosvg: tosvg,
            });
            if (tosvg) sdata = sdata.concat(s);
        } else if (op == 'S' || op == 'H') {
            var s = this.tkcd_box({
                ctx: ctx,
                rid: rid,
                start: Math.max(r[3], coord),
                stop: Math.min(r[4], coord + cl),
                y: y,
                h: h,
                fill: _c_g,
                tosvg: tosvg,
            });
            if (tosvg) sdata = sdata.concat(s);
        } else if (op == 'N') {
            // skip, intron in rna-seq
            var a = this.cumoffset(rid, Math.max(r[3], coord)),
                b = this.cumoffset(rid, Math.min(r[4], coord + cl));
            if (a >= 0 && b > a) {
                ctx.fillStyle = _c_g;
                ctx.fillRect(a, y + parseInt(h / 2), b - a, 1);
                if (tosvg) sdata.push({
                    type: svgt_line,
                    x1: a, y1: y + parseInt(h / 2),
                    x2: b, y2: y + parseInt(h / 2),
                    w: 1, color: _c_g
                });
            }
        }
        coord += cl;
    }
// mismatch
    if (info.mismatch) {
        // need to see if there's clipping at begining
        coord = Math.max(start, r[3]);
        var op = info.cigar[0][0];
        if (op == 'S') {
            coord += info.cigar[0][1];
        }
        var str = info.mismatch.substr(1); // remove first Z
        var bpw = this.entire.atbplevel ? this.entire.bpwidth : 1;
        var plotlineonly = (h < 8 || bpw < 6);
        if (!plotlineonly) {
            ctx.font = "bold 8pt Sans-serif"
        }
        ctx.fillStyle = miscolor;
        var stroffset = 0;
        var bpoffset = 0;
        var tmpstr = str;
        var skipping = false;
        while (stroffset < str.length - 1) {
            var n = parseInt(tmpstr);
            if (isNaN(n)) {
                // none digit cha
                var c = str[stroffset];
                if (c == 'A' || c == 'C' || c == 'G' || c == 'T') {
                    if (!skipping) {
                        // a mismatch
                        var ch = info.seq.charAt(stroffset);
                        var x = this.cumoffset(rid, coord + bpoffset);
                        if (plotlineonly) {
                            ctx.fillRect(x, y, bpw, h);
                            if (tosvg) sdata.push({type: svgt_rect, x: x, y: y, w: bpw, h: h, fill: ctx.fillStyle});
                        } else {
                            ctx.fillText(info.seq.charAt(bpoffset), x, y + 9);
                            if (tosvg) sdata.push({
                                type: svgt_text, x: x, y: y + 9,
                                text: info.seq.charAt(bpoffset),
                                color: ctx.fillStyle
                            });
                        }
                    }
                    bpoffset++;
                } else {
                    // weird char, do not handle FIXME
                    skipping = true;
                }
                stroffset++;
            } else {
                bpoffset += n;
                stroffset += n.toString().length;
                skipping = false;
            }
            tmpstr = str.substr(stroffset);
        }
    }
    if (tosvg) return sdata;
};


