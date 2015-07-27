/**
 * arg: bbj.mcm.lst array index
 make tk.attrlst[mdcidx] for each track
 different treatment for native/custom metadata
 @ param mdcidx
 */

Browser.prototype.prepareMcM_oneterm = function (mdcidx) {

    /* ! expansion: md may supply color for each term
     */
    var term = this.mcm.lst[mdcidx][0];
    var tidhash = {};
    for (var i = 0; i < this.tklst.length; i++) {
        this.recursiveFetchTrackAttr(term, mdcidx, this.tklst[i]);
        var tid = this.tklst[i].attrlst[mdcidx];
        if (tid != undefined) {
            tidhash[tid] = 1;
        }
    }
    var i = 0, clen = colorCentral.longlst.length;
    var mdobj = gflag.mdlst[this.mcm.lst[mdcidx][1]];
    for (var tid in tidhash) {
        if (tid in mdobj.idx2color) {
            tidhash[tid] = mdobj.idx2color[tid];
        } else {
            if (i >= clen) {
                var f = parseInt(i / clen);
                tidhash[tid] = darkencolor(colorstr2int(colorCentral.longlst[i % clen]), f < 10 ? f / 10 : 1);
            } else {
                tidhash[tid] = colorCentral.longlst[i];
            }
            i++;
        }
    }
    for (i = 0; i < this.tklst.length; i++) {
        var t = this.tklst[i];
        var tid = t.attrlst[mdcidx];
        t.attrcolor[mdcidx] = (tid == undefined) ? colorCentral.foreground_faint_5 : tidhash[tid];
    }
};