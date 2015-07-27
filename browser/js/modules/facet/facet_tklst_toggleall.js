/**
 * ===BASE===// facet // facet_tklst_toggleall.js
 * @param 
 */

function facet_tklst_toggleall(event) {
    /* called by clicking all/none buttons in facet/menu/tklst panel
     arg: boolean to tell if check/uncheck all tracks
     */
    var tofill = event.target.tofill;
    var bbj = apps.hmtk.bbj;
    var lst = menu.facettklsttable.firstChild.childNodes;
    for (var i = 0; i < lst.length; i++) {
        var td = lst[i].firstChild;
        if ((td.className == 'tkentry' && tofill) || (td.className == 'tkentry_onfocus' && !tofill)) {
            simulateEvent(td, 'click');
        }
    }
}


