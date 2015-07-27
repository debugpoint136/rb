/**
 * ===BASE===// dsp // menu_changeleftwidth.js
 * @param 
 */

function menu_changeleftwidth(event) {
    var bbj = gflag.menu.bbj;
    var w = bbj.leftColumnWidth;
    switch (event.target.which) {
        case 1:
            w += 20;
            break;
        case 2:
            w = Math.max(10, w - 20);
            break;
        case 3:
            w += 5;
            break;
        case 4:
            w = Math.max(10, w - 5);
            break;
    }
    bbj.leftColumnWidth = w;
    for (var i = 0; i < bbj.tklst.length; i++) {
        bbj.drawTrack_header(bbj.tklst[i]);
    }
    bbj.drawATCGlegend(false);
//bbj.mcmPlaceheader();
}
