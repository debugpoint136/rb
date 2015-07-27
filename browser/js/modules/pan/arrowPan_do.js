/**
 * ===BASE===// pan // arrowPan_do.js
 * @param 
 */

function arrowPan_do() {
    var a = gflag.arrowpan;
    if (a.span <= 0) {
        viewboxMU();
        invisibleBlanket.style.display = 'none';
        return;
    }
    a.bbj.move.styleLeft += a.dir == 'l' ? 3 : -3;
    a.bbj.move.mousex = 600;
    a.bbj.placeMovable(a.bbj.move.styleLeft);
    a.span -= 3;
    setTimeout(arrowPan_do, 1);
}

/* __pan__ ends */