/**
 * __Genome.prototype__
 * @param term
 * @param p2c
 * @param lst
 */

Genome.prototype.mdvGetallchild = function (term, p2c, lst) {
    if (term in p2c) {
        for (var cterm in p2c[term]) {
            lst.push(cterm);
            this.mdvGetallchild(cterm, p2c, lst);
        }
    }
};