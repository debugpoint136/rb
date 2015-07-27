/**
 * ===BASE===// splinter // may_init_pending_splinter.js
 * @param __Browser.prototype__
 * @param 
 */

Browser.prototype.may_init_pending_splinter = function (coord) {
// only for app-created splinters
    if (!this.__pending_splinter) return false;
    delete this.__pending_splinter;
    if (!this.splinterTag) fatalError('may_init_pending_splinter: splinterTag missing');
    this.main.style.display = 'block';
    this.main.parentNode.removeChild(this.main.nextSibling.nextSibling);
    var pa = {mustaddcusttk: true, coord_rawstring: coord};
    this.trunk.bbjparamfillto_tk(pa);
    this.init_bbj_param = pa;
    this.trunk.splinters[this.splinterTag] = this;
    this.ajax_loadbbjdata(pa);
    return true;
};

