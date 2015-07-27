/**
 * ===BASE===// predsp // samread_seqregion.js
 * @param 
 */

function samread_seqregion(cigar, coord) {
    var lst = [];
    for (var i = 0; i < cigar.length; i++) {
        var op = cigar[i][0];
        var cl = cigar[i][1];
        if (op == 'M') {
            lst.push([coord, coord + cl]);
        }
        coord += cl;
    }
    return lst;
}

