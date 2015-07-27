/**
 * ===BASE===// preqtc // ldtk_topheight.js
 * @param 
 */

function ldtk_topheight(event) {
    var tk = gflag.menu.tklst[0];
    tk.ld.topheight = Math.max(20, tk.ld.topheight + event.target.change);
    gflag.menu.bbj.updateTrack(tk, true);
}


