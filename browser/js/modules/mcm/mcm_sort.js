/**
 * __Browser.prototype__ <br>
 * sort but not stuffing track doms!
 should call this to separate tracks in and out of ghm
 so that .where 1 and 2 are not mixed
 even when .mcm.lst is empty, can still run
 */

Browser.prototype.mcm_sort = function () {

    if (!this.mcm || !this.mcm.lst) return;
    if (this.weaver && this.weaver.iscotton) {
        // only applies to target
        return;
    }
    var hmlst = [], nhlst = [];
    for (var i = 0; i < this.tklst.length; i++) {
        var tk = this.tklst[i];
        if (tk.where == 1) {
            hmlst.push(tk);
        } else {
            nhlst.push(tk);
        }
    }
    if (this.mcm.lst.length == 0) {
        this.tklst = hmlst.concat(nhlst);
        return;
    }
    if (this.mcm.sortidx >= this.mcm.lst.length) {
        this.mcm.sortidx = 0;
    }
    if (this.weaver) {
        var mdi = getmdidx_internal();
        var t = this.mcm.lst[this.mcm.sortidx];
        if (t[1] == mdi && t[0] == literal_imd_genome) {
            // in case of weaving and clicking genome term name, will sort all tracks by genome
            var ttk = [];
            var g2tk = {};
            for (var n in this.weaver.q) {
                g2tk[n] = [];
            }
            for (var i = 0; i < this.tklst.length; i++) {
                var tk = this.tklst[i];
                tk.where = 1;
                tk.atC.style.display = 'block';
                if (tk.cotton) {
                    g2tk[tk.cotton].push(tk);
                } else {
                    ttk.push(tk);
                }
            }
            for (var n in g2tk) {
                // add weavertk first
                var lst = g2tk[n];
                for (var i = 0; i < lst.length; i++) {
                    if (lst[i].ft == FT_weaver_c) {
                        ttk.push(lst[i]);
                        break;
                    }
                }
                for (var i = 0; i < lst.length; i++) {
                    if (lst[i].ft != FT_weaver_c) {
                        ttk.push(lst[i]);
                    }
                }
            }
            this.tklst = ttk;
            this.trackdom2holder();
            return;
        }
    }
    var m2tk = {_empty_: []};
    for (var i = 0; i < hmlst.length; i++) {
        var tk = hmlst[i];
        var av = tk.attrlst[this.mcm.sortidx];
        if (av == undefined) {
            m2tk._empty_.push(tk);
        } else {
            if (av in m2tk) {
                m2tk[av].push(tk);
            } else {
                m2tk[av] = [tk];
            }
        }
    }
    var newlst = [];
    for (var av in m2tk) {
        if (av == '_empty_') continue;
        for (var i = 0; i < m2tk[av].length; i++) {
            newlst.push(m2tk[av][i]);
        }
    }
    if ('_empty_' in m2tk) {
        for (var i = 0; i < m2tk._empty_.length; i++) {
            newlst.push(m2tk._empty_[i]);
        }
    }
    this.tklst = newlst.concat(nhlst);
    this.trackdom2holder();
    for (var sk in this.splinters) {
        var b = this.splinters[sk];
        if (b.tklst.length != this.tklst.length) continue;
        // cannot call mcm_sort on splinter, no mcm
        var newlst = [];
        for (var i = 0; i < this.tklst.length; i++) {
            var n = this.tklst[i].name + this.tklst[i].cotton;
            for (var j = 0; j < b.tklst.length; j++) {
                var t2 = b.tklst[j];
                if (t2.name + t2.cotton == n) {
                    newlst.push(t2);
                    break;
                }
            }
        }
        b.tklst = newlst;
        b.trackdom2holder();
    }
};