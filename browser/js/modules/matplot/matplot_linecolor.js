/**
 * ===BASE===// matplot // matplot_linecolor.js
 * @param 
 */

function matplot_linecolor() {
    gflag.menu.matplottkcell.style.backgroundColor = palette.output;
    var mat = gflag.menu.tklst[0];
    var target = mat.tracks[gflag.menu.matplottkcell.tkidx];
    var x = colorstr2int(palette.output);
    target.qtc.pr = x[0];
    target.qtc.pg = x[1];
    target.qtc.pb = x[2];
    gflag.menu.bbj.matplot_drawtk(mat, target);
    gflag.menu.bbj.drawTrack_header(mat);
}


