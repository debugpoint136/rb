/**
 * ===BASE===// menu // menu_track_browser.js
 * @param 
 */

function menu_track_browser(event) {
    /* over a track in main browser panel
     or a splinter
     */
    menu_shutup();

    var bbj = gflag.browser;
    var tk = bbj.findTrack(event.target.tkname, event.target.cotton);
    if (!tk) return;

// deal with multiple select, needs trunk track
    var sbj = bbj.splinterTag ? bbj.trunk : bbj;
    var t0 = sbj.findTrack(event.target.tkname, event.target.cotton);
    if (!t0) fatalError('missing trunk tk');
    if (t0.menuselected) {
        // click on a multi-selected track
        gflag.menu.tklst = [];
        var qtknum = 0;
        for (var i = 0; i < sbj.tklst.length; i++) {
            var t = sbj.tklst[i];
            if (t.menuselected) {
                gflag.menu.tklst.push(t);
                if (isNumerical(t) && isCustom(t.ft)) {
                    qtknum++;
                }
            }
        }
        menu_show(2, event.clientX, event.clientY);
        menu.c1.style.display =
            menu.c5.style.display =
                menu.c54.style.display =
                    menu.c4.style.display = 'block';
        menu.c1.innerHTML = gflag.menu.tklst.length + ' selected';
        indicator3.style.display = 'none';
        if (qtknum > 1) menu.c64.style.display = 'block';
        return false;
    } else {
        /* doing multiple select, now clicked on a tk that's not selected
         need to cancel the selection
         */
        sbj.multipleselect_cancel();
    }

    menu_show(1, event.clientX, event.clientY);
    if (tk.cotton && tk.ft != FT_weaver_c) {
        // a cottontk, should switch to cottonbbj
        if (!bbj.weaver.iscotton) {
            gflag.menu.bbj = bbj.weaver.q[tk.cotton];
        }
    }

    gflag.menu.tklst = [tk];
    bbj.highlighttrack([tk]);

    menu.c5.style.display = // conf
        menu.c4.style.display = // x
            menu.c16.style.display = 'block'; // info

    if (isCustom(tk.ft)) {
        if (menu.c19) menu.c19.style.display = 'block';
        if (!tk.public) {
            if (menu.c58) menu.c58.style.display = 'block';
        }
    }

    menu.c22.packbutt.style.display = 'none';
    switch (tk.ft) {
        case FT_qdecor_n:
            if (menu.c20) menu.c20.style.display = 'block';
            break;
        case FT_bedgraph_c:
        case FT_bedgraph_n:
            if (menu.c20) menu.c20.style.display = 'block'; // bev
            break;
        case FT_bigwighmtk_c:
        case FT_bigwighmtk_n:
            if (menu.c20) menu.c20.style.display = 'block';
            break;
        case FT_bed_n:
        case FT_bed_c:
        case FT_anno_n:
        case FT_anno_c:
            /*
             if(tk.dbsearch && menu.c47) {
             // search
             menu.c47.style.display='block';
             stripChild(menu.c47.table,0);
             }
             */
            menu.c16.style.display = 'block'; // info
            menu.c22.style.display = 'block';
            if (gflag.allow_packhide_tkdata && tk.mode == M_full) {
                // pack mode only available for bed and hammock
                menu.c22.packbutt.style.display = 'block';
                // alert: must make copy of tk here...
                var tk2 = tk;
                menu.c22.packbutt.onclick = function () {
                    bbj.track2packmode(tk2);
                    menu_hide();
                };
            }
            menu_showmodebutt(tk);
            if (!tk.issnp) {
                if (menu.c20) menu.c20.style.display = 'block';
                // do not allow this on snp tk
                if (bbj.juxtaposition.type == bbj.genome.defaultStuff.runmode) {
                    menu.c12.style.display = 'block';
                    menu.c2.style.display = 'none';
                } else {
                    menu.c2.style.display = 'block';
                    menu.c12.style.display = 'none';
                }
            }
            break;
//case FT_sam_n: case FT_sam_c:
        case FT_bam_n:
        case FT_bam_c:
            menu.c22.style.display = 'block';
            menu_showmodebutt(tk);
            if (bbj.juxtaposition.type == bbj.genome.defaultStuff.runmode) {
                menu.c2.style.display = 'none';
            } else {
                menu.c2.style.display = 'block';
            }
            break;
        case FT_lr_n:
        case FT_lr_c:
            if (menu.c3) {
                menu.c3.style.display = tk.mode == M_den ? 'none' : 'block';
            }
            menu_showmodebutt(tk);
            if (bbj.juxtaposition.type == bbj.genome.defaultStuff.runmode) {
                menu.c2.style.display = 'none';
            } else {
                menu.c2.style.display = 'block';
            }
            break;
        case FT_cat_c:
        case FT_cat_n:
            if (menu.c20) menu.c20.style.display = 'block'; // bev
            break;
        case FT_matplot:
            menu.c65.style.display = 'block';
            break;
        case FT_cm_c:
        case FT_ld_c:
        case FT_ld_n:
            break;
        case FT_weaver_c:
            menu.c4.style.display = 'none';
            if (tk.reciprocal) {
                menu.c62.style.display = 'block';
                //menu.c63.style.display=
                menu.c62.childNodes[1].innerHTML = 'Use <strong><span style="color:' + tk.qtc.bedcolor + '">' + tk.cotton + '</span></strong> as reference';
                //menu.c63.childNodes[1].innerHTML='Find <strong><span style="color:'+tk.qtc.bedcolor+'">'+tk.cotton+'</span></strong> regions';
            }
            break;
        case FT_catmat:
            break;
        case FT_qcats:
            break;
        default:
            print2console('invoking menu on tk of unknown ft', 2);
    }

    if (tk.ft in FT2noteurl) {
        menu.c61.style.display = 'block';
        menu.c61.firstChild.innerHTML = 'about ' + FT2verbal[tk.ft] + ' track';
        var ft = tk.ft;
        menu.c61.firstChild.onclick = function () {
            window.open(FT2noteurl[ft])
        };
    }

// any associated regions?
    var tk = bbj.genome.hmtk[event.target.tkname];
    if (tk != undefined && tk.regions != undefined) {
        var opt = menu.tk2region_showlst;
        opt.style.display = 'block';
        opt.childNodes[1].innerHTML = tk.regions[0];
    }
    return false;
}

