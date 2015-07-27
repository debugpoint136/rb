/**
 * ===BASE===// facet // facet_colh_mover.js
 * @param 
 */

function facet_colh_mover(event) {
    var td = event.target;
    while (td.tagName != 'TD') {
        td = td.parentNode;
    }
    td.style.backgroundColor = colorCentral.hl;
    menu_shutup();
    menu.facetm.style.display = 'block';
    var p = absolutePosition(td);
    menu_show(9, p[0] - document.body.scrollLeft - 10, p[1] - 70 - document.body.scrollTop);
    gflag.menu.termname = apps.hmtk.bbj.facet.collst[td.idx][0];
    gflag.menu.mdidx = apps.hmtk.bbj.facet.dim2.mdidx;
}
