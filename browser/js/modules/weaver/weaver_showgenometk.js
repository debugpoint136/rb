/**
 * ===BASE===// weaver // weaver_showgenometk.js
 * @param 
 */

function weaver_showgenometk(gn) {
    menu_shutup();
    menu.grandadd.style.display = 'block';
    var tbj = gflag.menu.bbj;
    var cbj = tbj.weaver.q[gn];
    if (cbj.regionLst.length == 0 || !cbj.regionLst[0][8]) {
        // init cottonbbj region
        if (tbj.weaver.mode == W_rough) {
            tbj.weaver_stitch2cotton(cbj.weaver.track);
        } else {
            tbj.weaver_hsp2cotton(cbj.weaver.track);
            // beware! r[8] xoffset is not set!
            for (var i = 0; i < cbj.regionLst.length; i++) {
                var r = cbj.regionLst[i];
                r[8].canvasxoffset = r[8].item.hsp.canvasstart;
            }
        }
    }
    if (cbj.dspBoundary.vstartr == undefined) {
        cbj.weaver_cotton_dspboundary();
    }
    cbj.grandshowtrack();
}

