/**
 * ===BASE===// track // findSnp_ldtk.js
 * @param 
 */

function findSnp_ldtk(tk, item, item2) {
    /* item: tk.data_trihm
     item2: tk.data_chiapet
     */
    var a = item2.boxstart + item2.boxwidth;
    var rs1 = null, rs2 = null;
    for (var k in tk.ld.hash) {
        var x = tk.ld.hash[k].bottomx;
        if (rs1 == null && (x > item2.boxstart && x < item2.boxstart + item[2])) {
            rs1 = k;
            if (rs2 != null) return [rs1, rs2];
        }
        if (rs2 == null && (x > a - item[3] && x < a)) {
            rs2 = k;
            if (rs1 != null) return [rs1, rs2];
        }
    }
    return [rs1, rs2];
}

