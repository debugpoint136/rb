/**
 * ===BASE===// baseFunc // corrParam .js
 * @param __Browser.prototype__
 * @param 
 */

Browser.prototype.corrParam = function () {
    /* if doing inter-track correlation, no need to interact with CGI,
     and will return empty string
     */
    if (!this.correlation.inuse) return "";
    var tname = this.correlation.targetname;
    var obj = this.findtkobj_display(tname);
    switch (this.correlation.targetft) {
        case FT_bed_n: // bigbed
            if (obj != null && obj.mode == M_den)
                return "";
            return "&corrft=0&correlation=" + tname;
        case FT_bed_n: // bigbed (c)
            if (obj != null && obj.mode == M_den)
                return "";
            return "&corrft=1&correlation=" + obj.url;
        case FT_bedgraph_c:
        case FT_bedgraph_n:
        case FT_bigwighmtk_c:
        case FT_bigwighmtk_n:
            return "";
        case FT_qdecor_n:
            // decor
            if (obj != null)
                return "";
            return "&corrft=8&correlation=" + tname;
        default:
            fatalError("corrParam: unknown file type");
    }
};

