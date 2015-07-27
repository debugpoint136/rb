/**
 * @param md
 * @param words
 */

function md_findterm(md, words) {
    var hits = [];
    for (var t in md.c2p) {
        var s;
        if (t in md.idx2attr) {
            s = md.idx2attr[t].toLowerCase();
        } else {
            s = t.toLowerCase();
        }
        var allmatch = true;
        for (var j = 0; j < words.length; j++) {
            if (s.indexOf(words[j]) == -1) {
                allmatch = false;
            }
        }
        if (allmatch) {
            var x = parseInt(t);
            hits.push(isNaN(x) ? t : x);
        }
    }
    return hits;
}