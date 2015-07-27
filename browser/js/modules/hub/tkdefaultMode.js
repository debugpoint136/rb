/**
 * @param o
 */

function tkdefaultMode(o) {
    /* args: 1. tk obj, 2. native mdvidx2attr
     only for decors
     don't die when called upon hmtks
     */
    if (o.defaultmode != undefined) {
        if (typeof(o.defaultmode == 'string')) {
            return parse_tkmode(o.defaultmode);
        }
        return o.defaultmode;
    }
    switch (o.ft) {
        case FT_bed_c:
        case FT_bed_n:
        case FT_anno_n:
        case FT_anno_c:
            return M_full;
        case FT_qdecor_n:
        case FT_bigwighmtk_n:
        case FT_bigwighmtk_c:
        case FT_bedgraph_n:
        case FT_bedgraph_c:
        case FT_cat_n:
        case FT_cat_c:
        case FT_matplot:
        case FT_catmat:
        case FT_qcats:
        case FT_weaver_c:
            return M_show;
        case FT_lr_c:
        case FT_lr_n:
            return M_arc;
        case FT_sam_c:
        case FT_sam_n:
        case FT_bam_c:
        case FT_bam_n:
            return M_den;
        case FT_ld_c:
        case FT_ld_n:
            return M_trihm;
        case FT_cm_c:
            return M_show;
        default:
            print2console('unexpected ft: ' + o.ft, 2);
            return M_show;
    }
}