/**
 * ===BASE===// cache // refreshcache_clickhandle_closure.js
 * @param __Browser.prototype__
 * @param 
 */

Browser.prototype.refreshcache_clickhandle_closure = function (tk, s) {
    var bbj = this;
    return function () {
        bbj.refreshcache_clickhandle(tk, s);
    };
};

