/**
 * ===BASE===// splinter // splinter_zoomout.js
 * @param 
 */

function splinter_zoomout(tag) {
// arg is splinter tag
    var b = gflag.browser.splinterTag == tag ? gflag.browser : gflag.browser.splinters[tag];
    b.cgiZoomout(1, false);
}
