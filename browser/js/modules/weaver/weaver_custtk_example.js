/**
 * Created by dpuru on 2/27/15.
 */




/** __weaver__ **/
/*
 one sample:
 show all parts on hg19, clickable buttons

 click a button, assemble new reference
 new reference as target, hg19 as query

 db-free reference, but needs length of all scaffolds
 comparison of many samples
 */

function weaver_custtk_example(g, gn, url) {
    return function () {
        var d = g.custtk.ui_weaver;
        d.input_name.value = gn;
        d.input_url.value = url;
    }
}

