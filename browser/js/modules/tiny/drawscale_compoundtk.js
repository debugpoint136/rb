function drawscale_compoundtk(arg) {
    /* 3 values: top - middle -bottom
     arg.h is half total height
     */
    var a = arg.x,
        b = arg.y,
        c = arg.h * 2 + 2,
        ctx = arg.ctx,
        linetype = arg.scrollable ? svgt_line : svgt_line_notscrollable,
        texttype = arg.scrollable ? svgt_text : svgt_text_notscrollable;
    var svgdata = [];
    ctx.fillRect(a, b, 1, c);
    if (arg.tosvg) svgdata.push({type: linetype, x1: a, y1: b, x2: a, y2: b + c, color: ctx.fillStyle});
    a -= 4;
    ctx.fillRect(a, b, 4, 1);
    if (arg.tosvg) svgdata.push({type: linetype, x1: a, y1: b, x2: a + 4, y2: b, color: ctx.fillStyle});
    b += arg.h + 1;
    ctx.fillRect(a, b, 4, 1);
    if (arg.tosvg) svgdata.push({type: linetype, x1: a, y1: b, x2: a + 4, y2: b, color: ctx.fillStyle});
    b += arg.h;
    ctx.fillRect(a, b, 4, 1);
    if (arg.tosvg) svgdata.push({type: linetype, x1: a, y1: b, x2: a + 4, y2: b, color: ctx.fillStyle});
// top
    var w = ctx.measureText(arg.v1).width;
    b = densitydecorpaddingtop + 10;
    ctx.fillText(arg.v1, a - w - 3, b);
    if (arg.tosvg) svgdata.push({type: texttype, x: a - w - 3, y: b, text: arg.v1, color: ctx.fillStyle});
// middle
    b += arg.h - 5;
    ctx.fillText(arg.v2, a - 10, b);
    if (arg.tosvg) svgdata.push({type: texttype, x: a - 10, y: b, text: arg.v2, color: ctx.fillStyle});
// bottom
    w = ctx.measureText(arg.v3).width;
    b = densitydecorpaddingtop + arg.h * 2;
    ctx.fillText(arg.v3, a - w - 3, b);
    if (arg.tosvg) svgdata.push({type: texttype, x: a - w - 3, y: b, text: arg.v3, color: ctx.fillStyle});

    if (arg.tosvg) return svgdata;
}