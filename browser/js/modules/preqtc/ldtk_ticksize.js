/**
 * ===BASE===// preqtc // ldtk_ticksize.js
 * @param 
 */

function ldtk_ticksize(event) {
    var tk = gflag.menu.tklst[0];
    tk.ld.ticksize = Math.max(2, tk.ld.ticksize + event.target.change);
    gflag.menu.bbj.updateTrack(tk, true);
}
