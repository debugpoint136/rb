/**
 * ===BASE===// scaffold // scfdoverview_zoomin_Mm.js
 * @param 
 */

function scfdoverview_zoomin_Mm(event) {
    var currx = event.clientX + document.body.scrollLeft;
    var n = gflag.navigator;
    if (currx > n.x) {
        if (currx < n.xcurb + n.canvas.width) {
            indicator.style.width = currx - n.x;
        }
    } else {
        if (currx >= n.xcurb) {
            indicator.style.width = n.x - currx;
            indicator.style.left = currx;
        }
    }
}
