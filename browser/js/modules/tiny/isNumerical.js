/**
 * including density mode
 * @param tkobj
 * @return false
 */

function isNumerical(tkobj) {
// including density mode
    var ft = tkobj.ft;
    if (ft == FT_bedgraph_c || ft == FT_bedgraph_n || ft == FT_bigwighmtk_c || ft == FT_bigwighmtk_n || ft == FT_qdecor_n) return true;
    if (tkobj.mode == M_den) return true;
    return false;
}