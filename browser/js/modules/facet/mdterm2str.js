/**
 * ===BASE===// facet // mdterm2str.js
 * @param 
 */

function mdterm2str(i, t) {
    var v = gflag.mdlst[i];
    if (t in v.idx2attr) return v.idx2attr[t];
    return t;
}

