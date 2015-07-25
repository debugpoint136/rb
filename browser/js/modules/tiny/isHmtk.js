/**
 * @param ft
 */

function isHmtk(ft) {
// not good
    switch (ft) {
        case FT_bedgraph_c:
            return true;
        case FT_bedgraph_n:
            return true;
        case FT_cat_c:
            return true;
        case FT_cat_n:
            return true;
        case FT_bigwighmtk_c:
            return true;
        case FT_bigwighmtk_n:
            return true;
        default:
            return false;
    }
}