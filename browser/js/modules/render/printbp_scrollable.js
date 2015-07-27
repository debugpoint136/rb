/**
 * ===BASE===// render // printbp_scrollable.js
 * @param 
 */

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

