/**
 * ===BASE===// decor // adddecorparam.js
 * @param __Browser.prototype__
 * @param 
 */

Browser.prototype.adddecorparam = function (names) {
    var lst = [];
    for (var i = 0; i < names.length; i++) {
        var o = this.genome.decorInfo[names[i]];
        if (!o) {
            print2console('Unrecognized native track: ' + names[i], 2);
            continue;
        }
        var o2 = duplicateTkobj(o);
        o2.mode = o.defaultmode ? o.defaultmode : tkdefaultMode(o);
        // XXXb
        if (names[i].indexOf('snp') != -1) {
            var v = this.getDspStat();
            if (v[0] == v[2]) {
                if (v[3] - v[1] >= 20000) {
                    o2.mode = M_den;
                }
            } else {
                o2.mode = M_den;
            }
        }
        lst.push(o2);
    }
    if (lst.length == 0) return;
    if (!this.init_bbj_param) {
        this.init_bbj_param = {tklst: []};
    }
    /* is there a track list in init_bbj_param?
    * no? let's create it */
    if (!this.init_bbj_param.tklst) {
        this.init_bbj_param.tklst = [];
    }
    /* now take the list created at the beginning of this function
    * and merge the whole thing into init_bbj_param's track list */
    this.init_bbj_param.tklst = this.init_bbj_param.tklst.concat(lst);
};


/* __decor__ ends */

