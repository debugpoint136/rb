/**
 * @param uph
 * @return 1 <br><br><br>
 */

function parseUrlparam(uph) {
    if (window.location.href.indexOf('?') == -1) {
        return 0;
    }
    var lst = window.location.href.split('?')[1].split('&');
    for (var i = 0; i < lst.length; i++) {
        var t = lst[i].split('=');
        if (t.length == 2 && t[0].length > 0 && t[1].length > 0) {
            uph[t[0].toLowerCase()] = t[1];
        } else {
            return -1;
        }
    }
    return 1;
}