/**
 * ===BASE===// facet // facet_term_selectall.js
 * @param 
 */

function facet_term_selectall() {
    /* called by clicking 'select all' option in menu
     to select all tracks annotated by the underlining term
     */
    var bbj = apps.hmtk.bbj;
    var s = {};
    bbj.mdgettrack(gflag.menu.termname, gflag.menu.mdidx, s);
    var newlst = [];
    for (var n in s) {
        if (bbj.findTrack(n) == null) {
            newlst.push(n);
        }
    }
    if (newlst.length == 0) {
        menu_hide();
        return;
    }
    gflag.tsp.invoke = {mdidx: gflag.menu.mdidx};
    bbj.showhmtkchoice({lst: newlst, selected: true, context: 9});
}
