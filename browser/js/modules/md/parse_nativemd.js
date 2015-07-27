/**
 * arg: registry object, from mdlst to md
 * @param tk
 */

function parse_nativemd(tk) {

    if (!tk.mdlst) return;
    if (!tk.md) tk.md = [];
    var s = {};
    for (var i = 0; i < tk.mdlst.length; i++) {
        s[tk.mdlst[i]] = 1;
    }
    tk.md[0] = s;
    delete tk.mdlst;
}