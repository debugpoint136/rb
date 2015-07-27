/**
 * ===BASE===// wvfind // wvfind_export.js
 * @param 
 */

function wvfind_export() {
    var doc = window.open().document;
    var table = doc.createElement('table');
    doc.body.appendChild(table);
    table.cellPadding = 5;
    table.border = 1;
    var tr = table.insertRow(0);
    var td = tr.insertCell(0);
    td.innerHTML = apps.wvfind.bbj.genome.name;
    for (var i = 0; i < apps.wvfind.queries.length; i++) {
        td = tr.insertCell(1);
        td.innerHTML = apps.wvfind.queries[i][0];
    }
    for (var i = 0; i < apps.wvfind.rlst.length; i++) {
        var e = apps.wvfind.rlst[i];
        tr = table.insertRow(-1);
        td = tr.insertCell(0);
        td.innerHTML = (e.isgene ? (e.name2 ? e.name2 : e.name) + ' ' : '') + e.chr + ':' + e.start + '-' + e.stop;
        for (var j = 0; j < apps.wvfind.queries.length; j++) {
            var qn = apps.wvfind.queries[j][0];
            td = tr.insertCell(-1);
            if (qn in e.hit) {
                var e2 = e.hit[qn][0];
                td.innerHTML = (e2.querygene ? (e2.querygene.name2 ? e2.querygene.name2 : e2.querygene.name) + ' ' : '') + e2.chr + ':' + e2.start + '-' + e2.stop;
            }
        }
    }
}
