/**
 * ===BASE===// facet // facet_cellmout.js
 * @param 
 */

function facet_cellmout(event) {
    var d = event.target;
    if (d.tagName != 'DIV') {
        d = d.parentNode;
    }
    var f = apps.hmtk.bbj.facet;
    var t = f.rowlst_td[d.i];
    t.style.backgroundColor = "transparent";
    t = f.collst_td[d.j];
    t.style.backgroundColor = "transparent";
}
