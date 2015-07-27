/**
 * ===BASE===// drawTk // sx2rcoord.js
 * @param __Browser.prototype__
 * @param 
 */

Browser.prototype.sx2rcoord = function (sx, printcoord) {
    /* anti cumoffset
     screen/scrollable x to region coord, x from beginning of scrollable canvas
     */
    var bpl = this.entire.atbplevel;
    var hit = null;
    for (var i = 0; i < this.regionLst.length; i++) {
        var r = this.regionLst[i];
        if (r[8] && r[8].canvasxoffset > sx) {
            return null;
        }
        var fv = (r[8] && r[8].item.hsp.strand == '-') ? false : true;
        var x = this.cumoffset(i, fv ? r[4] : r[3]);
        if (x + regionSpacing.width < sx) {
            continue;
        }
        if (x == sx || x + regionSpacing.width == sx) {
            // hit at region rightmost edge
            hit = {
                rid: i,
                sid: fv ? (bpl ? (r[4] - r[3]) : r[5]) : 0,
                coord: fv ? r[4] : r[3]
            };
            break;
        }
        // within this region
        var c = this.cumoffset(i, fv ? r[3] : r[4]);
        var rint = this.weaver ? this.weaver.insert[i] : null;
        // see if rint is empty
        if (rint) {
            var a = true;
            for (var b in rint) {
                if (b) {
                    a = false;
                    break;
                }
            }
            if (a) rint = null;
        }
        if (bpl) {
            if (fv) {
                for (var j = r[3]; j <= r[4]; j++) {
                    if (rint && (j in rint)) {
                        c += rint[j] * this.entire.bpwidth;
                        if (c >= sx) {
                            // fall into gap, may check which insert
                            hit = {rid: i, sid: j - r[3], coord: j, gap: rint[j]};
                            break;
                        }
                    }
                    if (c + this.entire.bpwidth >= sx) {
                        hit = {rid: i, sid: j - r[3], coord: j};
                        break;
                    }
                    c += this.entire.bpwidth;
                }
            } else {
                for (var j = r[4]; j >= r[3]; j--) {
                    if (rint && (j in rint)) {
                        c += rint[j] * this.entire.bpwidth;
                        if (c >= sx) {
                            // fall into gap, may check which insert
                            hit = {rid: i, sid: r[4] - j, coord: j, gap: rint[j]};
                            break;
                        }
                    }
                    if (c + this.entire.bpwidth >= sx) {
                        hit = {rid: i, sid: r[4] - j, coord: j};
                        break;
                    }
                    c += this.entire.bpwidth;
                }
            }
        } else {
            var incopy = null; //copy
            if (rint) {
                incopy = {};
                for (var ii in rint) incopy[ii] = rint[ii];
            }
            if (fv) {
                var coord = r[3];
                for (var j = 0; j < (r[4] - r[3]) / r[7]; j++) {
                    if (incopy) {
                        var got = false;
                        for (var k = 0; k < Math.ceil(r[7]); k++) {
                            var cc = parseInt(coord) + k;
                            if (cc in incopy) {
                                c += incopy[cc] / r[7];
                                if (c >= sx) {
                                    hit = {rid: i, sid: j, coord: cc, gap: incopy[cc]};
                                    got = true;
                                    break;
                                }
                                delete incopy[cc];
                            }
                        }
                        if (got) break;
                    }
                    coord += r[7];
                    c++;
                    if (c >= sx) {
                        hit = {rid: i, sid: j, coord: coord};
                        break;
                    }
                }
            } else {
                var coord = r[4];
                for (var j = 0; j < (r[4] - r[3]) / r[7]; j++) {
                    if (incopy) {
                        var got = false;
                        for (var k = 0; k < Math.ceil(r[7]); k++) {
                            var cc = parseInt(coord) - k;
                            if (cc in incopy) {
                                c += incopy[cc] / r[7];
                                if (c >= sx) {
                                    hit = {rid: i, sid: j, coord: cc, gap: incopy[cc]};
                                    got = true;
                                    break;
                                }
                                delete incopy[cc];
                            }
                        }
                        if (got) break;
                    }
                    coord -= r[7];
                    c++;
                    if (c >= sx) {
                        hit = {rid: i, sid: j, coord: coord};
                        break;
                    }
                }
            }
        }
        break;
    }
    if (!hit) return null;
    if (printcoord) {
        hit.str = this.genome.temporal_ymd ?
        month2str[parseInt(hit.coord / 100)] + ' ' + (hit.coord % 100) + ', ' + this.regionLst[hit.rid][0] :
        this.regionLst[hit.rid][0] + ' ' + parseInt(hit.coord);
    }
    return hit;
};


