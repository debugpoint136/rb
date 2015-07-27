/**
 * ===BASE===// qtc // toggle15.js
 * @param 
 */

function toggle15(event) {
    /* called by changing "apply to all tracks" checkbox in qtc panel
     only for browser tk, not bev or such
     when changing it, do not automatically apply style...
     */
    var bbj = gflag.menu.bbj;
    if (event.target.checked) {
        indicator3cover(bbj);
        menu.c14.unify.style.display = bbj.tklst.length > 1 ? 'table-cell' : 'none';
    } else {
        bbj.highlighttrack(gflag.menu.tklst);
        menu.c14.unify.style.display = gflag.menu.tklst.length > 1 ? 'table-cell' : 'none';
    }
}


