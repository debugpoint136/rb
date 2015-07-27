/**
 * ===BASE===// wvfind // wvfind_sorthit.js
 * @param 
 */

function wvfind_sorthit(a, b) {
    var la = 0;
    for (var i = 0; i < a.lst.length; i++) {
        la += a.lst[i].targetstop - a.lst[i].targetstart;
    }
    var lb = 0;
    for (var i = 0; i < b.lst.length; i++) {
        lb += b.lst[i].targetstop - b.lst[i].targetstart;
    }
    return lb - la;
}

