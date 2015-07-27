/**
 * ===BASE===// drawTk // updateTrack.js
 * @param __Browser.prototype__
 * @param 
 */

Browser.prototype.updateTrack = function (tk, changeheight) {
// by updating various controls, color, scale, height.. no svg
    var bbj = this;
    if (this.splinterTag) {
        bbj = this.trunk;
        var t = bbj.findTrack(tk.name);
        if (!t) {
            print2console(tk.name + ' is missing from trunk', 2);
            return;
        }
        tk = t;
    }
    if (tk.cotton && tk.ft != FT_weaver_c) {
        // a cotton track
        if (!bbj.weaver.iscotton) {
            /* calling from target bbj but must use cottonbbj to draw cottontk
             since need to observe cotton.weaver.insert
             */
            bbj = bbj.weaver.q[tk.cotton];
        }
    }
    bbj.stack_track(tk, 0);
    bbj.drawTrack_browser(tk);
    if (changeheight) {
        bbj.drawMcm_onetrack(tk);
        bbj.trackHeightChanged();
        // must adjust for splinters
        for (var tag in bbj.splinters) {
            bbj.splinters[tag].trackHeightChanged();
        }
        if (indicator3.style.display == 'block') {
            /* adjust indicator3
             in case of right clicking on splinter, must use splinter bbj which is registered in gflag.menu.bbj
             */
            var b2 = menu.style.display == 'block' ? gflag.menu.bbj : bbj;
            if (menu.c53.checkbox.checked) {
                indicator3cover(b2);
            } else {
                b2.highlighttrack(gflag.menu.tklst);
            }
        }
    }
};
