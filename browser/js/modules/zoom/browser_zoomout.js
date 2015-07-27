/**
 * ===BASE===// zoom // browser_zoomout.js
 * @param 
 */

function browser_zoomout(event) {
    var t = event.target;
    if (!t.fold) t = t.parentNode;
    gflag.browser.clicked_zoomoutbutt = t; // for placing warning msg
    gflag.browser.cgiZoomout(t.fold, false);
}
