/**
 * @param lst
 */

function words2mdterm(lst) {
    var words = [];
    for (var i = 0; i < lst.length; i++) {
        words.push(lst[i].toLowerCase());
    }
    var hits = [];
    for (var i = 0; i < gflag.mdlst.length; i++) {
        var h = md_findterm(gflag.mdlst[i], words);
        for (var j = 0; j < h.length; j++) {
            hits.push([h[j], i]);
        }
    }
    return hits;
}