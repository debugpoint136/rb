/**
 * ===BASE===// weaver // targetBypassQuerytk.js
 * @param __Browser.prototype__
 * @param 
 */

Browser.prototype.targetBypassQuerytk = function (t) {
    if (!this.weaver) return false;
    if (this.weaver.iscotton) {
        // cottonbbj
        return false;
    }
// target bbj
    if (t.cotton && t.ft != FT_weaver_c) return true;
    return false;
};


