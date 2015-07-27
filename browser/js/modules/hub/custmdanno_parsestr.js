/**
 * @param str
 * @param obj
 */

function custmdanno_parsestr(str, obj) {
// obsolete from tabular datahub
    if (str == 'n/a') return false;
    var s = {};
    var lst = str.split(',');
    var err = false;
    for (var i = 0; i < lst.length; i++) {
        var t = lst[i].split(':');
        if (t.length != 2) {
            err = true;
            continue;
        }
        s[t[1]] = 1;
    }
    if (!obj.md) {
        obj.md = [];
    }
    obj.md[1] = s;
    return err;
}