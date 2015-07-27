/**
 * ===BASE===// scaffold // addnewscaffold.js
 * @param __Genome.prototype__
 * @param 
 */

Genome.prototype.addnewscaffold = function (lst) {
    for (var i = 0; i < lst.length; i++) {
        if (lst[i] in this.scaffold.len) {
            this.scaffold.current.push(lst[i])
        }
    }
    this.scfdoverview_makepanel();
    this.scfd_cancelconfigure();
    var lastone = this.scaffold.current[this.scaffold.current.length - 1];
    this.border.rname = lastone;
    this.border.rpos = this.scaffold.len[lastone];
};

