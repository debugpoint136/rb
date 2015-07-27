/**
 * ===BASE===// track // tk_applydefaultstyle.js
 * @param 
 */

function tk_applydefaultstyle(tk) {
    if (!tk.qtc) {
        tk.qtc = {};
    }
    switch (tk.ft) {
        case FT_bed_n:
        case FT_anno_n:
        case FT_sam_n:
        case FT_bam_n:
        case FT_lr_n:
        case FT_ld_n:
        case FT_bed_c:
        case FT_anno_c:
            qtc_paramCopy(defaultQtcStyle.density, tk.qtc);
            qtc_paramCopy(defaultQtcStyle.anno, tk.qtc);
            break;
        case FT_weaver_c:
            tk.qtc.bedcolor = weavertkcolor_query;
            tk.qtc.height = 60;
            break;
        case FT_bedgraph_n:
            qtc_paramCopy(defaultQtcStyle.heatmap, tk.qtc);
            break;
        case FT_bedgraph_c:
            qtc_paramCopy(defaultQtcStyle.ft3, tk.qtc);
            break;
        case FT_sam_c:
        case FT_bam_c:
            qtc_paramCopy(defaultQtcStyle.density, tk.qtc);
            var ss = defaultQtcStyle.ft5;
            tk.qtc.textcolor = ss.textcolor;
            tk.qtc.fontsize = ss.fontsize;
            tk.qtc.fontfamily = ss.fontfamily;
            tk.qtc.fontbold = ss.fontbold;
            tk.qtc.forwardcolor = ss.forwardcolor;
            tk.qtc.reversecolor = ss.reversecolor;
            tk.qtc.mismatchcolor = ss.mismatchcolor;
            break;
        case FT_qdecor_n:
            qtc_paramCopy(defaultQtcStyle.ft8, tk.qtc);
            break;
        case FT_lr_c:
        case FT_ld_c:
            qtc_paramCopy(defaultQtcStyle.interaction, tk.qtc);
            break;
        case FT_cat_n:
            qtc_paramCopy(defaultQtcStyle.ft12, tk.qtc);
            break;
        case FT_cat_c:
            qtc_paramCopy(defaultQtcStyle.ft13, tk.qtc);
            break;
        case FT_bigwighmtk_n:
        case FT_bigwighmtk_c:
            qtc_paramCopy(defaultQtcStyle.ft3, tk.qtc);
            break;
        case FT_matplot:
            tk.qtc.height = 200;
            break;
        case FT_cm_c:
            tk.qtc = {height: 50};
            break;
        case FT_catmat:
            break;
        case FT_qcats:
            tk.qtc = {height: 100};
            break;
        default:
            fatalError('trying to assign default style but got unknown tk ft ' + tk.ft);
    }
}


