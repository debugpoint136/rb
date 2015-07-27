/**
 * ===BASE===// preqtc // decoritem_strokeStrandarrow.js
 * @param 
 */

function decoritem_strokeStrandarrow(ctx, strand, x, w, y, h, color, tosvg) {
    /* only for items in full decor track?
     must already set strokeStyle
     args:
     ctx: 2d context, all path must already been closed
     strand: '>' '<'
     x: absolute x start on canvas
     w: width to plot with
     y: absolute y start
     color: string, only to be used in svg output
     tosvg: boolean
     */
    if (w < instack_arrowwidth) return [];
    var thisx = 0;
    var num = 0;
    while (thisx + instack_arrowwidth <= w) {
        thisx += instack_arrowwidth + instack_arrowspacing;
        num++;
    }
    if (num == 0) return [];
    thisx = (w - instack_arrowwidth * num - instack_arrowspacing * (num - 1)) / 2;
    ctx.strokeStyle = color;
    ctx.beginPath();
    var svgdata = [];
    for (var i = 0; i < num; i++) {
        if (strand == '>' || strand == '+') {
            var x1 = x + thisx,
                y1 = y + instack_padding,
                x2 = x + thisx + instack_arrowwidth,
                y2 = y + h / 2,
                y3 = y + h - instack_padding;
            ctx.moveTo(x1, y1);
            ctx.lineTo(x2, y2);
            ctx.lineTo(x1, y3);
            if (tosvg) {
                svgdata.push({type: svgt_line, x1: x1, y1: y1, x2: x2, y2: y2, color: ctx.strokeStyle});
                svgdata.push({type: svgt_line, x1: x2, y1: y2, x2: x1, y2: y3, color: ctx.strokeStyle});
            }
        } else {
            var x1 = x + thisx + instack_arrowwidth,
                y1 = y + instack_padding,
                x2 = x + thisx,
                y2 = y + h / 2,
                y3 = y + h - instack_padding;
            ctx.moveTo(x1, y1);
            ctx.lineTo(x2, y2);
            ctx.lineTo(x1, y3);
            if (tosvg) {
                svgdata.push({type: svgt_line, x1: x1, y1: y1, x2: x2, y2: y2, color: ctx.strokeStyle});
                svgdata.push({type: svgt_line, x1: x2, y1: y2, x2: x1, y2: y3, color: ctx.strokeStyle});
            }
        }
        thisx += instack_arrowwidth + instack_arrowspacing;
    }
// don't do closePath or will mess up
    ctx.stroke();
    if (tosvg) return svgdata;
}

