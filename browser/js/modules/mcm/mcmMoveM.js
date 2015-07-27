/**
 *
 */

function mcmMoveM(event) {
    var m = gflag.mcmMove;
    var bbj = m.bbj;
    var cy = event.clientY + document.body.scrollTop;
    var up = true;
    if (cy > m.oldy) {
        if (cy > m.basey + bbj.hmdiv.clientHeight) return;
        up = false;
    } else if (cy < m.oldy) {
        if (cy < m.basey) return;
    } else {
        return;
    }
    if (up) {
        if (m.tkarr[0] == 0) return;
        if (m.oldy - cy >= tk_height(bbj.tklst[m.tkarr[0] - 1])) {
            bbj.movetk_hmtk(m.tkarr, true);
            m.oldy = cy;
            m.tkarr = bbj.getHmtkIdxlst_mcmCell(m.midx, bbj.tklst[m.tkarr[0] - 1].name, bbj.tklst[m.tkarr[0] - 1].cotton);
            var lst = [];
            for (var i = 0; i < m.tkarr.length; i++) lst.push(bbj.tklst[m.tkarr[i]]);
            bbj.highlighttrack(lst);
        }
    } else {
        if (m.tkarr[m.tkarr.length - 1] == bbj.hmdiv.childNodes.length - 1) return;
        if (cy - m.oldy >= tk_height(bbj.tklst[m.tkarr[m.tkarr.length - 1] + 1])) {
            bbj.movetk_hmtk(m.tkarr, false);
            m.oldy = cy;
            m.tkarr = bbj.getHmtkIdxlst_mcmCell(m.midx, bbj.tklst[m.tkarr[m.tkarr.length - 1] + 1].name, bbj.tklst[m.tkarr[m.tkarr.length - 1] + 1].cotton);
            var lst = [];
            for (var i = 0; i < m.tkarr.length; i++) lst.push(bbj.tklst[m.tkarr[i]]);
            bbj.highlighttrack(lst);
        }
    }
}