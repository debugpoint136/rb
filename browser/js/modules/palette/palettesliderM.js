/**
 * ===BASE===// palette // palettesliderM.js
 * @param 
 */

function palettesliderM(event) {
    var x = event.clientX;
    var oldx = palette.slider.x;
    var l = parseInt(palette.slider.style.left);
    if ((x > oldx && l >= 100) || (x < oldx && l <= 0))
        return;
    palette.slider.style.left = l + x - oldx;
    l = parseInt(palette.slider.style.left);
    if (l > 100)
        palette.slider.style.left = 100;
    else if (l < 0)
        palette.slider.style.left = 0;
    palette.slider.x = event.clientX;
}
