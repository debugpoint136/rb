/**
 * sets tkobj.attrlst[mdcidx] using the attr value in .attrhash.....
 * __Browser.prototype__
 * @param term
 * @param mdcidx - bbj.mcm.lst array idx
 * @param tkobj - tklst array element
 */

Browser.prototype.recursiveFetchTrackAttr = function (term, mdcidx, tkobj) {

    var mdidx = this.mcm.lst[mdcidx][1];
    if (!tkobj.md[mdidx]) {
        // no md hash for this voc
        return;
    }
    var voc = gflag.mdlst[mdidx];
    if (!(term in voc.p2c)) {
        // leaf
        if (term in tkobj.md[mdidx]) {
            tkobj.attrlst[mdcidx] = term;
        }
        return;
    }
    for (var cterm in voc.p2c[term]) {
        this.recursiveFetchTrackAttr(cterm, mdcidx, tkobj);
    }
};