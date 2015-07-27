/**
 * ===BASE===// drawTk // region2showpos.js
 * @param __Browser.prototype__
 * @param 
 */

Browser.prototype.region2showpos = function (c) {
// arg: ['chr',111,222], might hit at multiple locations!!
    if (typeof(c) == 'string') {
        var lst = this.genome.parseCoordinate(c, 2);
        if (!lst) {
            return null;
        }
        c = lst;
    } else if (c.length != 3) {
        print2console('region2showpos: wrong input', 2);
        return null;
    }
    var hits = [];
    for (var i = 0; i < this.regionLst.length; i++) {
        var r = this.regionLst[i];
        if (r[0] == c[0]) {
            var x = this.cumoffset(i, c[1]);
            if (x) {
                hits.push([x, this.bp2sw(i, Math.min(c[2], r[4]) - Math.max(c[1], r[3]))]);
            }
        }
    }
    if (hits.length == 0) return null;
    return hits;
};

