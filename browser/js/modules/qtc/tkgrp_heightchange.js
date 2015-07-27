/**
 * ===BASE===// qtc // tkgrp_heightchange.js
 * @param __Browser.prototype__
 * @param 
 */

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


