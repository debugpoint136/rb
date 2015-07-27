/**
 * ===BASE===// custtk // newcustomtrackname.js
 * @param __Genome.prototype__
 * @param 
 */

Genome.prototype.newcustomtrackname = function () {
    var n = Math.random().toString().split('.')[1];
    while ((n in this.hmtk) || (n in this.decorInfo))
        n = Math.random().toString().split('.')[1];
    return n;
};

