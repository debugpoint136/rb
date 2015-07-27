/**
 * ===BASE===// facet // facet_term_removeall.js
 * @param 
 */

function facet_term_removeall() {
// called by clicking 'remove all' option in menu
    var bbj = apps.hmtk.bbj;
    var s = {};
    bbj.mdgettrack(gflag.menu.termname, gflag.menu.mdidx, s);
    var lst = [];
    for (var tk in s) {
        if (bbj.findTrack(tk) != null) {
            lst.push(tk);
        }
    }
    if (lst.length == 0) return;
    bbj.removeTrack(lst);
    menu_hide();
}

