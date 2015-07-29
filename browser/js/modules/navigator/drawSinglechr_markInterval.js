/**
 * ===BASE===// navigator // drawSinglechr_markInterval .js
 * @param __Genome.prototype__
 * @param 
 */

Genome.prototype.drawSinglechr_markInterval = function (canvas, chrom, start, stop, chromheight, hlspacing) {
    /* chrom bar fills entire canvas, with a blue box marking out a region
     args:
     canvas: <dom>
     chrom: name
     start/stop: highlight position
     chromheight: px of chr bar
     hlspacing:
     */
    var ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    var cL = this.scaffold.len[chrom];
    if (cL == undefined) {
        print2console('c18 cannot draw: unknown chr ' + chrom, 2);
        return;
    }
    if (start < 0 || start >= cL || stop <= start || stop > cL) {
        // do not squawk, it could be splinter is showing data over two chromosomes!!
        return;
    }
    ctx.lineWidth = 1;
    drawIdeogramSegment_simple(
        this.getcytoband4region2plot(chrom, 0, cL, canvas.width - 1),
        ctx, 0, hlspacing, canvas.width - 1, chromheight, false);
    var sf = canvas.width / cL;
    ctx.strokeStyle = 'blue';
    ctx.strokeRect(start * sf, .5, (stop - start) * sf, chromheight + 2 * hlspacing + 1);
};


/*** __navi__ ends ***/


