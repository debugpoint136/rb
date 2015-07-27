/**
 * ===BASE===// facet // facet_rowh_mover.js
 * @param 
 */

function facet_rowh_mover(event) {
    var td = event.target;
    while (td.tagName != 'TD') {
        td = td.parentNode;
    }
    td.style.backgroundColor = colorCentral.hl;
    menu_shutup();
    menu.facetm.style.display = 'block';
    var p = absolutePosition(td);
    menu_show(9, p[0] + td.clientWidth - 10 - document.body.scrollLeft, p[1] - 10 - document.body.scrollTop);
    gflag.menu.termname = apps.hmtk.bbj.facet.rowlst[td.idx][0];
    gflag.menu.mdidx = apps.hmtk.bbj.facet.dim1.mdidx;
}
