/**
 * ===BASE===// facet // facet_cellmover.js
 * @param 
 */

function facet_cellmover(event) {
// i/j: array idx to facet.rowlst, .collst
    var d = event.target;
    if (d.tagName != 'DIV') {
        d = d.parentNode;
    }
    var f = apps.hmtk.bbj.facet;
    var t = f.rowlst_td[d.i];
    t.style.backgroundColor = colorCentral.hl;
    t = f.collst_td[d.j];
    t.style.backgroundColor = colorCentral.hl;
    menu.style.display = 'none';
}
