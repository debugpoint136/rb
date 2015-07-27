/**
 * ===BASE===// drawTk // setBamreadcoord.js
 * @param 
 */

function setBamreadcoord(item) {
    var c = item.bam.cigar;
    item.stop = item.bam.start = item.bam.stop = item.start; // position of aligned portion
    if (c.length == 0) {
        item.stop = item.bam.stop = item.start + item.bam.seq.length;
    } else {
        if (c[0][0] == 'S') { // move start to left if soft clip on left
            item.start -= c[0][1];
        }
        // compute stop
        for (var k = 0; k < c.length; k++) {
            var op = c[k][0];
            var cl = c[k][1];
            item.stop += cl;
            if (op == 'M' || op == 'D' || op == 'N') {
                item.bam.stop += cl;
            }
        }
    }
}


