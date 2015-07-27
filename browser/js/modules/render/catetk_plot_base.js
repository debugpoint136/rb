/*** __render__ ***/

function catetk_plot_base(data, cateInfo, startidx, stopidx, ctx, qtc, x, y, w, h, tosvg) {
    var s = [];
    for (var i = startidx; i <= stopidx; i++) {
        var c = cateInfo[data[i]][1];
        if (c) {
            ctx.fillStyle = c;
            ctx.fillRect(x, y, w, h);
            if (tosvg) {
                s.push({type: svgt_rect, x: x, y: y, w: w, h: h, fill: c});
            }
        }
        x += w;
    }
    if (tosvg) return s;
}

