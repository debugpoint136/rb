/**
 * clicking on mcm term name canvas
 * @param event
 */

function mcm_termname_click(event) {
    var bbj = gflag.browser;
    for (var i = 0; i < bbj.mcm.lst.length; i++) {
        var s = bbj.mcm.lst[i];
        if (s[1] == event.target.mdidx && s[0] == event.target.termname) break;
    }
    if (i == bbj.mcm.lst.length) return;
    bbj.mcm.sortidx = i;
    bbj.mcm.manuallysorted = true;
    bbj.mcm_sort();
}