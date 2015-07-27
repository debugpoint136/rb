/**
 * ===BASE===// facet // tracksetTwonumbers.js
 * @param __Browser.prototype__
 * @param 
 */

Browser.prototype.tracksetTwonumbers = function (tkset) {
// takes in a hash of track names
// return a list [total number, number displayed now]
    var numall = 0; // # tracks in tkset
    var numinuse = 0; // # tracks in tkset in display
    for (var tk in tkset) {
        numall++;
        if (this.findTrack(tk) != null) numinuse++;
    }
    return [numall, numinuse];
};

