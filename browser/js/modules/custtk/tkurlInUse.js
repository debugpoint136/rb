/**
 * ===BASE===// custtk // tkurlInUse.js
 * @param __Genome.prototype__
 * @param 
 */

Genome.prototype.tkurlInUse = function (url) {
    for (var t in this.hmtk) {
        var tk = this.hmtk[t];
        if (isCustom(tk.ft) && tk.url == url) return true;
    }
    return false;
};


