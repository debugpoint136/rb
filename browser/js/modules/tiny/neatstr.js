/**
 * @param num
 * @return <code>a + '.' + b;</code><br><br><br>
 */

function neatstr(num) {
// try make it "%.6g"
//var s = num.toFixed(6);
    var s = num.toFixed(2); //dli
    if (s.indexOf('.') == -1) return s;
    var lst = s.split('.');
    var a = lst[0], b = lst[1];
    while (b.length > 0 && b[b.length - 1] == '0') {
        b = b.substr(0, b.length - 1);
    }
    if (b.length == 0) {
        return a;
    }
    return a + '.' + b;
}
