/**
 * must be rgb(,,)
 * @param str
 */

function rgb2hex(str) {
// must be rgb(,,)
    if (str.charAt(0) == '#') return str;
    var c = colorstr2int(str);
    if (isNaN(c[0]) || isNaN(c[1]) || isNaN(c[2])) {
        return '#000000';
    }
    var h = '#';
    return '#' + (c[0] == 0 ? '00' : c[0].toString(16)) +
        (c[1] == 0 ? '00' : c[1].toString(16)) +
        (c[2] == 0 ? '00' : c[2].toString(16));
}