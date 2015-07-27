/**
 * ===BASE===// wvfind // wvfind_2golden.js
 * @param 
 */

function wvfind_2golden() {
    var J = {};
    for (var n in apps.wvfind.goldengenomes) {
        J[n] = {};
    }
    J[apps.wvfind.bbj.genome.name].wvfind = {rlst: apps.wvfind.rlst, queries: apps.wvfind.queries};
    apps.wvfind.goldenbutt.disabled = true;
    ajaxPost('json\n' + JSON.stringify(J), function (key) {
        wvfind_2golden_cb(key);
    });
}
