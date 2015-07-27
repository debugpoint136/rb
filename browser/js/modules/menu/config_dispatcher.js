/**
 * ===BASE===// menu // config_dispatcher.js
 * @param 
 */

function config_dispatcher(tk) {
    if (tk.mode == M_den) {
        config_density(tk);
        return;
    }
    switch (tk.ft) {
        case FT_matplot:
            config_matplot(tk);
            break;
        case FT_cm_c:
            config_cmtk(tk);
            break;
        case FT_bedgraph_c:
        case FT_bedgraph_n:
        case FT_bigwighmtk_c:
        case FT_bigwighmtk_n:
        case FT_qdecor_n:
            config_numerical(tk);
            break;
        case FT_cat_c:
        case FT_cat_n:
        case FT_catmat:
        case FT_qcats:
            config_cat(tk);
            break;
        case FT_bed_c:
        case FT_bed_n:
        case FT_anno_n:
        case FT_anno_c:
            config_hammock(tk);
            break;
        case FT_lr_n:
        case FT_lr_c:
            config_lr(tk);
            break;
        case FT_bam_c:
        case FT_bam_n:
            config_bam(tk);
            break;
        case FT_ld_c:
        case FT_ld_n:
            config_ld(tk);
            break;
        case FT_weaver_c:
            config_weaver(tk);
            break;
        default:
            fatalError('single tk unknown ft');
    }
}


