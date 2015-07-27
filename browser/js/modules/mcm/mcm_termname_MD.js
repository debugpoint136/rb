/**
 * for rearranging term canvas in mcm
 * @param event
 */

function mcm_termname_MD(event) {
    if (event.button != 0) return;
    event.preventDefault();
    var lst = gflag.browser.mcm.lst;
    for (var i = 0; i < lst.length; i++) {
        if (lst[i][1] == event.target.mdidx && lst[i][0] == event.target.termname) {
            break;
        }
    }
    gflag.mcmtermmove = {
        idx: i,
        mx: event.clientX
    };
    document.body.addEventListener('mousemove', mcm_termname_M, false);
    document.body.addEventListener('mouseup', mcm_termname_MU, false);
}