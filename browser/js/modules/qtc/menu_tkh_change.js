/**
 * ===BASE===// qtc // menu_tkh_change.js
 * @param 
 */

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

