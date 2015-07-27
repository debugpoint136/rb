/**
 * ===BASE===// menu // risky_changemode.js
 * @param 
 */

function risky_changemode() {
    var bbj = gflag.menu.bbj;
    if (bbj.trunk) bbj = bbj.trunk;
    bbj.tkchangemode(menu.changemodealert.tk, menu.changemodealert.tom);
    menu_hide();
}

