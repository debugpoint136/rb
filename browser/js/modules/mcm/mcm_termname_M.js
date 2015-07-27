/**
 * @param event
 */

function mcm_termname_M(event) {
    event.preventDefault();
    var m = gflag.mcmtermmove;
    var bbj = gflag.browser;
    var mdlst = bbj.mcm.lst;
    if (event.clientX > m.mx) {
        // to right
        if (m.idx == mdlst.length - 1) return;
        if (event.clientX - m.mx >= tkAttrColumnWidth) {
            var ss = mdlst[m.idx + 1];
            mdlst[m.idx + 1] = mdlst[m.idx];
            mdlst[m.idx] = ss;
            bbj.initiateMdcOnshowCanvas();
            bbj.prepareMcm();
            bbj.drawMcm();
            m.mx = event.clientX;
            m.idx++;
        }
    } else if (event.clientX < m.mx) {
        // to left
        if (m.idx == 0) return;
        if (m.mx - event.clientX >= tkAttrColumnWidth) {
            var ss = mdlst[m.idx - 1];
            mdlst[m.idx - 1] = mdlst[m.idx];
            mdlst[m.idx] = ss;
            bbj.initiateMdcOnshowCanvas();
            bbj.prepareMcm();
            bbj.drawMcm();
            m.mx = event.clientX;
            m.idx--;
        }
    }
}