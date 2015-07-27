/**
 * ===BASE===// track // track_click_multiselect.js
 * @param __Browser.prototype__
 * @param 
 */

Browser.prototype.track_click_multiselect = function (tkname, cotton) {
    /* must be called on a trunk
     */
    var tk = this.findTrack(tkname, cotton);
    if (!tk) {
        print2console(tkname + ' went missing', 2);
        return;
    }
// refresh gflag.menu.tklst, use only selected
    gflag.menu.tklst = [];
    for (var i = 0; i < this.tklst.length; i++) {
        var t = this.tklst[i];
        if (t.menuselected) {
            // only preserve those that are real and selected
            gflag.menu.tklst.push(t);
        }
    }
    var isnew = true;
    var tcn = tkname + cotton;
    for (var i = 0; i < gflag.menu.tklst.length; i++) {
        var t = gflag.menu.tklst[i];
        if (t.name + t.cotton == tcn) {
            // this track was selected, de-select it
            isnew = false;
            gflag.menu.tklst.splice(i, 1);
            tk.header.style.backgroundColor = '';
            tk.menuselected = false;
            break;
        }
    }
    if (isnew) {
        tk.menuselected = true;
        tk.header.style.backgroundColor = 'yellow';
        gflag.menu.tklst.push(tk);
    }
};

