/**
 * Created by dpuru on 2/27/15.
 */
/*** __matplot__ **/

function matplot_menucreate() {
// create obj
    var nlst = [], olst = [];
    for (var i = 0; i < gflag.menu.tklst.length; i++) {
        var t = gflag.menu.tklst[i];
        if (isNumerical(t)) {
            nlst.push(t.name);
            olst.push(t);
        }
    }
    if (nlst.length == 0) {
        print2console('Cannot make matplot: no numerical tracks', 2);
        menu_hide();
        return;
    }
    var bbj = gflag.menu.bbj;
    if (bbj.trunk) {
        bbj = bbj.trunk;
    }
    var mtk0 = {
        name: bbj.genome.newcustomtrackname(),
        label: 'matplot wrap',
        ft: FT_matplot,
        mode: M_show,
        tracks: nlst, // must be names
    };
    bbj.genome.registerCustomtrack(mtk0);
    var mtk = bbj.makeTrackDisplayobj(mtk0.name, FT_matplot);
    for (var i = 0; i < olst.length; i++) {
        var t = olst[i];
        t.mastertk = mtk;
        // must also alter registry obj
        var o = bbj.genome.getTkregistryobj(t.name, t.ft);
        if (!o) {
            print2console('missing registry obj for ' + t.label, 2);
        } else {
            o.mastertk = mtk.name;
        }
        bbj.removeTrackCanvas(t);
    }
    bbj.tklst.push(mtk);
    bbj.trackdom2holder();
    bbj.drawTrack_browser(mtk);
    for (var k in bbj.splinters) {
        var b2 = bbj.splinters[k];
        var mtk2 = b2.makeTrackDisplayobj(mtk0.name, FT_matplot);
        for (var i = 0; i < nlst.length; i++) {
            var t = b2.findTrack(nlst[i]);
            if (t) {
                t.mastertk = mtk2;
                b2.removeTrackCanvas(t);
            }
        }
        b2.tklst.push(mtk2);
        b2.trackdom2holder();
        b2.drawTrack_browser(mtk2);
    }
    bbj.prepareMcm();
    bbj.drawMcm_onetrack(mtk);
    menu_hide();
    bbj.multipleselect_cancel();
}
