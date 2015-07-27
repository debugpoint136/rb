/**
 * @param t
 */

function jsontext_removecomment(t) {
    var lines = t.split('\n');
    if (lines.length == 0) return null;
    var nlst = [];
    for (var i = 0; i < lines.length; i++) {
        var l = lines[i].trim();
        if (l[0] == '#') continue;
        nlst.push(l);
    }
    return nlst.join('');
}