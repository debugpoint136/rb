/**
 * @param a
 * @return a <br><br><br>
 */

function bp2neatstr(a) {
    var u = ['bp', 'Kb', 'Mb', 'Gb'];
    for (var i = 0; i < u.length; i++) {
        var b = Math.pow(10, (i + 1) * 3);
        if (a < b) {
            var v = a * 1000 / b;
            if (v == parseInt(v)) {
                return v + ' ' + u[i];
            }
            return v.toFixed(1) + ' ' + u[i];
        }
    }
    return a;
}