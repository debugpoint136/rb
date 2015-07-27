/**
 * ===BASE===// palette // paletteshow.js
 * @param 
 */

function paletteshow(x, y, which) {
// x and y should be event.clientX/Y
// TODO automatic beak placement, ...
    palette.style.display = "block";
    var w = 200;
    if (x + w > document.body.clientWidth) {
        x = document.body.clientWidth - w;
    } else {
        x -= 80;
    }
    var h = 250;
    if (y + h > document.body.clientHeight) {
        y = document.body.clientHeight - h - 40;
    } else {
        y += 5;
    }
    palette.style.left = x;
    palette.style.top = y;
    palette.which = which;
    document.body.addEventListener('mousedown', palettehide, false);
}
