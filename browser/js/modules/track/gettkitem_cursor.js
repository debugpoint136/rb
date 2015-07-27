/**
 * ===BASE===// track // gettkitem_cursor.js
 * @param __Browser.prototype__
 * @param 
 */

Browser.prototype.gettkitem_cursor = function (tk, x, y) {
    /* x/y: event.clientX/Y
     if at barplot, will return a list of items
     */
    x = x + document.body.scrollLeft - absolutePosition(this.hmdiv.parentNode)[0] - this.move.styleLeft;
    y = y + document.body.scrollTop - absolutePosition(tk.canvas)[1];
    if (tk.mode == M_arc || tk.mode == M_trihm) {
        if (tk.mode == M_arc) {
            return findDecoritem_longrange_arc(tk.data_arc, x, y);
        }
        return findDecoritem_longrange_trihm(tk.data_trihm,
            tk.qtc.anglescale * Math.PI / 4,
            x, y);
    }
    var hitpoint = this.sx2rcoord(x, true);
    if (!hitpoint) return null;
    var A = hitpoint.rid, B = hitpoint.sid;

    if (tk.mode == M_bar) {
        if (y <= densitydecorpaddingtop + tk.qtc.height + 1) {
            // cursor over bars
            var hits = [];
            for (var i = 0; i < tk.data[A].length; i++) {
                var item = tk.data[A][i];
                if (item.start <= hitpoint.coord && item.stop >= hitpoint.coord) {
                    hits.push(item);
                }
            }
            return hits;
        } else {
            // cursor over item boxes
            var clickstack = parseInt((y - densitydecorpaddingtop - tk.qtc.height - 1) / (fullStackHeight + 1));
            for (var i = 0; i < tk.data[A].length; i++) {
                var item = tk.data[A][i];
                if (item.stack == clickstack && item.start <= hitpoint.coord && item.stop >= hitpoint.coord) {
                    return [item];
                }
            }
        }
        return [];
    }
    if (isNumerical(tk)) {
        if (A >= tk.data.length) return null;
        if (B >= tk.data[A].length) return null;
        return tk.data[A][B];
    }
    switch (tk.ft) {
        case FT_cat_n:
        case FT_cat_c:
            return tk.cateInfo[tk.data[A][B]];
        case FT_matplot:
            return true;
        case FT_cm_c:
            return true;
        case FT_anno_n:
        case FT_anno_c:
        case FT_bam_n:
        case FT_bam_c:
        case FT_bed_n:
        case FT_bed_c:
        case FT_lr_n:
        case FT_lr_c:
        case FT_weaver_c:
            if (tk.ft == FT_weaver_c && tk.weaver.mode == W_rough) {
                if (y >= tk.canvas.height - fullStackHeight) {
                    // over query stitch
                    for (var i = 0; i < tk.weaver.stitch.length; i++) {
                        var s = tk.weaver.stitch[i];
                        if (x < s.canvasstart || x > s.canvasstop) continue;
                        var perc = (x - s.canvasstart) / (s.canvasstop - s.canvasstart);
                        var re = {
                            stitch: s,
                            query: s.chr + ':' + (s.start + parseInt((s.stop - s.start) * perc)),
                        };
                        for (var j = 0; j < s.lst.length; j++) {
                            var h = s.lst[j];
                            // using on screen pos of query, not target!
                            var a = h.strand == '+' ? h.q1 : h.q2,
                                b = h.strand == '+' ? h.q2 : h.q1;
                            if (x >= a && x <= b) {
                                re.hsp = h;
                                perc = (x - h.q1) / (h.q2 - h.q1);
                                re.target = this.regionLst[h.targetrid][0] + ':' +
                                (h.targetstart + parseInt((h.targetstop - h.targetstart) * perc));
                                return re;
                            }
                        }
                        return re;
                    }
                } else {
                    // may target
                }
                return null;
            }
            var clickstack;
            if (tk.ft == FT_weaver_c) {
                clickstack = parseInt((y - weavertkpad) / (tk.qtc.stackheight + 1));
            } else {
                var stkh = tk.mode == M_full ? fullStackHeight + 1 : thinStackHeight + 1;
                clickstack = parseInt(y / (stkh));
            }
            var _data = (tk.ft == FT_lr_n || tk.ft == FT_lr_c) ? tk.data_chiapet : tk.data;
            for (var i = 0; i < _data.length; i++) {
                for (var j = 0; j < _data[i].length; j++) {
                    var item = _data[i][j];
                    if (item.stack == undefined || item.stack != clickstack) continue;
                    if (item.stackstart >= 0) {
                        if (item.stackstart <= x && item.stackstart + item.stackwidth >= x) {
                            return item;
                        }
                    } else {
                        if (item.start <= hitpoint.coord && item.stop > hitpoint.coord) {
                            return item;
                        }
                    }
                }
            }
            return null;
        case FT_catmat:
            if (y <= 1) return null;
            if (!tk.data[A]) return null;
            for (var i = 0; i < tk.data[A].length; i++) {
                var item = tk.data[A][i];
                if (item.start <= hitpoint.coord && item.stop >= hitpoint.coord) {
                    return tk.cateInfo[item.layers[parseInt((y - 1) / tk.rowheight)]];
                }
            }
            return null;
        case FT_qcats:
            if (y <= 1) return null;
            if (!tk.data[A]) return null;
            for (var i = 0; i < tk.data[A].length; i++) {
                var item = tk.data[A][i];
                if (item.start <= hitpoint.coord && item.stop >= hitpoint.coord) {
                    for (var j = 0; j < item.qcat.length; j++) {
                        var q = item.qcat[j];
                        if (q[3] <= y && q[3] + q[4] >= y) {
                            return [q[0], tk.cateInfo[q[1]]];
                        }
                    }
                }
            }
            return null;
        default:
            fatalError('unknown tk ft');
    }
};


