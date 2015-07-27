/**
 * ===BASE===// weaver // stitchblob_insertright.js
 * @param 
 */

function stitchblob_insertright(blob, i, stp, w, xspacer) {
    var mark = blob[i][1];
    var markright = 9999;
    for (var j = 0; j < blob.length; j++) {
        if (j != i) {
            if (blob[j][0] > mark) {
                markright = Math.min(markright, blob[j][0]);
            }
        }
    }
    if (markright - mark >= w + xspacer) {
        stp.canvasstart = mark + xspacer;
        stp.canvasstop = stp.canvasstart + w;
        blob[i][1] = stp.canvasstop;
        return;
    }
// add to last
    mark = 0;
    for (var i = 0; i < blob.length; i++) {
        mark = Math.max(blob[i][1], mark);
    }
    stp.canvasstart = mark + xspacer;
    stp.canvasstop = stp.canvasstart + w;
    stitchblob_new(blob, stp);
}

