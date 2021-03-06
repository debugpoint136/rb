/**
 * ===BASE===// svg // makesvg_specific.js
 * @param __Browser.prototype__
 * @param 
 */

Browser.prototype.makesvg_specific = function (param) {
    /* to be called on a browser object, either trunk or splinter
     */
    this.svg = {
        // global offset
        gx: param.gx,
        gy: (param.gy ? param.gy : 0),
        content: [],
    };
    if (param.showtklabel) {
        this.svg.gx += this.leftColumnWidth;
    }
    if (this.rulercanvas) {
        var data = this.drawRuler_browser(true);
        for (var i = 0; i < data.length; i++) {
            data[i].color = colorCentral.foreground;
            this.svgadd(data[i]);
        }
        this.svg.gy += this.rulercanvas.height;
    }

    /* all the tracks
     */
    var oldgy = this.svg.gy;
    for (var i = 0; i < this.tklst.length; i++) {
        var tk = this.tklst[i];
        if (tkishidden(tk)) continue;
        var tkh = tk_height(tk) + parseInt(tk.canvas.style.paddingBottom);
        var oldy = this.svg.gy;
        if (tk.where == 2) this.svg.gy += this.ideogram.canvas.height;
        // line on top
        this.svgadd({
            type: svgt_line_notscrollable,
            x1: 0, y1: 0, x2: this.hmSpan, y2: 0,
            color: colorCentral.foregroundDim, w: .5
        });
        // blank entire track (in case of protruding splinter tk)
        this.svgadd({type: svgt_rect_notscrollable, x: 0, y: 0, w: this.hmSpan, h: tkh, fill: 'white'});

        // clear canvas
        tk.canvas.width = tk.canvas.width;

        if (!tk.cotton || tk.ft == FT_weaver_c) {
            var data = this.drawTrack_browser(tk, true);
            for (var j = 0; j < data.length; j++) {
                this.svgadd(data[j]);
            }
        } else {
            var data = this.weaver.q[tk.cotton].drawTrack_browser(tk, true);
            for (var j = 0; j < data.length; j++) {
                this.svgadd(data[j]);
            }
        }
        this.svg.gy = oldy + tkh; // never be qtc.height as this is not numerical
    }
// to record the maximum height in this bbj
    var maxH = this.svg.gy + this.ideogram.canvas.height;
    this.svg.gy = oldgy;

    /* chr ideogram below ghm
     */
    var h = this.ideogram.canvas.height;
// need to set svg.gy to below ghm
    for (var i = 0; i < this.tklst.length; i++) {
        var t = this.tklst[i];
        if (tkishidden(t)) continue;
        if (t.where == 1) {
            this.svg.gy += tk_height(t) + parseInt(t.canvas.style.paddingBottom);
        }
    }
    if (this.entire.atbplevel) {
        // sequence, svgdata is always there
        for (var i = 0; i < this.ideogram.svgdata.length; i++) {
            this.svgadd(this.ideogram.svgdata[i]);
        }
    } else {
        // no sequence
        var data = this.drawIdeogram_browser(true);
        for (var i = 0; i < data.length; i++) {
            this.svgadd(data[i]);
        }
    }
    /* finally plot tk label and mcm, because they need to cover up the chrideogram
     on left/right side, and tk maybe
     */
    if (this.mcm) {
        // only trunk has mcm, splinter does not, need to include width of splinters for x offset
        var x = this.hmSpan;
        for (var k in this.splinters) {
            x += this.splinters[k].hmSpan + 3;
        }
        if (true) {
            // blank to mask the ruler above mcm
            this.svg.gy = 0;
            this.svgadd({
                type: svgt_rect_notscrollable, x: x, y: 0,
                w: this.mcm.lst.length * (tkAttrColumnWidth + 1),
                h: this.rulercanvas.height,
                fill: 'white'
            });
        }
        this.svg.gy = oldgy;
        var y = 0;
        for (var i = 0; i < this.tklst.length; i++) {
            var tk = this.tklst[i];
            if (tkishidden(tk) || tk.where != 1) continue;
            var data = this.drawMcm_onetrack(tk, true);
            for (var j = 0; j < data.length; j++) {
                // adjust x
                data[j].x += x;
                // set y
                data[j].y = y;
                this.svgadd(data[j]);
            }
            y += tk_height(tk);
        }
        /* y is now offset for mcm term label, always underneath mcm
         mcm label is always on bottom
         blank to mask stuff below mcm
         */
        this.svgadd({
            type: svgt_rect_notscrollable, x: x, y: y,
            w: this.mcm.lst.length * (tkAttrColumnWidth + 1),
            h: param.svgheight,
            fill: 'white'
        });
        for (var i = 0; i < this.mcm.lst.length; i++) {
            var t = this.mcm.lst[i];
            var xx = x + (tkAttrColumnWidth + 1) * i;
            var voc = gflag.mdlst[t[1]];
            this.svgadd({
                type: svgt_text_notscrollable,
                transform: "rotate(90 0 0)",
                x: 2 + y - this.svg.gx + this.svg.gy,
                y: 0 - 4 - xx - this.svg.gy - this.svg.gx,
                size: '10pt',
                text: (t[0] in voc.idx2attr ? voc.idx2attr[t[0]] : t[0])
            });
        }
    }
    if (param.showtklabel) {
        // plot tk label
        this.svg.gx = param.gx;
        this.svg.gy = this.rulercanvas.height;
        // blank out the part on left of ghm
        this.svgadd({
            type: svgt_rect_notscrollable,
            x: 0,
            y: 0,
            w: this.leftColumnWidth,
            h: param.svgheight,
            fill: 'white'
        });
        for (var i = 0; i < this.tklst.length; i++) {
            var tk = this.tklst[i];
            if (tkishidden(tk)) continue;
            var oldy = this.svg.gy;
            if (tk.where == 2) this.svg.gy += this.ideogram.canvas.height;
            var d = this.drawTrack_header(tk, true);
            for (var j = 0; j < d.length; j++) {
                this.svgadd(d[j]);
            }
            this.svg.gy = oldy + tk_height(tk);
        }
    }

    return maxH;
};

