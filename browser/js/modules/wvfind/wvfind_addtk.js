/**
 * ===BASE===// wvfind // wvfind_addtk.js
 * @param __Browser.prototype__
 * @param 
 */

Browser.prototype.wvfind_addtk = function (tk, wvobj) {
    var tk2 = null;
    switch (tk.ft) {
        case FT_bedgraph_c:
        case FT_bedgraph_n:
        case FT_bigwighmtk_c:
        case FT_bigwighmtk_n:
        case FT_qdecor_n:
        case FT_cat_n:
        case FT_cat_c:
            tk2 = duplicateTkobj(tk);
            tk2.mode = M_show;
            break;
        case FT_anno_n:
        case FT_anno_c:
        case FT_bed_n:
        case FT_bed_c:
        case FT_bam_n:
        case FT_bam_c:
            tk2 = duplicateTkobj(tk);
            tk2.mode = M_den;
            break;
        default:
            print2console(FT2verbal[tk.ft] + ' track is not supported at the moment', 2);
            return;
    }
    var gn = this.genome.name;
    if (!(gn in wvobj.tracks)) {
        wvobj.tracks[gn] = {};
    }
    wvobj.tracks[gn][tk.name] = tk2;
// collect regions
    var rlst = [];
    for (var i = 0; i < wvobj.rlst.length; i++) {
        var e = wvobj.rlst[0];
        if (gn == wvobj.target[0]) {
            rlst.push([e.chr, e.start, e.stop]);
        } else {
            var hits = e.hit[gn];
            // XXX
            if (hits && hits.length > 0) {
            }
        }
    }
};

/** __wvfind__ ends **/

