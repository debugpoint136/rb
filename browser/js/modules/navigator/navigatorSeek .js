/**
 * ===BASE===// navigator // navigatorSeek .js
 * @param __Browser.prototype__
 * @param 
 */

Browser.prototype.navigatorSeek = function (x) {
// return [chr/item name, coord]
    if (this.is_gsv()) {
        var cx = 0;
        for (var i = 0; i < this.navigator.blockwidth.length; i++) {
            var thisx = this.navigator.blockwidth[i];
            if (cx + thisx >= x) {
                var b = this.genesetview.lst[i];
                return [b.name, b.start + parseInt((b.stop - b.start) * (x - cx) / thisx)];
            }
            cx += thisx;
        }
        return [this.genesetview.lst[i - 1].name, this.genesetview.lst[i - 1].stop];
    }
    var cx = 0;
    for (var i = 0; i < this.navigator.blockwidth.length; i++) {
        var thisx = this.navigator.blockwidth[i];
        if (cx + thisx >= x) {
            var b = this.navigator.blocks[i];
            return [b[0], parseInt((b[2] - b[1]) * (x - cx) / thisx)];
        }
        cx += thisx;
    }
    return [this.navigator.blocks[i - 1][0], this.navigator.blocks[i - 1][2]];
};
