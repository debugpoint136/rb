/**
 * ===BASE===// track // removeTrack.js
 * @param __Browser.prototype__
 * @param 
 */

Browser.prototype.removeTrack = function (namelst) {
    /* remove a track from view
     special treatment for matplot
     no special for cmtk
     */
    var hashmtk = false;
    for (var i = 0; i < namelst.length; i++) {
        var tk = this.findTrack(namelst[i]);
        if (!tk) continue;
        if (!tkishidden(tk)) {
            this.removeTrackCanvas(tk);
            if (tk.where == 1) {
                hashmtk = true;
            }
        }
        for (var j = 0; j < this.tklst.length; j++) {
            if (this.tklst[j].name == namelst[i]) {
                this.tklst.splice(j, 1);
                break;
            }
        }
    }
    if (this.weaver && this.weaver.iscotton) {
        // cottonbbj removing, must also remove from target
        var tbj = this.weaver.target;
        for (var i = 0; i < namelst.length; i++) {
            for (var j = 0; j < tbj.tklst.length; j++) {
                var t = tbj.tklst[j];
                if (t.name == namelst[i] && t.cotton == this.genome.name) {
                    tbj.tklst.splice(j, 1);
                    break;
                }
            }
        }
    }
// after removing
    var bbj = this;
    if (this.weaver && this.weaver.iscotton) {
        bbj = this.weaver.target;
    }
    if (hashmtk) {
        bbj.prepareMcm();
        bbj.drawMcm();
    }
    bbj.trackHeightChanged();
// to solve the problem that trihm pillars don't hide
    indicator.style.display = indicator6.style.display = 'none';
    bbj.aftertkaddremove(namelst);
    for (var tag in this.splinters) {
        this.splinters[tag].removeTrack(namelst);
    }
};


