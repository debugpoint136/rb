/**
 * ===BASE===// zoom // browser_zoomin.js
 * @param 
 */

function browser_zoomin(event) {
    var t = event.target;
    if (!t.fold) t = t.parentNode;
    gflag.browser.cgiZoomin(t.fold);
}
