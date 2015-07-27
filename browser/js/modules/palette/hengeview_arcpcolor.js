/**
 * ===BASE===// palette // hengeview_arcpcolor.js
 * @param 
 */

function hengeview_arcpcolor() {
    var c = colorstr2int(palette.output);
    apps.circlet.hash[gflag.menu.viewkey].callingtk.pcolor = c.join(',');
    hengeview_draw(gflag.menu.viewkey);
    longrange_showplotcolor(palette.output, null);
}
