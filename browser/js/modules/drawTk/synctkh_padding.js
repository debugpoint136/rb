/**
 * ===BASE===// drawTk // synctkh_padding.js
 * @param __Browser.prototype__
 * @param 
 */

Browser.prototype.synctkh_padding = function (tkname) {
// should be calling from trunk
    var tkobj = this.findTrack(tkname);
    var maxH = tkobj.canvas.height;
    for (var tag in this.splinters) {
        var b = this.splinters[tag];
        var o = b.findTrack(tkname);
        /* in case of splinting
         unfinished chip is inserted into trunk.splinters
         and resizing trunk will re-draw all tracks in trunk
         but the splinter tracks are not ready
         */
        if (o) {
            maxH = Math.max(o.canvas.height, maxH);
        }
    }
// apply padding to trunk track
    var _p = maxH - tkobj.canvas.height;
    tkobj.canvas.style.paddingBottom = _p;
    if (this.hmheaderdiv) {
        tkobj.header.style.paddingBottom = _p;
    }
    if (this.mcm) {
        tkobj.atC.style.paddingBottom = _p;
    }
    this.trackHeightChanged();
// apply to each splinter
    for (tag in this.splinters) {
        var b = this.splinters[tag];
        var o = b.findTrack(tkobj.name);
        if (o) {
            o.canvas.style.paddingBottom = maxH - o.canvas.height;
            b.trackHeightChanged();
        }
    }
};

