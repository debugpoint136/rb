/**
 * ===BASE===// wvfind // wvfind_apprun.js
 * @param 
 */

function wvfind_apprun() {
    if (!apps.wvfind.geneset) {
        print2console('Please select a gene set.', 2);
        return;
    }
    apps.wvfind.tracks = {};
    apps.wvfind.goldenbutt.style.display =
//apps.wvfind.trackbutt.style.display=
        apps.wvfind.textbutt.style.display = 'none';
    stripChild(apps.wvfind.table, 0);
    apps.wvfind.rlst = wvfind_gs2lst(apps.wvfind.geneset.lst);
    var bbj = apps.wvfind.bbj;
    var wtks = [], oldmodes = {};
    for (var i = 0; i < bbj.tklst.length; i++) {
        var t = bbj.tklst[i];
        if (t.ft == FT_weaver_c) {
            wtks.push(t);
            oldmodes[t.name] = t.weaver.mode;
            t.weaver.mode = W_rough;
        }
    }
    if (wtks.length == 0) {
        fatalError('no weaver tk');
    }
    apps.wvfind.submitbutt.disabled = true;
    apps.wvfind.submitbutt.innerHTML = 'Running...';
    bbj.wvfind_run(apps.wvfind.rlst, wtks, wvfind_app_cb);
    for (var i = 0; i < wtks.length; i++) {
        wtks[i].weaver.mode = oldmodes[wtks[i].name];
    }
}

