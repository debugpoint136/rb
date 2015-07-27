/**
 * ===BASE===// menu // menu_show_beneathdom.js
 * @param 
 */

function menu_show_beneathdom(ctxt, dom, xadjust) {
// xadjust is for parent element scrollLeft, cannot fix this in absolutePosition
    var p = absolutePosition(dom);
    menu_show(ctxt, p[0] - 10 - document.body.scrollLeft - (xadjust ? xadjust : 0), p[1] - 8 - document.body.scrollTop + dom.offsetHeight);
}

