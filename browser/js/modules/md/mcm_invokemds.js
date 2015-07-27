/**
 * __Browser.prototype__
 * show mdselect ui
 * select terms to be displayed in metadata colormap
 */

Browser.prototype.mcm_invokemds = function () {
    /* show mdselect ui
     select terms to be displayed in metadata colormap
     */
// uncheck all boxes
    for (var i = 0; i < gflag.mdlst.length; i++) {
        var voc = gflag.mdlst[i];
        for (var t in voc.checkbox) {
            voc.checkbox[t].checked = false;
        }
    }
    for (var i = 0; i < this.mcm.lst.length; i++) {
        var t = this.mcm.lst[i];
        gflag.mdlst[t[1]].checkbox[t[0]].checked = true;
    }
    var hd = this.mcm.tkholder;
    var pos = absolutePosition(hd);
    if (pos[0] + hd.clientWidth + 300 > document.body.clientWidth + document.body.scrollLeft) {
        // place panel on left of mcm
        this.genome.invokemds(1, pos[0] - 200 - document.body.scrollLeft, pos[1] - document.body.scrollTop);
    } else {
        // place panel on right of mcm
        this.genome.invokemds(1, pos[0] + hd.clientWidth + 5 - document.body.scrollLeft, pos[1] - document.body.scrollTop);
    }
};