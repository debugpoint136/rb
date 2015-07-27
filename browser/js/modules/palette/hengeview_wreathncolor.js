/**
 * ===BASE===// palette // hengeview_wreathncolor.js
 * @param 
 */

function hengeview_wreathncolor() {
    palette.hook.style.backgroundColor = palette.output;
    var c = colorstr2int(palette.output);
    var tkn = palette.hook.parentNode.parentNode.tkname;
    var lst = apps.circlet.hash[gflag.menu.viewkey].wreath;
    for (var i = 0; i < lst.length; i++) {
        if (lst[i].name == tkn) {
            lst[i].qtc.nr = c[0];
            lst[i].qtc.ng = c[1];
            lst[i].qtc.nb = c[2];
            break;
        }
    }
    hengeview_draw(gflag.menu.viewkey);
}

