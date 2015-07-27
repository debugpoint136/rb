/**
 * ===BASE===// baseFunc // trackParam.js
 * @param 
 */

function trackParam(_tklst, nocotton) {
    /* nocotton: no cottontk
     noweavertk: no FT_weaver_c, use when weaving is disabled at large view range
     */
    var lst = [];
    lst[FT_bedgraph_c] = [];
    lst[FT_bedgraph_n] = [];
    lst[FT_bigwighmtk_c] = [];
    lst[FT_bigwighmtk_n] = [];
    lst[FT_bam_n] = [];
    lst[FT_bam_c] = [];
    lst[FT_sam_n] = [];
    lst[FT_sam_c] = [];
    lst[FT_bed_n] = [];
    lst[FT_bed_c] = [];
    lst[FT_cat_c] = [];
    lst[FT_cat_n] = [];
    lst[FT_lr_n] = [];
    lst[FT_lr_c] = [];
    lst[FT_qdecor_n] = [];
    lst[FT_weaver_c] = [];
    lst[FT_ld_c] = [];
    lst[FT_ld_n] = [];
    lst[FT_anno_n] = [];
    lst[FT_anno_c] = [];
    lst[FT_catmat] = [];
    lst[FT_qcats] = [];
    for (var i = 0; i < _tklst.length; i++) {
        var t = _tklst[i];
        if (nocotton && t.cotton && t.ft != FT_weaver_c) {
            continue;
        }
        var name = t.name;
        var mode = t.mode;
        var url = t.url;
        var label = t.label;
        var summ = (!t.qtc || t.qtc.summeth == undefined) ? summeth_mean : t.qtc.summeth;
        switch (t.ft) {
            case FT_bedgraph_c:
                lst[FT_bedgraph_c].push(name + ',' + label + ',' + url + ',' + mode + ',' + summ);
                break;
            case FT_bedgraph_n:
                lst[FT_bedgraph_n].push(name + ',' + url + ',' + mode + ',' + summ);
                break;
            case FT_bigwighmtk_c:
                lst[FT_bigwighmtk_c].push(name + ',' + label + ',' + url + ',' + mode + ',' + summ);
                break;
            case FT_bigwighmtk_n:
                lst[FT_bigwighmtk_n].push(name + ',' + url + ',' + mode + ',' + summ);
                break;
            case FT_cat_n:
                lst[FT_cat_n].push(name + ',' + url + ',' + mode);
                break;
            case FT_cat_c:
                lst[FT_cat_c].push(name + ',' + label + ',' + url + ',' + mode);
                break;
            case FT_bed_n:
                lst[FT_bed_n].push(name + ',' + url + ',' + mode);
                break;
            case FT_bed_c:
                lst[FT_bed_c].push(name + ',' + label + ',' + url + ',' + mode);
                break;
            case FT_bam_n:
                lst[FT_bam_n].push(name + ',' + url + ',' + mode);
                break;
            case FT_bam_c:
                lst[FT_bam_c].push(name + ',' + label + ',' + url + ',' + mode);
                break;
            case FT_lr_n:
                lst[FT_lr_n].push(name + ',' + url + ',' + mode + ',' + t.qtc.pfilterscore + ',' + t.qtc.nfilterscore);
                break;
            case FT_lr_c:
                lst[FT_lr_c].push(name + ',' + label + ',' + url + ',' + mode + ',' + t.qtc.pfilterscore + ',' + t.qtc.nfilterscore);
                break;
            case FT_ld_c:
                lst[FT_ld_c].push(name + ',' + label + ',' + url);
                break;
            case FT_ld_n:
                lst[FT_ld_n].push(name + ',' + url);
                break;
            case FT_matplot:
                break;
            case FT_cm_c:
                break;
            case FT_anno_n:
                lst[FT_anno_n].push(name + ',' + url + ',' + mode);
                break;
            case FT_anno_c:
                lst[FT_anno_c].push(name + ',' + label + ',' + url + ',' + mode);
                break;
            case FT_catmat:
                lst[FT_catmat].push(name + ',' + label + ',' + url + ',' + mode);
                break;
            case FT_qcats:
                lst[FT_qcats].push(name + ',' + label + ',' + url + ',' + mode);
                break;
            case FT_weaver_c:
                lst[FT_weaver_c].push(name + ',' + label + ',' + url + ',' + t.weaver.mode);
                break;
            default:
                fatalError('trackParam: unknown ft ' + t.ft);
        }
    }
    return '' +
        (lst[FT_bedgraph_n].length > 0 ? '&hmtk2=' + lst[FT_bedgraph_n].join(',') : '') +
        (lst[FT_bedgraph_c].length > 0 ? '&hmtk3=' + lst[FT_bedgraph_c].join(",") : '') +
        (lst[FT_bigwighmtk_n].length > 0 ? '&hmtk14=' + lst[FT_bigwighmtk_n].join(',') : '') +
        (lst[FT_bigwighmtk_c].length > 0 ? '&hmtk15=' + lst[FT_bigwighmtk_c].join(',') : '') +
        (lst[FT_cat_n].length > 0 ? '&hmtk12=' + lst[FT_cat_n].join(',') : '') +
        (lst[FT_cat_c].length > 0 ? '&hmtk13=' + lst[FT_cat_c].join(",") : '') +
        (lst[FT_bed_n].length > 0 ? '&decor0=' + lst[FT_bed_n].join(',') : '') +
        (lst[FT_bed_c].length > 0 ? '&decor1=' + lst[FT_bed_c].join(',') : '') +
        (lst[FT_lr_n].length > 0 ? '&decor9=' + lst[FT_lr_n].join(',') : '') +
        (lst[FT_lr_c].length > 0 ? '&decor10=' + lst[FT_lr_c].join(',') : '') +
        (lst[FT_qdecor_n].length > 0 ? '&decor8=' + lst[FT_qdecor_n].join(',') : '') +
        (lst[FT_sam_n].length > 0 ? '&decor4=' + lst[FT_sam_n].join(',') : '') +
        (lst[FT_sam_c].length > 0 ? '&decor5=' + lst[FT_sam_c].join(',') : '') +
        (lst[FT_bam_n].length > 0 ? '&decor17=' + lst[FT_bam_n].join(',') : '') +
        (lst[FT_bam_c].length > 0 ? '&decor18=' + lst[FT_bam_c].join(',') : '') +
        (lst[FT_ld_c].length > 0 ? '&track23=' + lst[FT_ld_c].join(',') : '') +
        (lst[FT_ld_n].length > 0 ? '&track26=' + lst[FT_ld_n].join(',') : '') +
        (lst[FT_weaver_c].length > 0 ? '&track21=' + lst[FT_weaver_c].join(',') : '') +
        (lst[FT_anno_n].length > 0 ? '&track24=' + lst[FT_anno_n].join(',') : '') +
        (lst[FT_anno_c].length > 0 ? '&track25=' + lst[FT_anno_c].join(',') : '') +
        (lst[FT_catmat].length > 0 ? '&track20=' + lst[FT_catmat].join(',') : '') +
        (lst[FT_qcats].length > 0 ? '&track27=' + lst[FT_qcats].join(',') : '');
}


