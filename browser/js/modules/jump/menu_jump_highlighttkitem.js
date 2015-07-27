/**
 * ===BASE===// jump // menu_jump_highlighttkitem.js
 * @param 
 */

function menu_jump_highlighttkitem(event) {
    var bbj = gflag.menu.bbj;
    if (bbj.is_gsv()) {
        print2console('Cannot jump in Gene Set View mode', 2);
        return;
    }
    var tr = event.target;
    while (tr.tagName != 'TR') tr = tr.parentNode;
    if (bbj.jump_callback) {
        bbj.jump_callback(tr.coord);
        return;
    }
    var t = bbj.parseCoord_wildgoose(tr.coord);
    if (t.length == 3) bbj.__pending_coord_hl = t;
    bbj.cgiJump2coord(tr.coord);
    menu_hide();
}


