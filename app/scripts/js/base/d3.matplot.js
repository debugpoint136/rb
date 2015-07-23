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

function config_matplot(tk) {
    qtcpanel_setdisplay({
        qtc: tk.qtc,
        ft: tk.ft,
        no_log: true,
        no_smooth: true,
    });
    menu.c51.sharescale.style.display = 'none';
    stripChild(menu.c13, 0);
    var t = dom_create('table', menu.c13, 'color:inherit;');
    t.cellSpacing = 5;
    for (var i = 0; i < tk.tracks.length; i++) {
        var t2 = tk.tracks[i];
        var tr = t.insertRow(-1);
        var td = tr.insertCell(0);
        td.className = 'squarecell';
        var q = t2.qtc;
        td.style.backgroundColor = 'rgb(' + q.pr + ',' + q.pg + ',' + q.pb + ')';
        td.onclick = matplot_linecolor_initiate;
        td.tkidx = i;
        tr.insertCell(1).innerHTML = t2.label;
    }
    menu.c13.style.display = 'block';
    menu.c14.style.display = 'block';
    menu.c14.unify.style.display = 'none';
}

function matplot_linecolor_initiate(event) {
    paletteshow(event.clientX, event.clientY, 14);
    palettegrove_paint(event.target.style.backgroundColor);
    gflag.menu.matplottkcell = event.target;
}

function matplot_linecolor() {
    gflag.menu.matplottkcell.style.backgroundColor = palette.output;
    var mat = gflag.menu.tklst[0];
    var target = mat.tracks[gflag.menu.matplottkcell.tkidx];
    var x = colorstr2int(palette.output);
    target.qtc.pr = x[0];
    target.qtc.pg = x[1];
    target.qtc.pb = x[2];
    gflag.menu.bbj.matplot_drawtk(mat, target);
    gflag.menu.bbj.drawTrack_header(mat);
}


Browser.prototype.matplot_drawtk = function (mtk, tk, tosvg) {
    /* draw a tk as a line
     * tk should already be in mtk.tklst
     * mtk scale should be defined and should not change!
     args:
     mtk: matplot tk
     tk: the tk of the path
     */
    var q = tk.qtc;
    var d = this.tkplot_line({
        ctx: mtk.canvas.getContext('2d'),
        tk: tk,
        max: mtk.maxv,
        min: mtk.minv,
        color: 'rgb(' + q.pr + ',' + q.pg + ',' + q.pb + ')',
        linewidth: 2,
        x: 0,
        y: densitydecorpaddingtop,
        w: (this.entire.atbplevel ? this.entire.bpwidth : 1),
        h: mtk.qtc.height,
        pointup: true, tosvg: tosvg
    });
    if (tosvg) return d;
};


/*** __matplot__ ends **/