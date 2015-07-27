/**
 * ===BASE===// jump // cgiJump2coord.js
 * @param __Browser.prototype__
 * @param 
 */

Browser.prototype.cgiJump2coord = function (coord) {
    if (this.is_gsv()) {
        var tmp = this.parseCoord_wildgoose(coord);
        var a, b, c;
        if (tmp.length == 3) {
            a = tmp[0];
            b = tmp[1];
            c = tmp[2];
        } else {
            return;
        }
        for (var i = 0; i < this.genesetview.lst.length; i++) {
            var t = this.genesetview.lst[i];
            if (t.chrom == a && Math.max(t.start, b) < Math.min(t.stop, c)) {
                this.cloak();
                this.ajaxX("itemlist=on&imgAreaSelect=on&statusId=" + this.statusId +
                "&startChr=" + t.name + "&startCoord=" + Math.max(t.start, b) +
                "&stopChr=" + t.name + "&stopCoord=" + Math.min(t.stop, c) +
                (this.entire.atbplevel ? '&atbplevel=on' : ''));
                return;
            }
        }
        return;
    }
    this.cloak();
    this.ajaxX(this.displayedRegionParam() + "&jump=on&jumppos=" + coord);
};

