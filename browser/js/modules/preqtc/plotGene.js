/**
 * ===BASE===// preqtc // plotGene.js
 * @param 
 */

function plotGene(ctx, color, scolor, item, x, y, w, h, startcoord, stopcoord, tosvg) {
    /* plot an item with structure
     note: some items have no structure, e.g. polyA signal
     args:
     color
     scolor: counter color, doodling inside thick boxes
     item (with .struct, .strand)
     x/y/w/h - defines the plot box
     startcoord/stopcoord - the start/stop coordinate of the plot box
     tosvg
     */
    var svgdata = [];
// backbone and strand arrows
    ctx.strokeStyle = color;
    var pos = itemcoord2plotbox(item.start, item.stop, startcoord, stopcoord, w);
    if (pos[0] == -1) return;
    pos[0] += x;
    var y2 = y + h / 2;
    ctx.beginPath();
    ctx.moveTo(pos[0], y2);
    ctx.lineTo(pos[0] + pos[1], y2);
    ctx.stroke();
    if (tosvg) {
        svgdata.push({type: svgt_line, x1: pos[0], y1: y2, x2: pos[0] + pos[1], y2: y2, w: 1, color: color});
    }
    var strand = item.strand ? (item.strand == '.' ? null : (item.strand == '>' || item.strand == '+') ? '>' : '<') : null;
    if (strand) {
        var tmplst = decoritem_strokeStrandarrow(ctx, strand, pos[0], pos[1], y, h, color, tosvg);
        if (tosvg) {
            svgdata = svgdata.concat(tmplst);
        }
    }
    ctx.fillStyle = color;
    if (item.struct && item.struct.thin) {
        for (var i = 0; i < item.struct.thin.length; i++) {
            var t = item.struct.thin[i];
            var pos = itemcoord2plotbox(t[0], t[1], startcoord, stopcoord, w);
            if (pos[0] != -1) {
                var q1 = x + pos[0],
                    q2 = y + instack_padding,
                    q3 = pos[1],
                    q4 = h - instack_padding * 2;
                ctx.fillRect(q1, q2, q3, q4);
                if (tosvg) svgdata.push({type: svgt_rect, x: q1, y: q2, w: q3, h: q4, fill: color});
            }
        }
    }
    if (item.struct && item.struct.thick) {
        for (var i = 0; i < item.struct.thick.length; i++) {
            var t = item.struct.thick[i];
            var pos = itemcoord2plotbox(t[0], t[1], startcoord, stopcoord, w);
            if (pos[0] != -1) {
                ctx.fillRect(x + pos[0], y, pos[1], h);
                if (tosvg) svgdata.push({type: svgt_rect, x: x + pos[0], y: y, w: pos[1], h: h, fill: color});
                if (strand) {
                    var tmplst = decoritem_strokeStrandarrow(ctx, strand, x + pos[0] + 2, pos[1] - 4, y, h, scolor, tosvg);
                    if (tosvg) svgdata = svgdata.concat(tmplst);
                }
            }
        }
    }
    if (tosvg) return svgdata;
}
