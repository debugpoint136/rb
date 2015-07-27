/**
 * ===BASE===// scalebar // scalebarArrowMD.js
 * @param 
 */

function scalebarArrowMD(event) {
    if (event.button != 0) return;
    event.preventDefault();
    gflag.browser.scalebar.arrow.xstart = event.clientX + document.body.scrollLeft;
    gflag.scalebarbbj = gflag.browser;
    document.body.addEventListener('mousemove', scalebarArrowM, false);
    document.body.addEventListener('mouseup', scalebarArrowMU, false);
    scalebarbeam.style.display = 'block';
}
