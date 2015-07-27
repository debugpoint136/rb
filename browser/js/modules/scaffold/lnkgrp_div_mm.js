/**
 * ===BASE===// scaffold // lnkgrp_div_mm.js
 * @param 
 */

function lnkgrp_div_mm(event) {
    var currx = event.clientX + document.body.scrollLeft;
    var n = gflag.c18;
    indicator.style.display = 'block';
    if (currx > n.x) {
        if (currx < n.xcurb + n.domwidth) {
            indicator.style.width = currx - n.x;
        }
    } else {
        if (currx >= n.xcurb) {
            indicator.style.width = n.x - currx;
            indicator.style.left = currx;
        }
    }
}
