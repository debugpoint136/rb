/**
 * ===BASE===// render // tkcd_item .js
 * @param __Browser.prototype__
 * @param 
 */

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


