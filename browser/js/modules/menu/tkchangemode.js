/**
 * ===BASE===// menu // tkchangemode.js
 * @param __Browser.prototype__
 * @param 
 */

Browser.prototype.tkchangemode = function (tk, mode) {
    tk.mode = mode;
    this.ajax_addtracks([tk]);
    for (var tag in this.splinters) {
        var tk2 = this.splinters[tag].findTrack(tk.name);
        tk2.mode = mode;
        this.splinters[tag].ajax_addtracks([tk2]);
    }
};

