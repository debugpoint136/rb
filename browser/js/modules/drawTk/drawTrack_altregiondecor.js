/**
 * ===BASE===// drawTk // drawTrack_altregiondecor.js
 * @param __Browser.prototype__
 * @param 
 */

Browser.prototype.drawTrack_altregiondecor = function (ctx, height, tosvg) {
    if (this.juxtaposition.type == this.genome.defaultStuff.runmode) return [];
    var svgdata = [];
    for (var i = 0; i < this.regionLst.length; i++) {
        var x1 = this.cumoffset(i, this.regionLst[i][3]),
            x2 = this.cumoffset(i, this.regionLst[i][4]);
        if (i % 2) {
            ctx.fillStyle = colorCentral.background_faint_5;
            ctx.fillRect(x1, 0, x2 - x1, height);
        }
        ctx.fillStyle = regionSpacing.color;
        ctx.fillRect(x2, 0, 1, height);
        if (tosvg) svgdata.push({type: svgt_line, x1: x2, y1: 0, x2: x2, y2: height, w: 1, color: ctx.fillStyle});
    }
    return svgdata;
};


