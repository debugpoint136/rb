/**
 * @param ft
 */

function isCustom(ft) {
    switch (ft) {
        case FT_cat_c:
        case FT_bedgraph_c:
        case FT_bigwighmtk_c:
        case FT_bed_c:
        case FT_sam_c:
        case FT_bam_c:
        case FT_lr_c:
        case FT_cm_c:
        case FT_ld_c:
        case FT_anno_c:
        case FT_weaver_c:
        case FT_matplot:
        case FT_catmat:
        case FT_qcats:
            return true;
        default:
            return false;
    }
}
