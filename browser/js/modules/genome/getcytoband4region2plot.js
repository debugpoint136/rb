/**
 * given a query region, find cytoband data in it <br>
 for each band returns [name, plot length (pixel), coloridx, athead(bool), attail(bool)] <br>
 plotwidth: on screen width of this interval
 * @param chrom
 * @param start
 * @param stop
 * @param plotwidth
 * @return result <br><br><br>
 */

Genome.prototype.getcytoband4region2plot = function (chrom, start, stop, plotwidth) {
    /* given a query region, find cytoband data in it
     for each band returns [name, plot length (pixel), coloridx, athead(bool), attail(bool)]
     plotwidth: on screen width of this interval
     */
    if (!(chrom in this.cytoband)) return chrom;
    var sf = plotwidth / (stop - start);
    var result = [];
    var elen = this.scaffold.len[chrom];
    for (var i = 0; i < this.cytoband[chrom].length; i++) {
        var b = this.cytoband[chrom][i];
        if (Math.max(start, b[0]) < Math.min(stop, b[1])) {
            var thisstart = Math.max(start, b[0]);
            var thisstop = Math.min(stop, b[1]);
            result.push([b[3], (thisstop - thisstart) * sf, b[2], thisstart == 0, thisstop == elen]);
        }
    }
    return result;
};
