/**
 * ===BASE===// facet // facet_tklst_removeall.js
 * @param 
 */

function facet_tklst_removeall() {
// called by clicking button in facet-menu-tklst panel from menu
    var bbj = gflag.menu.bbj;
    var lst = menu.facettklsttable.firstChild.childNodes;
    var rlst = [];
    for (var i = 0; i < lst.length; i++) {
        var td = lst[i].firstChild;
        if (td.className == 'tkentry_inactive') {
            rlst.push(td.tkobj.name);
        }
    }
    if (rlst.length == 0) return;
    bbj.removeTrack(rlst);
}

