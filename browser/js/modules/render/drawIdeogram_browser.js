/**
 * ===BASE===// render // drawIdeogram_browser.js
 * @param __Browser.prototype__
 * @param 
 */

Browser.prototype.drawIdeogram_browser = function (tosvg) {
    if (!this.ideogram.canvas) return;
// different run mode get various graph, they override each other
    this.ideogram.canvas.width = this.entire.spnum;
    this.ideogram.canvas.height =
        this.ideogram.canvas.parentNode.parentNode.parentNode.style.height = ideoHeight + cbarHeight;
    if (this.basepairlegendcanvas) {
        this.basepairlegendcanvas.style.display = "none";
    }
    var ctx = this.ideogram.canvas.getContext('2d');
    var svgdata = [];

    if (this.genome.temporal_ymd) {
        // at day-precision, draw boxes of month
        ctx.fillStyle = colorCentral.foreground;
        var x = 0; // month offset
        var x2 = 0; // year offset
        var lastyear = null;
        for (var i = 0; i < this.regionLst.length; i++) {
            var r = this.regionLst[i];
            var w = r[5];
            ctx.fillRect(x + w, 2, 1, ideoHeight - 4);
            if (tosvg) svgdata.push({type: svgt_line, x1: x + w, y1: 2, x2: x + w, y2: ideoHeight - 4});
            var mh = parseInt(r[1] / 100);
            var w2 = ctx.measureText(month2str[mh]).width;
            var q = x + w / 2 - w2 / 2;
            if (w2 + 20 <= w) {
                ctx.fillText(month2str[mh], q, 10);
                if (tosvg) svgdata.push({type: svgt_text, x: q, y: 10, text: month2str[mh]});
            } else {
                w2 = ctx.measureText(month2sstr[mh]).width;
                if (w2 + 20 <= w) {
                    q = x + w / 2 - w2 / 2;
                    ctx.fillText(month2sstr[mh], q, 10);
                    if (tosvg) svgdata.push({type: svgt_text, x: q, y: 10, text: month2str[mh]});
                }
            }
            if (lastyear == null) {
                lastyear = r[0];
            } else if (r[0] != lastyear) {
                var q = x2 - regionSpacing.width;
                ctx.fillRect(q, ideoHeight, 1, 8);
                if (tosvg) svgdata.push({type: svgt_line, x1: q, y1: ideoHeight, x2: q, y2: ideoHeight + 8});
                w2 = ctx.measureText(lastyear).width;
                if (w2 + 10 <= x - x2) {
                    ctx.fillText(lastyear, x2 + (x - x2) / 2 - w2 / 2, this.ideogram.canvas.height);
                    if (tosvg) svgdata.push({
                        type: svgt_text,
                        x: x2 + (x - x2) / 2 - w2 / 2,
                        y: this.ideogram.canvas.height,
                        text: lastyear
                    });
                }
                lastyear = r[0];
                x2 = x;
            }
            x += w + regionSpacing.width;
        }
        w2 = ctx.measureText(lastyear).width;
        if (w2 + 10 <= x - x2) {
            ctx.fillText(lastyear, x2 + (x - x2) / 2 - w2 / 2, this.ideogram.canvas.height);
            if (tosvg) svgdata.push({
                type: svgt_text,
                x: x2 + (x - x2) / 2 - w2 / 2,
                y: this.ideogram.canvas.height,
                text: lastyear
            });
        }
        return svgdata;
    }
    if (this.juxtaposition.type == RM_protein) {
        // render without protein sequence
        return;
    }
    if (this.entire.atbplevel) {
        /*** query and display chromosomal sequence */
        var lst = [];
        // querying seq for all regions, instead of those within wings
        for (var i = 0; i < this.regionLst.length; i++) {
            var r = this.regionLst[i];
            lst.push(r[0]);
            lst.push(r[3]);
            lst.push(r[4]);
        }
        if (this.basepairlegendcanvas) {
            this.basepairlegendcanvas.style.display = "block";
            this.drawATCGlegend(true);
        }
        var bbj = this;
        if (this.genome.scaffold.fileurl) {
            this.ajax('getChromseq=on&url=' + this.genome.scaffold.fileurl + '&regionlst=' + lst.join(',') + this.genome.customgenomeparam(), function (data) {
                bbj.seq2ideogram(data);
            });
        } else if (!this.genome.iscustom && !this.genome.noblastdb) {
            this.ajax('getChromseq=on&regionlst=' + lst.join(',') + '&dbName=' + this.genome.name, function (data) {
                bbj.seq2ideogram(data);
            });
        }
        return;
    }
    if (this.is_gsv()) {
        /* gsv, drawing stack of boxes to indicate items
         item names are hidden if they are wider than the box
         */
        ctx.font = "8pt Sans-serif";
        for (var i = 0; i < this.regionLst.length; i++) {
            var r = this.regionLst[i];
            // check if to paint flank
            var fcoord = this.genesetview.flanking[r[6]];
            if (fcoord && fcoord.a5 >= 0 && fcoord.b5 >= 0) {
                // has 5' flank
                var s = this.tkcd_box({
                    ctx: ctx,
                    rid: i,
                    start: fcoord.a5,
                    stop: fcoord.b5,
                    y: 0.5,
                    h: ideoHeight - 1,
                    fill: this.genesetview.ideogram_fill5,
                    nojoin: true,
                    tosvg: tosvg,
                });
                if (tosvg) svgdata = svgdata.concat(s);
            }
            if (fcoord && fcoord.a3 >= 0 && fcoord.b3 >= 0) {
                // has 3' flank
                var s = this.tkcd_box({
                    ctx: ctx,
                    rid: i,
                    start: fcoord.a3,
                    stop: fcoord.b3,
                    y: 0.5,
                    h: ideoHeight - 1,
                    fill: this.genesetview.ideogram_fill3,
                    nojoin: true,
                    tosvg: tosvg,
                });
                if (tosvg) svgdata = svgdata.concat(s);
            }
            // bigbox
            var s = this.tkcd_box({
                ctx: ctx,
                rid: i,
                start: r[3],
                stop: r[4],
                y: 0.5,
                h: ideoHeight - 1,
                edge: this.genesetview.ideogram_stroke,
                text: r[6],
                texty: 10,
                tosvg: tosvg,
            });
            if (tosvg) svgdata = svgdata.concat(s);
        }
        this.draw_coordnote();
        return svgdata;
    }

    /* cytoband */
    ctx.font = "bold 8pt Sans-serif";
    for (var i = 0; i < this.regionLst.length; i++) {
        var r = this.regionLst[i];
        var chrcy = this.genome.cytoband[r[0]];
        if (chrcy) {
            for (var j = 0; j < chrcy.length; j++) {
                var cy = chrcy[j];
                if (Math.max(r[3], cy[0]) < Math.min(r[4], cy[1])) {
                    var a = cytoBandColor[cy[2]], b = cytoWordColor[cy[2]];
                    var s = this.tkcd_box({
                        ctx: ctx, rid: i,
                        start: cy[0],
                        stop: cy[1],
                        y: 0,
                        h: ideoHeight,
                        fill: 'rgb(' + a + ',' + a + ',' + a + ')',
                        nojoin: true,
                        text: cy[3],
                        textcolor: 'rgb(' + b + ',' + b + ',' + b + ')',
                        texty: 10,
                        tosvg: tosvg,
                    });
                    if (tosvg) svgdata = svgdata.concat(s);
                }
            }
            var s = this.tkcd_box({
                ctx: ctx, rid: i,
                start: r[3],
                stop: r[4],
                y: .5,
                h: ideoHeight - 1,
                edge: colorCentral.foreground,
                tosvg: tosvg,
            });
            if (tosvg) svgdata = svgdata.concat(s);
        } else {
            var s = this.tkcd_box({
                ctx: ctx, rid: i,
                text: 'no cytoband data',
                edge: colorCentral.foreground_faint_5,
                y: .5,
                h: ideoHeight - 1,
                start: r[3],
                stop: r[4],
                texty: 10,
            });
            if (tosvg) svgdata = svgdata.concat(s);
        }
    }

// plot chr name on second row, merging same chr names for adjacent regions
    ctx.fillStyle = colorCentral.foreground;
// chr of first region
    var previouschrname = this.regionLst[0][0];
    var previouschrstart = 0;
    var xoffset = this.cumoffset(0, this.regionLst[0][4]);
    var y = ideoHeight + 2;
    for (i = 1; i < this.regionLst.length; i++) {
        var thisr = this.regionLst[i];
        if (previouschrname != thisr[0]) {
            // plot previous chr name
            var w = ctx.measureText(previouschrname).width;
            if (w < xoffset - previouschrstart) {
                var q = previouschrstart + (xoffset - previouschrstart - w) / 2;
                ctx.fillText(previouschrname, q, y + 7);
                if (tosvg) svgdata.push({type: svgt_text, x: q, y: y + 7, text: previouschrname});
            }
            var a = xoffset,
                b = ideoHeight + 2,
                c = ideoHeight + cbarHeight - 2;
            ctx.fillRect(a, b, 1, c);
            if (tosvg) svgdata.push({type: svgt_line, x1: a, y1: b, x2: a, y2: b + c});
            previouschrname = thisr[0];
            previouschrstart = xoffset;
        }
        xoffset = this.cumoffset(i, thisr[4]);
    }
// last chr
    var a = xoffset - 1,
        b = ideoHeight + 2,
        c = ideoHeight + cbarHeight - 2;
    ctx.fillRect(a, b, 1, c);
    if (tosvg) svgdata.push({type: svgt_line, x1: a, y1: b, x2: a, y2: b + c});
    var w = ctx.measureText(previouschrname).width;
    if (w < xoffset - previouschrstart) {
        a = previouschrstart + (xoffset - previouschrstart - w) / 2;
        ctx.fillText(previouschrname, a, y + 7);
        if (tosvg) svgdata.push({type: svgt_text, x: a, y: y + 7, text: previouschrname});
    }
    this.draw_coordnote();
    return svgdata;
};


