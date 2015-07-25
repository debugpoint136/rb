Browser.prototype.parseCoord_wildgoose = function (param, highlight) {
    param = param.trim();  // gets rid of whitespace
    var _len = this.genome.scaffold.len[param];
    if (_len) {
        // only chr name
        var x = parseInt(_len / 2);
        return [param, Math.max(x - 10000, 0), Math.min(x + 10000, _len - 1)];
    }
    var c = this.genome.parseCoordinate(param, 2);
    if (c) {
        if (c[0] == c[2]) {
            if (highlight) {
                this.__pending_coord_hl = [c[0], c[1], c[3]];
            }
            return [c[0], c[1], c[3]];
        } else {
            print2console('unexpected coord: ' + c[0] + ' - ' + c[2], 2);
            return c;
        }
    }
    c = param.split(/[^\w\.]/);
    if (c.length == 1) {
        var pos = parseInt(c[0]);
        if (isNaN(pos)) {
            return null;
        }
        // treat it as a coordinate
        if (!this.regionLst || this.regionLst.length == 0) {
            return null;
        }
        var chrom = this.getDspStat()[0];
        if (pos > 0 && pos <= this.genome.scaffold.len[chrom]) {
            var a = parseInt((this.hmSpan / MAXbpwidth_bold) / 2);
            if (highlight) {
                this.__pending_coord_hl = [chrom, pos, pos + 1];
            }
            return [chrom, Math.max(0, pos - a), pos + a];
        }
    } else if (c.length == 2) {
        var pos = parseInt(c[1]);
        var len = this.genome.scaffold.len[c[0]];
        if (len && !isNaN(pos) && pos > 0 && pos <= len) {
            if (highlight) {
                this.__pending_coord_hl = [c[0], pos, pos + 1];
            }
            var a = parseInt((this.hmSpan / MAXbpwidth_bold) / 2);
            return [c[0], Math.max(0, pos - a), pos + a];
        } else {
            var a = parseInt(c[0]), b = parseInt(c[1]);
            if (!isNaN(a) && !isNaN(b)) {
                if (!this.regionLst || this.regionLst.length == 0) {
                    return null;
                }
                var chrom = this.getDspStat()[0];
                if (highlight) {
                    this.__pending_coord_hl = [chrom, a, b];
                }
                return [chrom, a, b];
            }
        }
    } else if (c.length == 4) {
        if (c[0] == c[2]) return [c[0], c[1], c[3]];
        return c;
    }
// try again by erasing comma, damn, all repeated!
    c = param.replace(/,/g, '').split(/[^\w\.]/);
    if (c.length == 1) {
        var pos = parseInt(c[0]);
        if (isNaN(pos)) {
            return null;
        }
        // treat it as a coordinate
        if (!this.regionLst || this.regionLst.length == 0) {
            return null;
        }
        var chrom = this.getDspStat()[0];
        if (pos > 0 && pos <= this.genome.scaffold.len[chrom]) {
            var a = parseInt((this.hmSpan / MAXbpwidth_bold) / 2);
            if (highlight) {
                this.__pending_coord_hl = [chrom, pos, pos + 1];
            }
            return [chrom, Math.max(0, pos - a), pos + a];
        }
    } else if (c.length == 2) {
        var pos = parseInt(c[1]);
        var len = this.genome.scaffold.len[c[0]];
        if (len && !isNaN(pos) && pos > 0 && pos <= len) {
            if (highlight) {
                this.__pending_coord_hl = [c[0], pos, pos + 1];
            }
            var a = parseInt((this.hmSpan / MAXbpwidth_bold) / 2);
            return [c[0], Math.max(0, pos - a), pos + a];
        } else {
            var a = parseInt(c[0]), b = parseInt(c[1]);
            if (!isNaN(a) && !isNaN(b)) {
                if (!this.regionLst || this.regionLst.length == 0) {
                    return null;
                }
                var chrom = this.getDspStat()[0];
                if (highlight) {
                    this.__pending_coord_hl = [chrom, a, b];
                }
                return [chrom, a, b];
            }
        }
    } else if (c.length == 4) {
        if (c[0] == c[2]) return [c[0], c[1], c[3]];
        return c;
    }
    return null;
};