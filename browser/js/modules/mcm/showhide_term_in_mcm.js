/**
 * show or remove a term from mcm
 term follows bbj.mcm.lst style [term, mdidx]
 * @param term
 * @param show
 */

Browser.prototype.showhide_term_in_mcm = function (term, show) {

    if (!this.mcm) return;
    if (show) {
        for (var i = 0; i < this.mcm.lst.length; i++) {
            var t = this.mcm.lst[i];
            if (t[1] == term[1] && t[0] == term[0]) return;
        }
        this.mcm.lst.push(term);
    } else {
        for (var i = 0; i < this.mcm.lst.length; i++) {
            var s = this.mcm.lst[i];
            if (s[1] == term[1] && s[0] == term[0]) {
                this.mcm.lst.splice(i, 1);
                break;
            }
        }
    }
    this.initiateMdcOnshowCanvas();
    this.prepareMcm();
    this.drawMcm();
    this.__mcm_termchange();
};