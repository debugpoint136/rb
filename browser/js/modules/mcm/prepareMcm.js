/**
 * requires:
 bbj.mcm.lst and tklst[x].md
 */

Browser.prototype.prepareMcm = function () {

// wipe out old data
    if (!this.mcm || !this.mcm.lst) return;
    for (var i = 0; i < this.tklst.length; i++) {
        var tk = this.tklst[i];
        if (tkishidden(tk)) continue;
        tk.attrlst = [];
        tk.attrcolor = [];
    }
    for (i = 0; i < this.mcm.lst.length; i++) {
        this.prepareMcM_oneterm(i);
    }
};