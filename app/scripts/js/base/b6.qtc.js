/**
 * Created by dpuru on 2/27/15.
 */


/*** __qtc__ ***/

function qtc2json(q) {
    var lst = [];
    for (var attr in q) {
        var v = q[attr];
        lst.push(attr + ':' + (typeof(v) == 'string' ? '"' + v + '"' : v));
    }
    return '{' + lst.join(',') + '}';
}


function qtc_color1_initiator(event) {
    paletteshow(event.clientX, event.clientY, 30);
    palettegrove_paint(event.target.style.backgroundColor);
}
function qtc_color2_initiator(event) {
    paletteshow(event.clientX, event.clientY, 31);
    palettegrove_paint(event.target.style.backgroundColor);
}
function qtc_color1_1_initiator(event) {
    paletteshow(event.clientX, event.clientY, 32);
    palettegrove_paint(event.target.style.backgroundColor);
}
function qtc_color2_1_initiator(event) {
    paletteshow(event.clientX, event.clientY, 33);
    palettegrove_paint(event.target.style.backgroundColor);
}

function indicator3cover(bbj) {
    var c = absolutePosition(bbj.hmdiv.parentNode);
//placeIndicator3(c[0], c[1], bbj.hmSpan,
//	bbj.hmdiv.clientHeight+bbj.ideogram.canvas.height+bbj.decordiv.clientHeight+bbj.tklst.length);
    placeIndicator3(c[0], c[1], bbj.hmSpan, bbj.hmdiv.clientHeight); //dli, apply to all don't select track under ideogram
}

function toggle15(event) {
    /* called by changing "apply to all tracks" checkbox in qtc panel
     only for browser tk, not bev or such
     when changing it, do not automatically apply style...
     */
    var bbj = gflag.menu.bbj;
    if (event.target.checked) {
        indicator3cover(bbj);
        menu.c14.unify.style.display = bbj.tklst.length > 1 ? 'table-cell' : 'none';
    } else {
        bbj.highlighttrack(gflag.menu.tklst);
        menu.c14.unify.style.display = gflag.menu.tklst.length > 1 ? 'table-cell' : 'none';
    }
}


function menu_tkh_change(event) {
    /* called by pushing buttons in menu: increase, decrease, unify
     centralized place to process track height change, by .menu.context:
     - browser track
     - wreath track
     - bev track
     */
    var changetype = event.target.changetype;
    var bbj = gflag.menu.bbj;
    if (bbj.trunk) bbj = bbj.trunk;
    switch (gflag.menu.context) {
        case 1:
        case 2:
            // configuring browser track
            var gooverlst = bbj.tklstfrommenu();
            var gooverlst2 = null;
            var changeamount = null;
            if (changetype == 1) {
                gooverlst2 = gooverlst;
                changeamount = event.target.amount;
            } else if (changetype == 2) {
                /* find a consensus height and set everybody to it
                 for numerical and cat: find and use a height most commonly used
                 if mixed numerical and lr, only do numerical
                 for lr:
                 */
                var h_nc = {}; // px height of numerical and cat
                var tklst_nc = [];
                var h_lr = {}; // anglescale of lr
                var tklst_lr = [];
                for (var i = 0; i < gooverlst.length; i++) {
                    var tk = gooverlst[i];
                    if (isNumerical(tk) || tk.ft == FT_cat_n || tk.ft == FT_cat_c || tk.ft == FT_catmat || tk.ft == FT_qcats || tk.ft == FT_weaver_c || tk.mode == M_bar) {
                        tklst_nc.push(tk);
                        var h = tk.qtc.height;
                        if (h in h_nc) h_nc[h]++;
                        else h_nc[h] = 1;
                    } else if (tk.ft == FT_lr_c || tk.ft == FT_lr_n) {
                        tklst_lr.push(tk);
                        var s = tk.qtc.anglescale;
                        if (s in h_lr) h_lr[s]++;
                        else h_lr[s] = 1;
                    }
                }
                if (tklst_nc.length > 0) {
                    var mcount = 0, mheight = 0;
                    for (var h in h_nc) {
                        if (h_nc[h] > mcount) {
                            mcount = h_nc[h];
                            /* 2013-3-20 confusing bug at vizbi
                             when number is used as object attr, it is converted to string
                             */
                            mheight = parseInt(h);
                        }
                    }
                    gooverlst2 = tklst_nc;
                    changeamount = mheight;
                } else if (tklst_lr.length > 0) {
                    var mcount = 0, mheight = 0;
                    for (var h in h_lr) {
                        if (h_lr[h] > mcount) {
                            mcount = h_lr[h];
                            mheight = parseFloat(h);
                        }
                    }
                    gooverlst2 = tklst_lr;
                    changeamount = mheight;
                }
            } else {
                return;
            }
            if (gooverlst2 == null) return;
            if (gooverlst2.length == 0) return;
            bbj.tkgrp_heightchange(gooverlst2, changetype, changeamount);
            for (var i = 0; i < gooverlst2.length; i++) {
                bbj.updateTrack(gooverlst2[i], true);
            }
            return;
        case 19:
            // wreath, for 1 track
            var obj = apps.circlet.hash[gflag.menu.viewkey].wreath[gflag.menu.wreathIdx];
            obj.qtc.height = Math.max(10, obj.qtc.height + event.target.amount);
            hengeview_draw(gflag.menu.viewkey);
            return;
        case 20:
            // bev, always only one
            var obj = bbj.genome.bev.tklst[gflag.menu.bevtkidx];
            obj.qtc.height = Math.max(10, obj.qtc.height + event.target.amount);
            bbj.genome.bev_draw_track(obj);
            return;
        default:
            fatalError('uknown menu context');
    }
}

