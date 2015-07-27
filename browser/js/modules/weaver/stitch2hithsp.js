/**
 * ===BASE===// weaver // stitch2hithsp.js
 * @param __Browser.prototype__
 * @param 
 */

Browser.prototype.stitch2hithsp = function (stitch, x) {
// call from target, x pos is compared to hsp's query pos
    var hits = [];
    for (var i = 0; i < stitch.lst.length; i++) {
        var hsp = stitch.lst[i];
        if (x > Math.min(hsp.q1, hsp.q2) && x < Math.max(hsp.q1, hsp.q2)) {
            var sf = hsp.strand == '+' ? (x - hsp.q1) / (hsp.q2 - hsp.q1) :
            (x - hsp.q2) / (hsp.q1 - hsp.q2);
            hits.push([
                hsp.strand == '+' ? (hsp.t1 + sf * (hsp.t2 - hsp.t1)) : (hsp.t2 - sf * (hsp.t2 - hsp.t1)),
                hsp.t1,
                hsp.t2,
                this.regionLst[hsp.targetrid][0] +
                ' ' + parseInt(hsp.strand == '+' ? (hsp.targetstart + sf * (hsp.targetstop - hsp.targetstart)) :
                    (hsp.targetstop - sf * (hsp.targetstop - hsp.targetstart))),
            ]);
        }
    }
    return hits;
};

