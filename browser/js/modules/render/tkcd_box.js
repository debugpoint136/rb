/**
 * ===BASE===// render // tkcd_box .js
 * @param __Browser.prototype__
 * @param 
 */

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

