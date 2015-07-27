/**
 * ===BASE===// track // multipleselect_cancel.js
 * @param __Browser.prototype__
 * @param 
 */

Browser.prototype.multipleselect_cancel = function () {
    var bbj = this;
    if (bbj.trunk) bbj = bbj.trunk;
    for (var i = 0; i < bbj.tklst.length; i++) {
        var t = bbj.tklst[i];
        t.menuselected = false;
        if (t.header) {
            t.header.style.backgroundColor = '';
        }
    }
    gflag.menu.tklst = [];
};


