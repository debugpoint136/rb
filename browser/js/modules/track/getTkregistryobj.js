/**
 * ===BASE===// track // getTkregistryobj.js
 * @param __Genome.prototype__
 * @param 
 */

Genome.prototype.getTkregistryobj = function (name, ft) {
    var o = this.hmtk[name];
    if (!o) {
        o = this.decorInfo[name];
        if (!o) {
            if (__request_tk_registryobj) {
                o = __request_tk_registryobj(name, ft);
            }
        }
    }
    return o;
};


