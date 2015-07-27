/**
 * ===BASE===// scalebar // scalebarArrowMU.js
 * @param 
 */

function scalebarArrowMU(event) {
    document.body.removeEventListener('mousemove', scalebarArrowM, false);
    document.body.removeEventListener('mouseup', scalebarArrowMU, false);
    scalebarbeam.style.display = 'none';
}
