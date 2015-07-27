/**
 * ===BASE===// cmtk // cmtk_detail.js
 * @param 
 */

function cmtk_detail(tk, A, B) {
// A: region id, B: spnum
    if (tk.cm.combine) {
        var a = tk.cm.data_cg[A][B];
        var d = tk.cm.data_rd[A][B];
        var b = NaN, // chg
            b_rd; // chg rd, asymmetrical, use rd data on original strand!!
        if (tk.cm.data_chg) {
            b = tk.cm.data_chg[A][B];
            if (!isNaN(b)) {
                if (isNaN(tk.cm.set.chg_f.data[A][B])) {
                    b_rd = tk.cm.set.rd_r.data[A][B];
                } else {
                    b_rd = tk.cm.set.rd_f.data[A][B];
                }
            }
        }
        var c = NaN, // chh
            c_rd; // chh rd
        if (tk.cm.data_chh) {
            c = tk.cm.data_chh[A][B];
            if (!isNaN(c)) {
                if (isNaN(tk.cm.set.chh_f.data[A][B])) {
                    c_rd = tk.cm.set.rd_r.data[A][B];
                } else {
                    c_rd = tk.cm.set.rd_f.data[A][B];
                }
            }
        }
        return '<div style="color:white;"><table style="margin:5px;color:inherit;"><tr>' +
            (isNaN(d) ? '<td colspan=2>no reads</td>' : '<td>Combined read depth</td><td>' + parseInt(d) + '</td>') + '</tr><tr>' +
            (isNaN(a) ? '' : '<td><div class=squarecell style="display:inline-block;background-color:' + tk.cm.color.cg_f + ';"></div> CG</td><td>' + neat_0t1(a) + '</td>') +
            '</tr><tr>' +
                // chg
            (isNaN(b) ? '' : '<td><div class=squarecell style="display:inline-block;background-color:' + tk.cm.color.chg_f + ';"></div> CHG</td><td>' + neat_0t1(b) +
            (tk.cm.combine_chg ? '' : ' <span style="font-size:70%">(strand-specific read depth: ' + parseInt(b_rd) + ')</span>') +
            '</td>') +
            '</tr><tr>' +
                // chh
            (isNaN(c) ? '' : '<td><div class=squarecell style="display:inline-block;background-color:' + tk.cm.color.chh_f + ';"></div> CHH</td><td>' + neat_0t1(c) + ' <span style="font-size:70%">(strand-specific read depth: ' + parseInt(c_rd) + ')</span></td>') +
            '</tr></table>' +
            '</div>';
    }
    var s = tk.cm.set;
    var a1 = s.cg_f.data[A][B],
        b1 = s.chg_f ? s.chg_f.data[A][B] : NaN,
        c1 = s.chh_f ? s.chh_f.data[A][B] : NaN,
        d1 = s.rd_f.data[A][B],
        a2 = s.cg_r ? s.cg_r.data[A][B] : NaN,
        b2 = s.chg_r ? s.chg_r.data[A][B] : NaN,
        c2 = s.chh_r ? s.chh_r.data[A][B] : NaN,
        d2 = s.rd_r ? s.rd_r.data[A][B] : NaN;
    return '<div style="color:white;"><table style="margin:5px;color:inherit;">' +
        '<tr><td style="font-size:150%">&raquo;</td>' +
        (isNaN(d1) ? '<td colspan=2>no reads</td>' : '<td>Read depth</td><td>' + parseInt(d1) + '</td>') +
        '</tr><tr><td></td>' +
        (isNaN(a1) ? '' : '<td><div class=squarecell style="display:inline-block;background-color:' + tk.cm.color.cg_f + ';"></div> CG</td><td>' + neat_0t1(a1) + '</td>') +
        '</tr><tr><td></td>' +
        (isNaN(b1) ? '' : '<td><div class=squarecell style="display:inline-block;background-color:' + tk.cm.color.chg_f + ';"></div> CHG</td><td>' + neat_0t1(b1) + '</td>') +
        '</tr><tr><td></td>' +
        (isNaN(c1) ? '' : '<td><div class=squarecell style="display:inline-block;background-color:' + tk.cm.color.chh_f + ';"></div> CHH</td><td>' + neat_0t1(c1) + '</td>') +
        '</tr><tr><td style="font-size:150%;">&laquo;</td>' +
        (isNaN(d2) ? '<td colspan=2>no reads</td>' : '<td>Read depth</td><td>' + parseInt(d2) + '</td>') +
        '</tr><tr><td></td>' +
        (isNaN(a2) ? '' : '<td><div class=squarecell style="display:inline-block;background-color:' + tk.cm.color.cg_r + ';"></div> CG</td><td>' + neat_0t1(a2) + '</td>') +
        '</tr><tr><td></td>' +
        (isNaN(b2) ? '' : '<td><div class=squarecell style="display:inline-block;background-color:' + tk.cm.color.chg_r + ';"></div> CHG</td><td>' + neat_0t1(b2) + '</td>') +
        '</tr><tr><td></td>' +
        (isNaN(c2) ? '' : '<td><div class=squarecell style="display:inline-block;background-color:' + tk.cm.color.chh_r + ';"></div> CHH</td><td>' + neat_0t1(c2) + '</td>') +
        '</tr></table>' +
        '</div>';
}
/** __cmtk__ ends */