Browser.prototype.tkgrp_heightchange = function (_tklst, type, amount) {
    /* change height of a group of tracks
     args:
     _tklst
     type:
     1 increase or reduce height by a given amount
     2 set all heights to the amount
     */
    for (var i = 0; i < _tklst.length; i++) {
        var tk = _tklst[i];
        if (isNumerical(tk) || tk.ft == FT_cat_n || tk.ft == FT_cat_c || tk.ft == FT_qcats || tk.ft == FT_matplot || tk.ft == FT_cm_c || tk.ft == FT_weaver_c || tk.mode == M_bar) {
            // set by .qtc.height
            if (type == 1) {
                tk.qtc.height = Math.max(3, tk.qtc.height + amount);
            } else {
                tk.qtc.height = amount;
            }
            for (var a in this.splinters) {
                var t2 = this.splinters[a].findTrack(tk.name);
                if (!t2) continue;
                t2.qtc.height = tk.qtc.height;
            }
        } else if (tk.ft == FT_catmat) {
            tk.rowheight = Math.max(1, tk.rowheight + (amount > 0 ? 1 : -1));
            tk.qtc.height = 1 + tk.rowheight * tk.rowcount;
        } else if (tk.ft == FT_lr_c || tk.ft == FT_lr_n || tk.ft == FT_ld_c || tk.ft == FT_ld_n) {
            // set by .qtc.anglescale
            if (type == 1) {
                if (amount >= 1 || amount <= -1) amount /= 50;
                var v = tk.qtc.anglescale + amount;
                if (v < 0.5) v = 0.5;
                else if (v > 1) v = 1;
                tk.qtc.anglescale = v;
            } else {
                tk.qtc.anglescale = amount;
            }
            for (var a in this.splinters) {
                var t2 = this.splinters[a].findTrack(tk.name);
                if (!t2) continue;
                t2.qtc.anglescale = tk.qtc.anglescale;
            }
        }
    }
};


function qtc_percentile(event) {
// clicking button to change y scale percentile
    var v = parseInt(menu.c51.percentile.says.innerHTML);
    v += event.target.change;
    if (v < 0) v = 0;
    else if (v > 100) v = 100;
    menu.c51.percentile.says.innerHTML = v + ' percentile';
    menu_update_track(7);
}


Browser.prototype.tklstfrommenu = function () {
// must always return trunk tracks
    var bbj = this.trunk ? this.trunk : this;
    var lst2 = menu.c53.checkbox.checked ? bbj.tklst : gflag.menu.tklst;
    var lst = [];
    for (var i = 0; i < lst2.length; i++) {
        var t = bbj.findTrack(lst2[i].name, lst2[i].cotton);
        if (!t) continue;
        //if(!tkishidden(t)) {
        if (!tkishidden(t) && t.where != 2) { //dli
            lst.push(t);
        }
    }
    return lst;
};

/*** __qtc__ ends ***/

function stc_fontfamily() {
    menu_update_track(12);
}
function stc_fontsize(event) {
    menu.font.sizeincrease = event.target.increase;
    menu_update_track(14);
}
function stc_fontbold() {
    menu_update_track(13);
}
function stc_longrange_pcolorscore_KU(event) {
    if (event.keyCode == 13) stc_longrange_pcolorscore();
}
function stc_longrange_pfilterscore_KU(event) {
    if (event.keyCode == 13) stc_longrange_pfilterscore();
}
function stc_longrange_ncolorscore_KU(event) {
    if (event.keyCode == 13) stc_longrange_ncolorscore();
}
function stc_longrange_nfilterscore_KU(event) {
    if (event.keyCode == 13) stc_longrange_nfilterscore();
}
