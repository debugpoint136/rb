/**
 * ===BASE===// track // customgenomeparam.js
 * @param __Genome.prototype__
 * @param 
 */

Genome.prototype.customgenomeparam = function () {
    if (!this.iscustom) return '';
    var lst = [];
    for (var n in this.scaffold.len) {
        lst.push(n);
        lst.push(this.scaffold.len[n]);
    }
    return '&iscustomgenome=on&scaffoldlen=' + lst.join(',');
};


