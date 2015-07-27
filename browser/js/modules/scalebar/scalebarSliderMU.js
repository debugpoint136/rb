/**
 * ===BASE===// scalebar // scalebarSliderMU.js
 * @param 
 */

function scalebarSliderMU(event) {
    document.body.removeEventListener('mousemove', scalebarSliderM, false);
    document.body.removeEventListener('mouseup', scalebarSliderMU, false);
    scalebarbeam.style.display = 'none';
}
