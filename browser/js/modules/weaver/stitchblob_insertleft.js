/**
 * ===BASE===// weaver // stitchblob_insertleft.js
 * @param 
 */

function stitchblob_insertleft(blob, i, stp, w, xspacer) {
    var mark = blob[i][0];
    var markleft = 0;
    for (var j = 0; j < blob.length; j++) {
        if (j != i) {
            if (blob[j][1] < mark) {
                markleft = Math.max(markleft, blob[j][1]);
            }
        }
    }
    if (mark - markleft >= w + xspacer) {
        stp.canvasstop = mark - xspacer;
        stp.canvasstart = stp.canvasstop - w;
        blob[i][0] = stp.canvasstart;
        return true;
    }
    return false;
}

