/**
 * ===BASE===// palette // hengeview_arcncolor.js
 * @param 
 */

function hengeview_arcncolor() {
    var c = colorstr2int(palette.output);
    apps.circlet.hash[gflag.menu.viewkey].callingtk.ncolor = c.join(',');
    hengeview_draw(gflag.menu.viewkey);
    longrange_showplotcolor(null, palette.output);
}
