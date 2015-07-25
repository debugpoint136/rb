/**
 * darken color, higher percentage means darker color
 * @param rgb
 * @param perc
 */

function darkencolor(rgb, perc) {
// darken color, higher percentage means darker color
    var p = 1 - perc;
    return "rgb(" + parseInt(rgb[0] * p) + "," + parseInt(rgb[1] * p) + "," + parseInt(rgb[2] * p) + ")";
}