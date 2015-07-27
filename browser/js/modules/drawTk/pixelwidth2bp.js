/**
 * Created by dpuru on 2/27/15.
 */
Browser.prototype.pixelwidth2bp = function (pxw) {
// argument: pixel width
    return this.entire.atbplevel ? pxw / this.entire.bpwidth : pxw * this.entire.summarySize;
};

