function plot_ruler(param) {
    /*
     .ctx
     .start, .stop: plotting position
     .min, .max: values
     .horizontal: boolean
     if true, ruler opens to bottom
     start/stop are x coord
     requires .yoffset
     if false, ruler opens to left
     start/stop are y coord
     requires .xoffset
     */
// for svg
    var svgdata = [];
    var svtext = param.scrollable ? svgt_text : svgt_text_notscrollable;
    var svline = param.scrollable ? svgt_line : svgt_line_notscrollable;
    var a, b, c, d;

    var ctx = param.ctx;
    ctx.fillStyle = param.color;
    if (param.min == null || param.max == null) {
        // no data in view range
        return svgdata;
    }
    if (param.min > param.max) {
        param.max = param.min;
    }
    var ticksize = 4;
    var unit = 10;
    var total = param.max - param.min;
    while (Math.pow(10, unit) > total / 3) {
        unit--;
    }
    unit = Math.pow(10, unit);
    var sf; // px per value
    var aa, bb;
    if (param.horizontal) {
        a = param.start;
        b = param.yoffset;
        ctx.fillRect(a, b, 1, ticksize);
        if (param.tosvg) svgdata.push({type: svline, x1: a, y1: b, x2: a, y2: b + ticksize, color: param.color});
        a = param.start;
        b = param.yoffset;
        c = param.stop - param.start;
        ctx.fillRect(a, b, c, 1);
        if (param.tosvg) svgdata.push({type: svline, x1: a, y1: b, x2: a + c, y2: b, color: param.color});
        a = param.stop;
        b = param.yoffset;
        ctx.fillRect(a, b, 1, ticksize);
        if (param.tosvg) svgdata.push({type: svline, x1: a, y1: b, x2: a, y2: b + ticksize, color: param.color});

        var s = neatstr(param.min);
        a = param.start;
        b = param.yoffset + ticksize + 10;
        ctx.fillText(s, a, b);
        if (param.tosvg) svgdata.push({type: svtext, x: a, y: b, text: s, color: param.color});

        aa = param.start + ctx.measureText(s).width; // later use

        s = neatstr(param.max);
        var w = ctx.measureText(s).width;
        a = param.stop - w;
        b = param.yoffset + ticksize + 10;
        ctx.fillText(s, a, b);
        if (param.tosvg) svgdata.push({type: svtext, x: a, y: b, text: s, color: param.color});

        bb = param.stop - w;

        sf = (param.stop - param.start) / (param.max - param.min);
    } else {
        // min tick
        a = param.xoffset - ticksize;
        b = param.start;
        ctx.fillRect(a, b, ticksize, 1);
        if (param.tosvg) svgdata.push({type: svline, x1: a, y1: b, x2: a + ticksize, y2: b, color: param.color});
        // vertical line
        a = param.xoffset;
        b = param.stop;
        c = param.start - param.stop + 1;
        ctx.fillRect(a, b, 1, c);
        if (param.tosvg) svgdata.push({type: svline, x1: a, y1: b, x2: a, y2: b + c, color: param.color});
        // max tick
        a = param.xoffset - ticksize;
        b = param.stop;
        ctx.fillRect(a, b, ticksize, 1);
        if (param.tosvg) svgdata.push({type: svline, x1: a, y1: b, x2: a + ticksize, y2: b, color: param.color});
        // min v
        var s = neatstr(param.min);
        a = param.xoffset - ticksize - ctx.measureText(s).width - 2;
        b = param.start;
        ctx.fillText(s, a, b);
        if (param.tosvg) svgdata.push({type: svtext, x: a, y: b, text: s, color: param.color});

        aa = param.start - 10;

        // max v
        s = neatstr(param.max);
        a = param.xoffset - ticksize - ctx.measureText(s).width - 2;
        b = param.stop + 10 + (param.max_offset ? param.max_offset : 0);
        ctx.fillText(s, a, b);
        if (param.tosvg) svgdata.push({type: svtext, x: a, y: b, text: s, color: param.color});

        bb = param.stop + 10;

        sf = (param.start - param.stop) / (param.max - param.min);
    }
    if (param.extremeonly) {
        // try to put 0
        if (param.min < 0 && param.max > 0) {
            if (param.horizontal) {
            } else {
                a = param.xoffset - ticksize;
                b = param.stop + (param.start - param.stop) * param.max / (param.max - param.min);
                ctx.fillRect(a, b, ticksize, 1);
                if (param.tosvg) svgdata.push({
                    type: svline,
                    x1: a,
                    y1: b,
                    x2: a + ticksize,
                    y2: b,
                    color: param.color
                });
            }
        }
        return svgdata;
    }
    for (var i = Math.ceil(param.min / unit); i <= Math.floor(param.max / unit); i++) {
        var value = unit * i;
        var str = neatstr(value);
        if (param.horizontal) {
            var x = (value - param.min) * sf + param.start;
            a = param.yoffset;
            ctx.fillRect(x, a, 1, ticksize);
            if (svgdata) svgdata.push({type: svline, x1: x, y1: a, x2: x, y2: a + ticksize, color: param.color});
            var w = ctx.measureText(str).width;
            if (x - aa > w / 2 + 2 && bb - x > w / 2 + 2) {
                a = x - w / 2;
                b = param.yoffset + ticksize + 10;
                ctx.fillText(str, a, b);
                if (param.tosvg) svgdata.push({type: svtext, x: a, y: b, text: str, color: param.color});
                aa = x + w / 2;
            }
        } else {
            var y = param.start - (value - param.min) * sf;
            a = param.xoffset - ticksize;
            ctx.fillRect(a, y, ticksize, 1);
            if (param.tosvg) svgdata.push({type: svline, x1: a, y1: y, x2: a + ticksize, y2: y, color: param.color});
            if (aa - y > 7 && y - bb > 7) {
                a = param.xoffset - ticksize - 2 - ctx.measureText(str).width;
                b = y + 5;
                ctx.fillText(str, a, b);
                if (param.tosvg) svgdata.push({type: svtext, x: a, y: b, text: str, color: param.color});
                aa = y - 5;
            }
        }
    }
    return svgdata;
}