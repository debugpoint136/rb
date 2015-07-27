/**
 * ===BASE===// wvfind // wvfind_app_cb.js
 * @param 
 */

function wvfind_app_cb(maxbp) {
    apps.wvfind.submitbutt.disabled = false;
    apps.wvfind.submitbutt.innerHTML = 'Find orthologs';
    if (!maxbp) {
        apps.wvfind.error.style.display = 'block';
        return;
    }
    apps.wvfind.error.style.display = 'none';
    var queries = [];
    var bbj = apps.wvfind.bbj;
    for (var n in bbj.weaver.q) {
        for (var i = 0; i < bbj.tklst.length; i++) {
            var t = bbj.tklst[i];
            if (t.ft == FT_weaver_c && t.cotton == n) {
                queries.push([n, t.qtc.bedcolor]);
                break;
            }
        }
    }
    apps.wvfind.queries = queries;
    wvfind_showresult(apps.wvfind);
    apps.wvfind.textbutt.style.display = 'inline';
//apps.wvfind.trackbutt.style.display= 'inline';
    if (bbj.genome.name in apps.wvfind.goldengenomes) {
        var all = true;
        for (var i = 0; i < apps.wvfind.queries.length; i++) {
            if (!(apps.wvfind.queries[i][0] in apps.wvfind.goldengenomes)) {
                all = false;
            }
        }
        if (all) {
            apps.wvfind.goldenbutt.style.display = 'inline';
        }
    }
}

