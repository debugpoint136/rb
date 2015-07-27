/**
 * ===BASE===// palette // hengeview_wreathpcolor.js
 * @param 
 */

function hengeview_wreathpcolor() {
    palette.hook.style.backgroundColor = palette.output;
    var c = colorstr2int(palette.output);
    var tkn = palette.hook.parentNode.parentNode.tkname;
    var lst = apps.circlet.hash[gflag.menu.viewkey].wreath;
    for (var i = 0; i < lst.length; i++) {
        if (lst[i].name == tkn) {
            lst[i].qtc.pr = c[0];
            lst[i].qtc.pg = c[1];
            lst[i].qtc.pb = c[2];
            break;
        }
    }
    hengeview_draw(gflag.menu.viewkey);
}
