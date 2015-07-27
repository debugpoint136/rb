/**
 * ===BASE===// menu // removeTrack_obj.js
 * @param __Browser.prototype__
 * @param 
 */

Browser.prototype.removeTrack_obj = function (objlst) {
    var lst = [];
    for (var i = 0; i < objlst.length; i++) {
        var tk = objlst[i];
        lst.push(tk.name);
        if (tk.ft == FT_cm_c) {
            var s = tk.cm.set;
            if (s.cg_f) lst.push(s.cg_f.name);
            if (s.cg_r) lst.push(s.cg_r.name);
            if (s.chg_f) lst.push(s.chg_f.name);
            if (s.chg_r) lst.push(s.chg_r.name);
            if (s.chh_f) lst.push(s.chh_f.name);
            if (s.chh_r) lst.push(s.chh_r.name);
            if (s.rd_f) lst.push(s.rd_f.name);
            if (s.rd_r) lst.push(s.rd_r.name);
        } else if (tk.ft == FT_matplot) {
            for (var j = 0; j < tk.tracks.length; j++) {
                lst.push(tk.tracks[j].name);
            }
        }
    }
    this.removeTrack(lst);
};


