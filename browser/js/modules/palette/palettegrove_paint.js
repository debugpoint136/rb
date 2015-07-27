/**
 * ===BASE===// palette // palettegrove_paint.js
 * @param 
 */

function palettegrove_paint(color) {
    palette.grove.color = color;
    var ctx = palette.grove.getContext('2d');
    var lingrad = ctx.createLinearGradient(0, 0, 100, 0);
    lingrad.addColorStop(0, 'black');
    lingrad.addColorStop(0.5, color);
    lingrad.addColorStop(1, 'white');
    ctx.fillStyle = lingrad;
    ctx.fillRect(0, 0, 100, 20);
}
