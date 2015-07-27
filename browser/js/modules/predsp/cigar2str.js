/**
 * ===BASE===// predsp // cigar2str.js
 * @param 
 */

function cigar2str(c) {
    var s = [];
    for (var i = 0; i < c.length; i++) {
        s.push(c[i][1]);
        s.push(c[i][0]);
    }
    return s.join('');
}


