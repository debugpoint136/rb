/**
 * ===BASE===// track // findTrack.js
 * @param __Browser.prototype__
 * @param 
 */

Browser.prototype.findTrack = function (tkname, cotton) {
// display object
    for (var i = 0; i < this.tklst.length; i++) {
        var t = this.tklst[i];
        if (t.name == tkname) {
            if (t.ft == FT_weaver_c) {
                /* better logic here
                 target bbj finding weavertk, no worry about cotton
                 */
                return t;
            }
            if (this.weaver && this.weaver.iscotton) {
                // cottonbbj looking through
                return t;
            }
            if (cotton) {
                if (t.cotton && cotton == t.cotton) return t;
            } else {
                if (!t.cotton) return t;
            }
        }
    }
    return null;
};

