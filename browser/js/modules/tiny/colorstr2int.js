/**
 * accepts #aabbcc or rgb(12,23,34)
 * @param what
 * @return c <br><br><br>
 */

function colorstr2int(what) {
// accepts #aabbcc or rgb(12,23,34)
    var c = [0, 0, 0];
    if (what.charAt(0) == "#") {
        if (what.length == 4) {
            c[0] = parseInt(what.charAt(1) + what.charAt(1), 16);
            c[1] = parseInt(what.charAt(2) + what.charAt(2), 16);
            c[2] = parseInt(what.charAt(3) + what.charAt(3), 16);
        } else {
            c[0] = parseInt(what.substr(1, 2), 16);
            c[1] = parseInt(what.substr(3, 2), 16);
            c[2] = parseInt(what.substr(5, 2), 16);
        }
    } else {
        var lst = what.split(',');
        c[0] = parseInt(lst[0].split('(')[1]);
        c[1] = parseInt(lst[1]);
        c[2] = parseInt(lst[2]);
    }
    return c;
}