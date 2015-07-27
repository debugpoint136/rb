/**
 * ===BASE===// pan // viewboxM.js
 * @param 
 */

function viewboxM(event) {
    var bbj = gflag.movebbj;
    bbj.shieldOn();
    if (bbj.entire.atbplevel) {
        // escape move distance that is smaller than bpwidth
        var moved = event.clientX - bbj.move.mousex;
        if (Math.abs(moved) >= bbj.entire.bpwidth) {
            var s = parseInt(moved / bbj.entire.bpwidth) * bbj.entire.bpwidth;
            bbj.placeMovable(bbj.move.styleLeft + s);
            bbj.move.mousex = event.clientX;
            if (!bbj.is_gsv()) {
                bbj.updateDspstat();
                if (gflag.syncviewrange) {
                    var lst = gflag.syncviewrange.lst;
                    for (var i = 0; i < lst.length; i++) {
                        lst[i].placeMovable(lst[i].move.styleLeft + s);
                        lst[i].updateDspstat();
                    }
                }
            }
        }
        return;
    }
    var s = event.clientX - bbj.move.mousex;
    bbj.placeMovable(bbj.move.styleLeft + s);
    bbj.move.mousex = event.clientX;
    if (!bbj.is_gsv()) {
        bbj.updateDspstat();
        if (gflag.syncviewrange) {
            var lst = gflag.syncviewrange.lst;
            for (var i = 0; i < lst.length; i++) {
                lst[i].placeMovable(lst[i].move.styleLeft + s);
                lst[i].updateDspstat();
            }
        }
    }
}

