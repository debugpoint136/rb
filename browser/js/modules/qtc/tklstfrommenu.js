/**
 * ===BASE===// qtc // tklstfrommenu.js
 * @param __Browser.prototype__
 * @param 
 */

Browser.prototype.tklstfrommenu = function () {
// must always return trunk tracks
    var bbj = this.trunk ? this.trunk : this;
    var lst2 = menu.c53.checkbox.checked ? bbj.tklst : gflag.menu.tklst;
    var lst = [];
    for (var i = 0; i < lst2.length; i++) {
        var t = bbj.findTrack(lst2[i].name, lst2[i].cotton);
        if (!t) continue;
        //if(!tkishidden(t)) {
        if (!tkishidden(t) && t.where != 2) { //dli
            lst.push(t);
        }
    }
    return lst;
};

/*** __qtc__ ends ***/

