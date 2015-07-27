/**
 * ===BASE===// splinter // splinter_delete.js
 * @param __Browser.prototype__
 * @param 
 */

Browser.prototype.splinter_delete = function () {
    delete this.trunk.splinters[this.splinterTag];
    this.splinter_abort();
};


/*** __splinter__ ends ***/