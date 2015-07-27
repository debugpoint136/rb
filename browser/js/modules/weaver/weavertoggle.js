/**
 * ===BASE===// weaver // weavertoggle.js
 * @param __Browser.prototype__
 * @param 
 */

Browser.prototype.weavertoggle = function (width) {
    if (!this.weaver) return;
    if (this.weaver.iscotton) return; // cottonbbj does not deal with it
    var lst = this.tklst;
    if (width < this.hmSpan * W_togglethreshold) {
        this.weaver.mode = W_fine;
        for (var i = 0; i < lst.length; i++) {
            var t = lst[i];
            if (t.ft == FT_weaver_c) {
                /*
                 if(this.genome.iscustom || ((t.cotton in genome) && genome[t.cotton].iscustom)) {
                 // either target or query genome is custom
                 t.weaver.mode=W_rough;
                 t.qtc.stackheight=fullStackHeight;
                 } else {
                 }
                 */
                t.weaver.mode = W_fine;
                t.qtc.stackheight = weavertkstackheight;
            }
        }
        for (var n in this.weaver.q) {
            this.weaver.q[n].weaver.mode = W_fine;
        }
        return;
    }
// large view range, rough mode
    this.weaver.mode = W_rough;
    for (var i = 0; i < lst.length; i++) {
        var t = lst[i];
        if (t.ft == FT_weaver_c) {
            t.weaver.mode = W_rough;
            t.qtc.stackheight = fullStackHeight;
        }
    }
    this.weaver.insert = [];
    for (var n in this.weaver.q) {
        this.weaver.q[n].weaver.mode = W_rough;
    }
};


