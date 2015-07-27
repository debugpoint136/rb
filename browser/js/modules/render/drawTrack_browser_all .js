/**
 * ===BASE===// render // drawTrack_browser_all .js
 * @param __Browser.prototype__
 * @param 
 */

Browser.prototype.drawTrack_browser_all = function () {
    /**** track group
     grouped tracks shares y scale
     shared scale will only be computed here
     but not when updating a single track
     assume that this func will always be called for track updating
     Note:
     can get Y scale directly from numerical tracks
     BUT hammock tracks need to be stacked first then get Y scale
     */
    var bbj = this;
    var callfromtrunk = false;
    if (this.trunk) {
        /* if scrolling splinters, numerical track scale must be kept sync, must switch to trunk for calling
         */
        var usescale = false;
        for (var i = 0; i < this.tklst.length; i++) {
            var t = this.tklst[i];
            if (tkishidden(t) || t.cotton) continue;
            if (isNumerical(t) || t.mode == M_bar || t.ft == FT_matplot) {
                usescale = true;
                break;
            }
        }
        if (usescale) {
            bbj = this.trunk;
            callfromtrunk = true;
        }
    }

// stack hammock tracks
    for (var i = 0; i < bbj.tklst.length; i++) {
        bbj.stack_track(bbj.tklst[i], 0);
    }

    if (callfromtrunk) {
        for (var h in bbj.splinters) {
            var b = bbj.splinters[h];
            for (var i = 0; i < b.tklst.length; i++) {
                b.stack_track(b.tklst[i], 0);
            }
        }
    }
// prepare track groups
    var gidxhash = {};
    for (var i = 0; i < bbj.tklst.length; i++) {
        var gidx = bbj.tklst[i].group;
        if (gidx != undefined) {
            gidxhash[gidx] = 1;
        }
    }
    for (var gidx in gidxhash) {
        if (!bbj.tkgroup[gidx]) {
            /* on starting up, tkgroup not initiated yet
             may move this part to somewhere else?
             */
            bbj.tkgroup[gidx] = {scale: scale_auto};
        }
        bbj.tkgroup_setYscale(gidx);
    }
    for (var i = 0; i < bbj.tklst.length; i++) {
        bbj.drawTrack_browser(bbj.tklst[i], false);
    }
    bbj.trackHeightChanged();
    bbj.placeMovable(bbj.move.styleLeft);
    if (callfromtrunk) {
        for (var h in bbj.splinters) {
            var b = bbj.splinters[h];
            b.trackHeightChanged();
            b.placeMovable(b.move.styleLeft);
        }
    }
};


