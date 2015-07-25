/**
 * lighten color, higher percentage means lighter color
 * @param rgb
 * @param perc
 */

function lightencolor(rgb, perc) {
// lighten color, higher percentage means lighter color
    return "rgb(" + (rgb[0] + parseInt((255 - rgb[0]) * perc)) + "," + (rgb[1] + parseInt((255 - rgb[1]) * perc)) + "," + (rgb[2] + parseInt((255 - rgb[2]) * perc)) + ")";
}