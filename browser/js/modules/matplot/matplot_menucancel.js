/**
 * ===BASE===// matplot // matplot_menucancel.js
 * @param 
 */

function matplot_menucancel() {
    var mlst = [];
    for (var i = 0; i < gflag.menu.tklst.length; i++) {
        var t = gflag.menu.tklst[i];
        if (t.ft == FT_matplot) {
            mlst.push(t);
        }
    }
    if (mlst.length == 0) {
        print2console('No matplot', 2);
        menu_hide();
        return;
    }
    var bbj = gflag.menu.bbj;
    if (bbj.trunk) {
        bbj = bbj.trunk;
        // note! invoking menu on splinter, so gflag.menu.tklst are all splinter display obj, must convert to trunk obj
        var lst = [];
        for (var i = 0; i < mlst.length; i++) {
            var t = bbj.findTrack(mlst[i].name);
            if (t) {
                lst.push(t);
            } else {
                print2console('trunk matplot missing ' + mlst[i].name, 2);
            }
        }
        mlst = lst;
    }
    for (var i = 0; i < mlst.length; i++) {
        var mtk = mlst[i];
        bbj.delete_custtk([mtk.name]);
        //delete bbj.genome.hmtk[mtk.name];
        for (var j = 0; j < mtk.tracks.length; j++) {
            var t = mtk.tracks[j];
            delete t.mastertk;
            bbj.drawTrack_browser(t);
            bbj.drawMcm_onetrack(t);
            if (isCustom(t)) {
                // member may be native
                delete bbj.genome.hmtk[t.name].mastertk;
            }
        }
        bbj.removeTrack([mtk.name]);
        for (var k in bbj.splinters) {
            var b2 = bbj.splinters[k];
            for (var j = 0; j < mtk.tracks.length; j++) {
                var t = b2.findTrack(mtk.tracks[j].name);
                if (t) {
                    delete t.mastertk;
                    b2.drawTrack_browser(t);
                } else {
                    print2console('matplot member ' + t.name + ' missing in splinter', 2);
                }
            }
            //b2.removeTrack([mtk.name]);
        }
    }
    bbj.trackdom2holder();
    for (var k in bbj.splinters) {
        bbj.splinters[k].trackdom2holder();
    }
    menu_hide();
}

