/**
 * ===BASE===// preqtc // gfSort.js
 * @param 
 */

function gfSort(a, b) {
    /* for genomic feature items in decor drawing
     using on-canvas plotting position
     item boxstart/boxwidth could be undefined
     */
    if (a.boxstart == undefined) {
        if (b.boxstart == undefined) {
            return 0;
        } else {
            return -1;
        }
    }
    if (b.boxstart == undefined) return 1;
    if (a.boxstart != b.boxstart) {
        return a.boxstart - b.boxstart;
    } else if (a.boxwidth != b.boxwidth) {
        return b.boxwidth - a.boxwidth;
    }
// a and b are same on start/width, see about score
    if (a.__showscoreidx != undefined) {
        return b.scorelst[a.__showscoreidx] - a.scorelst[a.__showscoreidx];
    }
    return 0;
}

