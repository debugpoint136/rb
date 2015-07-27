/**
 * ===BASE===// custtk // custtk_useexample.js
 * @param 
 */

function custtk_useexample(ft) {
    var info = apps.custtk.bbj.genome.defaultStuff.custtk;
    if (!(ft in info)) {
        print2console('Not available for this track type.', 2);
        return;
    }
    var c = apps.custtk.bbj.genome.custtk;
    switch (ft) {
        case FT_bed_c:
            c.ui_bed.input_url.value = info[ft].url;
            c.ui_bed.input_name.value = info[ft].name;
            return;
        case FT_bedgraph_c:
            c.ui_bedgraph.input_url.value = info[ft].url;
            c.ui_bedgraph.input_name.value = info[ft].name;
            return;
        case FT_bam_c:
            c.ui_bam.input_url.value = info[ft].url;
            c.ui_bam.input_name.value = info[ft].name;
            return;
        case FT_lr_c:
            c.ui_lr.input_url.value = info[ft].url;
            c.ui_lr.input_name.value = info[ft].name;
            return;
        case FT_bigwighmtk_c:
            c.ui_bigwig.input_url.value = info[ft].url;
            c.ui_bigwig.input_name.value = info[ft].name;
            return;
        case FT_cat_c:
            c.ui_cat.input_url.value = info[ft].url;
            c.ui_cat.input_name.value = info[ft].name;
            return;
        case FT_huburl:
            c.ui_hub.input_url.value = info[ft].url;
            return;
        case FT_anno_c:
            c.ui_hammock.input_url.value = info[ft].url;
            c.ui_hammock.input_name.value = info[ft].name;
            if (info[ft].json) {
                c.ui_hammock.input_json.value = JSON.stringify(info[ft].json);
            }
            return;
        case FT_weaver_c:
            c.ui_weaver.input_url.value = info[ft].url;
            c.ui_weaver.input_name.value = info[ft].name;
            return;
        default:
            fatalError('unknown ft');
    }
}
