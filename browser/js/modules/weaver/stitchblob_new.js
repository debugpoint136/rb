/**
 * ===BASE===// weaver // stitchblob_new.js
 * @param 
 */

function stitchblob_new(blob, stp) {
    for (var j = 0; j < blob.length; j++) {
        if (Math.max(blob[j][0], stp.canvasstart) - Math.min(blob[j][1], stp.canvasstop) <= 10) {
            blob[j][0] = Math.min(blob[j][0], stp.canvasstart);
            blob[j][1] = Math.max(blob[j][1], stp.canvasstop);
            return;
        }
    }
    blob.push([stp.canvasstart, stp.canvasstop]);
}

