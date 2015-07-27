/**
 * ===BASE===// wvfind // wvfind_choosetk.js
 * @param 
 */

function wvfind_choosetk(gname) {
    menu_blank();
    dom_create('div', menu.c32, 'margin:15px;').innerHTML = gname + ' tracks';
    var d = dom_create('div', menu.c32, 'margin:15px;');
    for (var i = 0; i < apps.wvfind.bbj.tklst.length; i++) {
        var tk = apps.wvfind.bbj.tklst[i];
        if (tk.ft == FT_weaver_c) continue;
        if ((!tk.cotton && apps.wvfind.bbj.genome.name == gname) || (tk.cotton && tk.cotton == gname)) {
            dom_addtkentry(2, d, false, tk, tk.label, wvfind_addtk_sukn);
        }
    }
}
