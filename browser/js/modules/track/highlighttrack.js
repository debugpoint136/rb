/**
 * ===BASE===// track // highlighttrack.js
 * @param __Browser.prototype__
 * @param 
 */

Browser.prototype.highlighttrack = function (lst) {
    /* put indicator over some tracks
     the tracks must be next to each other
     first element in the list is assumed to be the one on top (determines box position)
     */
    var pos = absolutePosition(lst[0].canvas);
    var h = 0;
    for (var i = 0; i < lst.length; i++) {
        h += tk_height(lst[i]) + parseInt(lst[i].canvas.style.paddingBottom);
    }
    placeIndicator3(pos[0] - this.move.styleLeft, pos[1], this.hmSpan, h);
};


