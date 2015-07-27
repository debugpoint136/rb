/**
 * ===BASE===// svg // svgColor.js
 * @param 
 */

function svgColor(type, colorstr) {
    var color = colorstr.toLowerCase();
    if (color.substr(0, 4) == 'rgba') {
        var t = color.split(/[\(\)]/)[1].split(',');
        if (t.length == 3) {
            return type + ':rgb(' + t.join(',') + ');';
        }
        if (t.length == 4) {
            return type + ':rgb(' + t[0] + ',' + t[1] + ',' + t[2] + ');' + type + '-opacity:' + t[3] + ';';
        }
        return type + ':black;';
    }
    return type + ':' + colorstr + ';';
}

