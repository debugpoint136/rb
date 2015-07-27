/**
 * __Browser.prototype__ <br>
 */

/*** __mcm__ colormap **/

Browser.prototype.mcm_mayaddgenome = function () {
    if (!this.mcm) return;
// show genome in mcm
    var mdi = getmdidx_internal();
    if (mdi == -1) return;
    for (var k = 0; k < this.mcm.lst.length; k++) {
        var mt = this.mcm.lst[k];
        if (mt[1] == mdi && mt[0] == literal_imd_genome) return k;
    }
    this.mcm.lst.push([literal_imd_genome, mdi]);
    return this.mcm.lst.length - 1;
};