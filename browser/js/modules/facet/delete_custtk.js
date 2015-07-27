/**
 * ===BASE===// facet // delete_custtk.js
 * @param __Browser.prototype__
 * @param 
 */

Browser.prototype.delete_custtk = function (names) {
// permanent removal
    var pending = [];
    for (var i = 0; i < names.length; i++) {
        var t = this.genome.hmtk[names[i]];
        if (!t) {
            print2console('registry object not found: ' + names[i], 2);
            return;
        }
        if (this.findTrack(names[i])) {
            this.removeTrack([names[i]]);
        }
        if (t.ft == FT_cm_c) {
            var s = t.cm.set;
            if (s.cg_f) pending.push(s.cg_f);
            if (s.cg_r) pending.push(s.cg_r);
            if (s.chg_f) pending.push(s.chg_f);
            if (s.chg_r) pending.push(s.chg_r);
            if (s.chh_f) pending.push(s.chh_f);
            if (s.chh_r) pending.push(s.chh_r);
            if (s.rd_f) pending.push(s.rd_f);
            if (s.rd_r) pending.push(s.rd_r);
        }
        delete this.genome.hmtk[names[i]];
        for (var j = 0; j < this.genome.custtk.names.length; j++) {
            if (this.genome.custtk.names[j] == names[i]) {
                this.genome.custtk.names.splice(j, 1);
                break;
            }
        }
    }
    if (pending.length > 0) {
        this.delete_custtk(pending);
    }
};

