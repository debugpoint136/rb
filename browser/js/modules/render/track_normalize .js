/**
 * ===BASE===// render // track_normalize .js
 * @param __Browser.prototype__
 * @param 
 */

Browser.prototype.track_normalize = function (tk, v) {
    /* normalize a value given rules in a track
     TODO this is rpm/bp, apply other rules
     */
    if (!tk.normalize) return v;
    v = v * 1000000 / tk.normalize.total_mapped_reads;
    if (this.entire.atbplevel) return v;
    return v /= this.entire.summarySize;
};


