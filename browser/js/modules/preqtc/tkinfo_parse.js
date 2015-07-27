/**
 * ===BASE===// preqtc // tkinfo_parse.js
 * @param 
 */

function tkinfo_parse(text, hash) {
    var lst = text.split('; ');
    for (var i = 0; i < lst.length; i++) {
        var idx = lst[i].indexOf('=');
        if (idx == -1) continue;
        hash[lst[i].substr(0, idx)] = lst[i].substr(idx + 1);
    }
}
