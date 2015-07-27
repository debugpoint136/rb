/**
 * ===BASE===// dsp // menuTurnoffJuxtapose.js
 * @param 
 */

function menuTurnoffJuxtapose() {
    gflag.menu.bbj.turnoffJuxtapose(true);
    if (gflag.syncviewrange) {
        for (var i = 0; i < gflag.syncviewrange.lst.length; i++) {
            gflag.syncviewrange.lst[i].turnoffJuxtapose(true);
        }
    }
}

