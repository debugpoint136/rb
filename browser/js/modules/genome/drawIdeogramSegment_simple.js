/**
 * only draws data within a region
 * data: getcytoband4region2plot() output
 * x/y: starting plot position on canvas, must be integer
 * plotwidth: entire plotting width, only used to draw the blank rectangle
 * @param data
 * @param ctx
 * @param x
 * @param y
 * @param plotwidth
 * @param plotheight
 * @param tosvg
 * @return svgdata <br><br><br>
 */

function drawIdeogramSegment_simple(data, ctx, x, y, plotwidth, plotheight, tosvg) {
    /* only draws data within a region
     args:
     data: getcytoband4region2plot() output
     x/y: starting plot position on canvas, must be integer
     plotwidth: entire plotting width, only used to draw the blank rectangle
     */
    ctx.font = "bold 8pt Sans-serif";
    var mintextheight = 13;
    if (typeof(data) == 'string') {
        // no cytoband data
        var svgdata = [];
        ctx.strokeStyle = colorCentral.foreground;
        ctx.strokeRect(x, y + 0.5, plotwidth, plotheight);
        if (tosvg) svgdata.push({
            type: svgt_rect,
            x: x,
            y: y + .5,
            w: plotwidth,
            h: plotheight,
            stroke: ctx.strokeStyle
        });
        ctx.fillStyle = colorCentral.foreground;
        var s = data; // is chrom name
        var w = ctx.measureText(s).width;
        if (w <= plotwidth && plotheight >= mintextheight) {
            var y2 = y + 10 + (plotheight - mintextheight) / 2;
            ctx.fillText(s, x + (plotwidth - w) / 2, y2);
            if (tosvg) svgdata.push({type: svgt_text, x: x + (plotwidth - w) / 2, y: y2, text: s, bold: true});
        }
        return svgdata;
    }
    var svgdata = [];
    var previousIsCentromere = null;
    for (var i = 0; i < data.length; i++) {
        var band = data[i];
        if (band[2] >= 0) {
            ctx.fillStyle = 'rgb(' + cytoBandColor[band[2]] + ',' + cytoBandColor[band[2]] + ',' + cytoBandColor[band[2]] + ')';
            ctx.fillRect(x, y, band[1], plotheight);
            if (tosvg) svgdata.push({type: svgt_rect, x: x, y: y, w: band[1], h: plotheight, fill: ctx.fillStyle});
            ctx.strokeStyle = colorCentral.foreground;
            ctx.beginPath();
            ctx.moveTo(x, 0.5 + y);
            ctx.lineTo(x + band[1], 0.5 + y);
            ctx.moveTo(x, plotheight - 0.5 + y);
            ctx.lineTo(x + band[1], plotheight - 0.5 + y);
            ctx.stroke();
            if (tosvg) {
                svgdata.push({type: svgt_line, x1: x, y1: y + .5, x2: x + band[1], y2: y + .5});
                svgdata.push({
                    type: svgt_line,
                    x1: x,
                    y1: plotheight - 0.5 + y,
                    x2: x + band[1],
                    y2: plotheight - 0.5 + y
                });
            }
            var w = ctx.measureText(band[0]).width;
            if (w < band[1] && plotheight >= mintextheight) {
                ctx.fillStyle = 'rgb(' + cytoWordColor[band[2]] + ',' + cytoWordColor[band[2]] + ',' + cytoWordColor[band[2]] + ')';
                var y2 = y + 10 + (plotheight - mintextheight) / 2;
                ctx.fillText(band[0], x + (band[1] - w) / 2, y2);
                if (tosvg) svgdata.push({
                    type: svgt_text,
                    x: x + (band[1] - w) / 2,
                    y: y2,
                    text: band[0],
                    color: ctx.fillStyle,
                    bold: true
                });
            }
            if (previousIsCentromere == true) {
                ctx.fillStyle = colorCentral.foreground;
                ctx.fillRect(x, y, 1, plotheight);
                if (tosvg) svgdata.push({type: svgt_line, x1: x, y1: y, x2: x, y2: y + plotheight});
            }
            previousIsCentromere = false;
        } else {
            ctx.fillStyle = centromereColor;
            ctx.fillRect(x, 3 + y, band[1], plotheight - 5);
            if (tosvg) svgdata.push({
                type: svgt_rect,
                x: x,
                y: y + 3,
                w: band[1],
                h: plotheight - 5,
                fill: ctx.fillStyle
            });
            var w = ctx.measureText('centromere').width;
            if (w < band[1]) {
                ctx.fillStyle = 'white';
                ctx.fillText('centromere', x + (band[1] - w) / 2, 10 + y);
                if (tosvg) svgdata.push({
                    type: svgt_text,
                    x: x + (band[1] - w) / 2,
                    y: y + 10,
                    color: ctx.fillStyle,
                    text: 'centromere',
                    bold: true
                });
            }
            if (previousIsCentromere == false) {
                ctx.fillStyle = colorCentral.foreground;
                ctx.fillRect(x - 1, y, 1, plotheight);
                if (tosvg) svgdata.push({type: svgt_line, x1: x - 1, y1: y, x2: x - 1, y2: y + plotheight});
            }
            previousIsCentromere = true;
        }
        if (band[3]) {
            // enclose head
            ctx.fillStyle = colorCentral.foreground;
            ctx.fillRect(x, y, 1, plotheight);
            if (tosvg) svgdata.push({type: svgt_line, x1: x, y1: y, x2: x, y2: y + plotheight});
        }
        if (band[4]) {
            // enclose tail
            ctx.fillStyle = colorCentral.foreground;
            ctx.fillRect(x + band[1], y, 1, plotheight);
            if (tosvg) svgdata.push({type: svgt_line, x1: x + band[1], y1: y, x2: x + band[1], y2: y + plotheight});
        }
        x += band[1];
    }
    return svgdata;
}

