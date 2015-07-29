/**
 * ===BASE===// render // tkplot_line .js
 * @param __Browser.prototype__
 * @param 
 */

Browser.prototype.tkplot_line = function (p) {
    /*
     .x/y: start position
     .w: unit width
     .h: plot range height
     .tk: {data:[], normalize:null}
     */
    p.ctx.strokeStyle = p.color;
    p.ctx.lineWidth = p.linewidth;
    var svgdata = [];
    var pasth = null;
    var x = p.x;
    var sf = p.h / (p.max - p.min);
    p.ctx.beginPath();
    for (var i = 0; i < this.regionLst.length; i++) {
        var r = this.regionLst[i];
        var stop = this.entire.atbplevel ? (r[4] - r[3]) : r[5];
        var w = p.w;
        var initcoord = r[3];
        if (r[8]) {
            if (r[8].item.hsp.strand == '-') {
                w = -w;
            }
            // disregard p.x, but must not use [8].canvasxoffset
            x = this.cumoffset(i, initcoord);
        }

        var insertlookup = null;
        if (this.weaver) {
            if (this.entire.atbplevel) {
                insertlookup = this.weaver.insert[i];
            } else {
                insertlookup = {};
                for (var c in this.weaver.insert[i]) {
                    insertlookup[c] = this.weaver.insert[i][c];
                }
            }
        }

        for (var j = 0; j < stop; j++) {
            var v = p.tk.data[i][j];
            if (isNaN(v)) {
                pasth = null;
            } else {
                v = this.track_normalize(p.tk, v);
                var h = sf * (v - p.min);
                var b, // past bar y
                    d; // current bar y
                if (p.pointup) {
                    b = p.y + p.h - pasth;
                    d = p.y + p.h - h;
                } else {
                    b = p.y + pasth;
                    d = p.y + h;
                }
                if (pasth != null) {
                    p.ctx.moveTo(x, b);
                    p.ctx.lineTo(x, d);
                    if (p.tosvg) svgdata.push({
                        type: svgt_line,
                        x1: x,
                        y1: b,
                        x2: x,
                        y2: d,
                        color: p.color,
                        w: p.linewidth
                    });
                }
                p.ctx.moveTo(x, d);
                p.ctx.lineTo(x + w, d);
                if (p.tosvg) svgdata.push({
                    type: svgt_line,
                    x1: x,
                    y1: d,
                    x2: x + w,
                    y2: d,
                    color: p.color,
                    w: p.linewidth
                });
                pasth = h;
            }
            x += w;

            if (insertlookup) {
                if (this.entire.atbplevel) {
                    initcoord += 1;
                    if (initcoord in insertlookup) {
                        // negative w for reverse
                        x += insertlookup[initcoord] * this.entire.bpwidth * (w > 0 ? 1 : -1);
                    }
                } else {
                    initcoord += r[7];
                    for (var k = 0; k <= parseInt(r[7]); k++) {
                        var thisbp = parseInt(initcoord + k);
                        if (thisbp in insertlookup) {
                            // negative w for reverse
                            x += insertlookup[thisbp] / r[7] * (w > 0 ? 1 : -1);
                            delete insertlookup[thisbp];
                        }
                    }
                }
            }

        }
        x += regionSpacing.width;
    }
    p.ctx.stroke();
    if (p.tosvg) return svgdata;
};

