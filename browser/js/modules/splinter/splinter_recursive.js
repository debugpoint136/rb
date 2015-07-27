/**
 * ===BASE===// splinter // splinter_recursive.js
 * @param __Browser.prototype__
 * @param 
 */

Browser.prototype.splinter_recursive = function (callback) {
    if (!this.splinter_pending) return;
    if (this.splinter_pending.length == 0) {
        delete this.splinter_pending;
        return;
    }
    this.splinter_make(this.splinter_pending.splice(0, 1)[0], callback);
};

