/**
 * ===BASE===// custtk // tkCount.js
 * @param __Browser.prototype__
 * @param 
 */

Browser.prototype.tkCount = function () {
    var total = 0, ctotal = 0;
    for (var k in this.genome.hmtk) {
        var t = this.genome.hmtk[k];
        if (!t.mastertk) {
            total++;
            if (!t.public && isCustom(t.ft)) {
                ctotal++;
            }
        }
    }
    return [total, ctotal];
};

/*** __custtk__ ends ***/