/**
 * ===BASE===// custtk // custtkpanel_show.js
 * @param 
 */

function custtkpanel_show(ft) {
// clicking big butt to show submit ui
    var c = apps.custtk.bbj.genome.custtk;
    apps.custtk.main.__hbutt2.style.display = 'block';
    c.ui_bed.style.display = ft == FT_bed_c ? 'block' : 'none';
    c.ui_bedgraph.style.display = ft == FT_bedgraph_c ? 'block' : 'none';
    c.ui_cat.style.display = ft == FT_cat_c ? 'block' : 'none';
    c.ui_bam.style.display = ft == FT_bam_c ? 'block' : 'none';
    c.ui_lr.style.display = ft == FT_lr_c ? 'block' : 'none';
    c.ui_bigwig.style.display = ft == FT_bigwighmtk_c ? 'block' : 'none';
    c.ui_hammock.style.display = ft == FT_anno_c ? 'block' : 'none';
    c.ui_weaver.style.display = ft == FT_weaver_c ? 'block' : 'none';
    c.ui_hub.style.display = ft == FT_huburl ? 'block' : 'none';
    if (c.ui_submit.style.display == 'none') {
        flip_panel(c.buttdiv, c.ui_submit, true);
    }
    apps.custtk.shortcut[ft].style.display = 'inline-block';
}
