/**
 * ===BASE===// splinter // splinter_pan.js
 * @param 
 */

function splinter_pan(tag, direction) {
    var b = gflag.browser.splinterTag == tag ? gflag.browser : gflag.browser.splinters[tag];
    b.arrowPan(direction, 1);
}
