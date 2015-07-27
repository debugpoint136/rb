/**
 * ===BASE===// cmtk // cmtk_combinestrands.js
 * @param __Browser.prototype__
 * @param 
 */

Browser.prototype.cmtk_combinestrands = function (tk) {
// combine whatever data is available
    var S = tk.cm.set;
    if (S.rd_f || S.rd_r) {
        tk.cm.data_rd = [];
    }
    if (S.cg_f || S.cg_r) {
        tk.cm.data_cg = [];
    }
    if (S.chg_f || S.chg_r) {
        tk.cm.data_chg = [];
    }
    if (S.chh_f || S.chh_r) {
        tk.cm.data_chh = [];
    }
    if ((S.rd_f && S.rd_r) || (S.cg_f && S.cg_r) || (S.chg_f && S.chg_r) || (S.chh_f && S.chh_r)) {
        // has data for reverse strand
        var bpl = this.entire.atbplevel;
        for (var i = 0; i < this.regionLst.length; i++) {
            var a = [], // rd, combined
                b = [], // cg
                c = [], // chg
                d = []; // chh
            var r = this.regionLst[i];
            var stop = bpl ? (r[4] - r[3]) : r[5];
            for (var j = 0; j < stop; j++) {
                var a1 = S.rd_f ? S.rd_f.data[i][j] : NaN;
                var a2 = S.rd_r ? S.rd_r.data[i][j] : NaN;
                /* rd
                 */
                if (isNaN(a1)) {
                    if (isNaN(a2)) {
                        a[j] = NaN;
                    } else {
                        a[j] = a2;
                    }
                } else {
                    if (isNaN(a2)) {
                        a[j] = a1;
                    } else {
                        a[j] = a1 + a2;
                    }
                }
                /* cg */
                var b1 = S.cg_f ? S.cg_f.data[i][j] : NaN;
                if (bpl) {
                    var b2 = S.cg_r ? S.cg_r.data[i][j + 1] : NaN;
                    var a3 = S.rd_r ? S.rd_r.data[i][j + 1] : NaN;
                    var a_total = (isNaN(a1) ? 0 : a1) + (isNaN(a3) ? 0 : a3);
                    if (a_total == 0) {
                        b[j] = NaN;
                    } else {
                        b[j] = ((isNaN(b1) ? 0 : (b1 * a1)) + (isNaN(b2) ? 0 : (b2 * a3))) / a_total;
                    }
                } else {
                    var b2 = S.cg_r ? S.cg_r.data[i][j] : NaN;
                    if (isNaN(a[j]) || a[j] == 0) {
                        b[j] = NaN;
                    } else {
                        b[j] = ((isNaN(b1) ? 0 : (b1 * a1)) + (isNaN(b2) ? 0 : (b2 * a2))) / a[j];
                    }
                }


                /* figure out chg/chh for "combined"
                 meanwhile apply rd filtering using rd data on respective strand
                 */
                d[j] = NaN; // chh
                var x = S.chg_f ? S.chg_f.data[i][j] : NaN;
                var x_r = S.chg_r ? S.chg_r.data[i][j] : NaN;

                if (tk.cm.combine_chg && bpl) {
                    /* new method, try to combine cag/ctg into single value
                     but not for ccg/cgg
                     but can only use cg_f/cg_r data to tell if at ccg/cgg
                     */
                    if (!isNaN(x)) {
                        if ((S.cg_f && !isNaN(S.cg_f.data[i][j + 1])) || (S.cg_r && !isNaN(S.cg_r.data[i][j + 2]))) {
                            // ccg (first c)
                            c[j] = x;
                        } else {
                            x_r = S.chg_r ? S.chg_r.data[i][j + 2] : NaN;
                            if (isNaN(x_r)) {
                                x_r = 0;
                            }
                            // merge two c: j, j+2
                            var chg_1_rd = S.rd_f.data[i][j],
                                chg_2_rd = S.rd_r.data[i][j + 2];
                            chg_2_rd = isNaN(chg_2_rd) ? 0 : chg_2_rd;
                            c[j] = c[j + 1] = c[j + 2] = ((x * chg_1_rd) + (x_r * chg_2_rd)) / (chg_1_rd + chg_2_rd);
                        }
                    } else if (!isNaN(x_r)) {
                        if ((S.cg_f && !isNaN(S.cg_f.data[i][j - 2])) || (S.cg_r && !isNaN(S.cg_r.data[i][j - 1]))) {
                            // cgg (last c)
                            c[j] = x_r;
                        } else {
                            x = S.chg_f ? S.chg_f.data[i][j - 2] : NaN;
                            if (isNaN(x)) {
                                x = 0;
                            }
                            // merge two c: j-2, j
                            var chg_1_rd = S.rd_f.data[i][j - 2],
                                chg_2_rd = S.rd_r.data[i][j];
                            chg_1_rd = isNaN(chg_1_rd) ? 0 : chg_1_rd;
                            c[j] = c[j - 1] = c[j - 2] = ((x * chg_1_rd) + (x_r * chg_2_rd)) / (chg_1_rd + chg_2_rd);
                        }
                    }
                } else {
                    /* old method
                     applies to all cases, no matter if at bp level
                     */
                    if (!isNaN(x)) {
                        c[j] = x;
                        if (tk.cm.filter && a1 < tk.cm.filter) {
                            c[j] = NaN;
                        }
                    } else {
                        if (!isNaN(x_r)) {
                            c[j] = x_r;
                            if (tk.cm.filter && a2 < tk.cm.filter) {
                                c[j] = NaN;
                            }
                        }
                    }
                }

                // chh
                var x = S.chh_f ? S.chh_f.data[i][j] : NaN;
                if (!isNaN(x)) {
                    d[j] = x;
                    if (tk.cm.filter && a1 < tk.cm.filter) {
                        d[j] = NaN;
                    }
                } else {
                    x = S.chh_r ? S.chh_r.data[i][j] : NaN;
                    if (!isNaN(x)) {
                        d[j] = x;
                        if (tk.cm.filter && a2 < tk.cm.filter) {
                            d[j] = NaN;
                        }
                    }
                }
            }
            if (tk.cm.data_rd) {
                tk.cm.data_rd.push(a);
            }
            if (tk.cm.data_cg) {
                tk.cm.data_cg.push(b);
            }
            if (tk.cm.data_chg) {
                tk.cm.data_chg.push(c);
            }
            if (tk.cm.data_chh) {
                tk.cm.data_chh.push(d);
            }
        }
    } else {
        // no reverse data
        if (S.rd_f) {
            tk.cm.data_rd = S.rd_f.data;
        }
        if (S.cg_f) {
            tk.cm.data_cg = S.cg_f.data;
        }
        if (S.chg_f) {
            tk.cm.data_chg = S.chg_f.data;
        }
        if (S.chh_f) {
            tk.cm.data_chh = S.chh_f.data;
        }
    }
};

