/**
 * a group of them can be moved at same time
 but only move up/down for one track at each move
 this is not supposed to be called on splinters
 * @param tkidxlst
 * @param up
 *
 */

Browser.prototype.movetk_hmtk = function (tkidxlst, up) {

    var hmlst = [], nhlst = [], hidelst = [];
    for (var i = 0; i < this.tklst.length; i++) {
        var t = this.tklst[i];
        if (tkishidden(t)) {
            hidelst.push(t);
        }
        else if (t.where == 1) {
            hmlst.push(t);
        }
        else {
            nhlst.push(t);
        }
    }
    if (up) {
        var el = hmlst.splice(tkidxlst[0] - 1, 1)[0];
        hmlst.splice(tkidxlst[tkidxlst.length - 1], 0, el);
    } else {
        var el = hmlst.splice(tkidxlst[tkidxlst.length - 1] + 1, 1)[0];
        hmlst.splice(tkidxlst[0], 0, el);
    }
    var d1 = this.hmdiv;
    var d2 = this.mcm ? this.mcm.tkholder : null;
    var d3 = this.hmheaderdiv;
    for (var i = 0; i < hmlst.length; i++) {
        var t = hmlst[i];
        if (t.canvas) {
            d1.appendChild(t.canvas);
        }
        if (d2 && t.atC) {
            d2.appendChild(t.atC);
        }
        if (d3 && t.header) {
            d3.appendChild(t.header);
        }
    }
    this.tklst = hmlst.concat(nhlst.concat(hidelst));
    this.splinterSynctkorder();
};