/**
 * ===BASE===// zoom // zoom_dom_movable.js
 * @param __Browser.prototype__
 * @param 
 */

Browser.prototype.zoom_dom_movable = function (v, x) {
// for animated zoom
    var r = this.rulercanvas;
    if (r != null) {
        r.style.webkitTransform =
            r.style.mozTransform =
                r.style.transform = 'scale(' + v + ',1)';
        r.style.left = x;
    }
    /* do not change ideogram, not fixed yet
     var d1=this.ideogram.canvas.parentNode.parentNode;
     d1.style.webkitTransform=
     d1.style.mozTransform=
     d1.style.transform=
     */
    var d2 = this.hmdiv;
    var d3 = this.decordiv;
    d2.style.webkitTransform =
        d2.style.mozTransform =
            d2.style.transform =
                d3.style.webkitTransform =
                    d3.style.mozTransform =
                        d3.style.transform = 'scale(' + v + ',1)';
    d2.style.left = d3.style.left = x;
};

