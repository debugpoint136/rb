/**
 * ===BASE===// scalebar // scalebarSliderMD.js
 * @param 
 */

function scalebarSliderMD(event) {
    if (event.button != 0) return;
    event.preventDefault();
    gflag.browser.scalebar.slider.xstart = event.clientX + document.body.scrollLeft;
    gflag.browser.show_scalebarbeam();
    gflag.scalebarbbj = gflag.browser;
    document.body.addEventListener('mousemove', scalebarSliderM, false);
    document.body.addEventListener('mouseup', scalebarSliderMU, false);
    scalebarbeam.style.display = 'block';
}
