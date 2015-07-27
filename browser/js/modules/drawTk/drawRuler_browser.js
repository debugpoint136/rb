/**
 * ===BASE===// drawTk // drawRuler_browser.js
 * @param __Browser.prototype__
 * @param 
 */

Browser.prototype.drawRuler_browser = function (tosvg) {
    /* ruler bar above genome heatmap, height is fixed
     */
    if (!this.rulercanvas) return [];
    this.rulercanvas.width = this.entire.spnum;
    this.rulercanvas.height = 20;
    var ctx = this.rulercanvas.getContext('2d');
    var h = this.rulercanvas.height;

    if (this.highlight_regions.length > 0) {
        var cl = colorCentral.hl;
        for (var j = 0; j < this.highlight_regions.length; j++) {
            var lst = this.region2showpos(this.highlight_regions[j]);
            if (!lst) continue;
            for (var i = 0; i < lst.length; i++) {
                var p = lst[i];
                if (!p[1]) continue;
                ctx.fillStyle = cl;
                ctx.fillRect(p[0], 0, p[1], h - 1);
                // always make a mark
                var center = p[0] + p[1] / 2;
                ctx.beginPath();
                ctx.moveTo(center - 8, 0);
                ctx.lineTo(center + 8, 0);
                ctx.lineTo(center, h - 1);
                ctx.closePath();
                ctx.fill();
                ctx.fillStyle = cl;
                ctx.fillRect(p[0], h - 3, p[1], 2);
            }
        }
    }
    if (this.is_gsv()) {
        // only draw hollow boxes in one row
        ctx.fillStyle = colorCentral.foreground_faint_5;
        for (var i = 0; i < this.regionLst.length; i++) {
            var x = this.cumoffset(i, this.regionLst[i][4], true);
            ctx.fillRect(x, 0, 1, h);
        }
        return [];
    }
    var previousplotstop = 0;
    var svgdata = [];
    ctx.lineWidth = 1;
    var y = h - 3.5;
    ctx.strokeStyle = ctx.fillStyle = colorCentral.foreground_faint_5;
    ctx.beginPath();
    var pastx = 0;
    for (var i = 0; i < this.regionLst.length; i++) {
        var r = this.regionLst[i];
        // mark region boundary
        var x1 = parseInt(this.cumoffset(i, r[3])) + .5;
        var svgx = x1;
        ctx.moveTo(x1, y - 1.5);
        ctx.lineTo(x1, y + 1.5);
        if (tosvg) svgdata.push({type: svgt_line, x1: x1, y1: y - 1.5, x2: x1, y2: y + 1.5});
        ctx.moveTo(x1, y);
        var incarr = this.weaver_gotgap(i);
        if (incarr) {
            for (var j = 0; j < incarr.length; j++) {
                var x2 = this.cumoffset(i, incarr[j]);
                ctx.lineTo(x2, y);
                if (tosvg) svgdata.push({type: svgt_line, x1: svgx, y1: y, x2: x2, y2: y});
                var gw = this.bp2sw(i, this.weaver.insert[i][incarr[j]]);
                if (gw >= 1) {
                    // mark gap
                    var a = parseInt(x2) + .5;
                    ctx.moveTo(a, y - 4);
                    ctx.lineTo(a, y + 4);
                    if (tosvg) svgdata.push({type: svgt_line, x1: a, y1: y - 2, x2: a, y2: y + 2});
                    a = parseInt(x2 + gw) + .5;
                    ctx.moveTo(a, y - 4);
                    ctx.lineTo(a, y + 4);
                    if (tosvg) svgdata.push({type: svgt_line, x1: a, y1: y - 2, x2: a, y2: y + 2});
                }
                ctx.moveTo(x2 + gw, y);
                svgx = x2 + gw;
            }
        }
        var x2 = parseInt(this.cumoffset(i, r[4], true)) - .5;
        ctx.lineTo(x2, y);
        if (tosvg) svgdata.push({type: svgt_line, x1: svgx, y1: y, x2: x2, y2: y});
        ctx.moveTo(x2, y - 1.5);
        ctx.lineTo(x2, y + 1.5);
        if (tosvg) svgdata.push({type: svgt_line, x1: x2, y1: y - 1.5, x2: x2, y2: y + 1.5});

        // bp span within the on screen width of a region
        var bpspan = r[4] - r[3];
        var plotwidth = this.bp2sw(i, bpspan);
        var u = Math.pow(10, 10);
        while (u > bpspan / (plotwidth / 100)) {
            u /= 10;
        }
        for (var j = Math.ceil(r[3] / u); j <= Math.floor(r[4] / u); j++) {
            var v = u * j; // coord
            var x = this.cumoffset(i, v, true) + .5;
            var w = ctx.measureText(v).width;
            if (w / 2 + 10 <= x - pastx) {
                ctx.fillText(v, x - w / 2, 10);
                if (tosvg) svgdata.push({type: svgt_text, x: x - w / 2, y: 10, text: v});
                ctx.moveTo(parseInt(x) + .5, 12);
                ctx.lineTo(parseInt(x) + .5, h - 3);
                if (tosvg) svgdata.push({type: svgt_line, x1: x, y1: 12, x2: x, y2: h - 3});
                pastx = x + w / 2;
            } else {
                ctx.moveTo(parseInt(x) + .5, 14);
                ctx.lineTo(parseInt(x) + .5, h - 3);
                if (tosvg) svgdata.push({type: svgt_line, x1: x, y1: 15, x2: x, y2: h - 3});
            }
        }
    }
    ctx.stroke();
    if (tosvg) return svgdata;
};


