/**
 * ===BASE===// predsp // dye_seq.js
 * @param 
 */

function dye_seq(seq) {
// soaked in an urn
    var lst = [];
    for (var i = 0; i < seq.length; i++) {
        var c = seq.charAt(i);
        lst.push('<span style="background-color:' + ntbcolor[c.toLowerCase()] + '">' + c + '</span>');
    }
    return lst.join('');
}


