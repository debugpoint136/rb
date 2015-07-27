/**
 * ===BASE===// wvfind // wvfind_gs2lst.js
 * @param 
 */

function wvfind_gs2lst(gs) {
    var lst = [];
    for (var i = 0; i < gs.length; i++) {
        var e = gs[i];
        var t = {chr: e.c, start: e.a1, stop: e.b1, hit: {}};
        if (e.isgene) {
            t.isgene = true;
            t.name = e.name;
            t.struct = eval('(' + JSON.stringify(e.struct) + ')');
            t.strand = e.strand;
            t.genetrack = e.type;
        }
        lst.push(t);
    }
    lst.sort(gfSort_len);
    return lst;
}
