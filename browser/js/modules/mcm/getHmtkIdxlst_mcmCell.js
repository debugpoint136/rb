/**
 * @param  mcidx - bbj.mcm.lst array idx
 * @param tkname - hmtk name
 * @param cotton
 * @return null if clicked on an area with no annotation data.
 */

Browser.prototype.getHmtkIdxlst_mcmCell = function (mcidx, tkname, cotton) {

    var tkidx = -1;
    for (var i = 0; i < this.tklst.length; i++) {
        if (this.tklst[i].name == tkname) {
            if (cotton && this.tklst[i].cotton == cotton) {
                tkidx = i;
                break;
            } else if (!cotton && !this.tklst[i].cotton) {
                tkidx = i;
                break;
            }
        }
    }
    if (tkidx == -1) return null;
    var m = this.tklst[tkidx].attrlst[mcidx];
    if (m == undefined) return null;
// all tracks in the same color block
    var tkarr = [tkidx];
    for (i = tkidx - 1; i >= 0; i--) {
        if (this.tklst[i].attrlst[mcidx] == m)
            tkarr.unshift(i);
        else
            break;
    }
    for (i = tkidx + 1; i < this.tklst.length; i++) {
        if (this.tklst[i].where != 1) break;
        if (this.tklst[i].attrlst[mcidx] == m)
            tkarr.push(i);
        else
            break;
    }
    return tkarr;
};