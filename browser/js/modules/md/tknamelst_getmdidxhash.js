/**
 * __Browser.prototype__ <br>
 * given a list of tknames, need to update all facet associated with those tracks
 find out mdidx and give a hash of it
 * @param namelst
 */

Browser.prototype.tknamelst_getmdidxhash = function (namelst) {

    var hash = {};
    for (var i = 0; i < namelst.length; i++) {
        var o = this.genome.hmtk[namelst[i]];
        if (o && o.md) {
            for (var j = 0; j < o.md.length; j++) {
                if (o.md[j]) {
                    hash[j] = 1;
                }
            }
        }
    }
    return hash;
};
