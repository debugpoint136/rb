/**
 * press mouse on .atC
 */

function mcm_Mdown(event) {

    if (event.button != 0) return;
    event.preventDefault();
    var pos = absolutePosition(event.target);
    var mcidx = parseInt((event.clientX + document.body.scrollLeft - pos[0]) / tkAttrColumnWidth);
    var bbj = gflag.browser;
    var tkarr = bbj.getHmtkIdxlst_mcmCell(mcidx, event.target.tkname, event.target.cotton);
    if (tkarr == null) return;
    var lst = [];
    for (var i = 0; i < tkarr.length; i++) {
        lst.push(bbj.tklst[tkarr[i]]);
    }
    bbj.highlighttrack(lst);
    gflag.mcmMove = {
        bbj: bbj,
        oldy: event.clientY + document.body.scrollTop,
        basey: absolutePosition(event.target.parentNode)[1],
        tkarr: tkarr,
        midx: mcidx
    };
    document.body.addEventListener('mousemove', mcmMoveM, false);
    document.body.addEventListener('mouseup', mcmMoveMU, false);
}