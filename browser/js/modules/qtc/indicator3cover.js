/**
 * ===BASE===// qtc // indicator3cover.js
 * @param 
 */

function indicator3cover(bbj) {
    var c = absolutePosition(bbj.hmdiv.parentNode);
//placeIndicator3(c[0], c[1], bbj.hmSpan,
//	bbj.hmdiv.clientHeight+bbj.ideogram.canvas.height+bbj.decordiv.clientHeight+bbj.tklst.length);
    placeIndicator3(c[0], c[1], bbj.hmSpan, bbj.hmdiv.clientHeight); //dli, apply to all don't select track under ideogram
}

