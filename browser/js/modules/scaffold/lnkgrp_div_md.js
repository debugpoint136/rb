/**
 * ===BASE===// scaffold // lnkgrp_div_md.js
 * @param 
 */

function lnkgrp_div_md(event) {
// drag on linkage group bar and select a bunch of seq to show
    if (event.button != 0) return;
    event.preventDefault();
    var dom = event.target;
    while (!dom.lgname) {
        dom = dom.parentNode;
    }
    var bbj = gflag.menu.bbj;
    var pos = absolutePosition(dom);
    indicator.style.left = event.clientX + document.body.scrollLeft;
    indicator.style.top = pos[1];
    indicator.style.width = 1;
    indicator.style.height = dom.clientHeight;
    gflag.c18 = {
        domwidth: dom.clientWidth,
        x: event.clientX + document.body.scrollLeft,
        lgname: dom.lgname,
        xcurb: pos[0]
    };
    document.body.addEventListener('mousemove', lnkgrp_div_mm, false);
    document.body.addEventListener('mouseup', lnkgrp_div_mu, false);
}
