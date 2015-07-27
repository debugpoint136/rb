/**
 * ===BASE===// drawTk // cumoffset.js
 * @param __Browser.prototype__
 * @param 
 */

Browser.prototype.cumoffset = function (rid, coord, include) {
    /* anti sx2rcoord 
     recalculate xoffset for each coordinate-anchor, no need to keep track of global xoffset, lazy
     from region coord to c-u-mulative x offset
     special case for cottonbbj
     */
    if (rid >= this.regionLst.length) return -1;
    var x = 0;
    var r = this.regionLst[rid];
    if (r[8]) {
        /* is cotton, calling from cotton bbj, r[8] has xoffset on canvas
         coord is on query genome
         */
        if (coord < r[3] || coord > r[4]) return -1;
        var fv = r[8].item.hsp.strand == '+';
        x = r[8].canvasxoffset + this.bp2sw(rid, fv ? (coord - r[3] + (include ? 1 : 0)) : (r[4] - coord + (include ? 1 : 0)));
        for (var c in this.weaver.insert[rid]) {
            var use = false;
            if (include) {
                if (fv) use = parseInt(c) <= coord;
                else use = parseInt(c) >= coord;
            } else {
                if (fv) use = parseInt(c) < coord;
                else use = parseInt(c) > coord;
            }
            if (use) {
                x += this.bp2sw(rid, this.weaver.insert[rid][c]);
            }
        }
        return x;
    }
    for (var i = 0; i < this.regionLst.length; i++) {
        var r = this.regionLst[i];
        var islk = this.weaver ? this.weaver.insert[i] : null;
        if (rid == i) {
            if (coord < r[3] || coord > r[4]) return -1;
            x += this.bp2sw(i, coord - r[3] + (include ? 1 : 0));
            if (islk) {
                for (var j in islk) {
                    var use = false;
                    if (include) {
                        use = parseInt(j) <= coord;
                    } else {
                        use = parseInt(j) < coord;
                    }
                    if (use) x += this.bp2sw(i, islk[j]);
                }
            }
            return x;
        } else {
            x += this.bp2sw(i, r[4] - r[3] + 1);
            if (islk) {
                for (var j in islk) {
                    x += this.bp2sw(i, islk[j]);
                }
            }
        }
    }
    return -1;
};

