/**
 * ===BASE===// baseFunc // splinterSynctkorder .js
 * @param __Browser.prototype__
 * @param 
 */

Browser.prototype.splinterSynctkorder = function () {
// called from trunk
    for (var tag in this.splinters) {
        var spt = this.splinters[tag];
        var newlst = [];
        for (var j = 0; j < this.tklst.length; j++) {
            var tk = spt.findTrack(this.tklst[j].name);
            tk.where = this.tklst[j].where;
            newlst.push(tk);
        }
        spt.tklst = newlst;
        spt.trackdom2holder();
    }
};


