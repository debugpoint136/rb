/**
 * @param s
 * @return undefined <br><br><br>
 */

function decormodestr2num(s) {
    var m = s.toLowerCase();
    if (m == 'hide') return M_hide;
    if (m == 'show') return M_show;
    if (m == 'thin') return M_thin;
    if (m == 'full') return M_full;
    if (m == 'arc') return M_arc;
    if (m == 'trihm') return M_trihm;
    if (m == 'heatmap') return M_trihm;
    if (m == 'density') return M_den;
    if (m == 'barplot') return M_bar;
    return undefined;
}