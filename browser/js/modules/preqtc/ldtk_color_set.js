/**
 * ===BASE===// preqtc // ldtk_color_set.js
 * @param 
 */

function ldtk_color_set() {
// TODO ld no support for negative score
    menu.c49.color.style.backgroundColor = palette.output;
    var tk = gflag.menu.tklst[0];
    var c = colorstr2int(palette.output);
    tk.qtc.pr = c[0];
    tk.qtc.pg = c[1];
    tk.qtc.pb = c[2];
    gflag.menu.bbj.updateTrack(tk, false);
}
