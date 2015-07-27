/**
 * ===BASE===// cmtk // cmtk_init.js
 * @param __Browser.prototype__
 * @param 
 */

Browser.prototype.cmtk_init = function (tk) {
// arg is master cm tkobj
    for (var n in tk.cm.set) {
        var n2 = tk.cm.set[n];
        var t = this.findTrack(n2);
        if (!t) {
            print2console('methylC track is missing a member track: ' + n2, 2);
            alertbox_addmsg({text: 'methylC track "' + tk.label + '" is dropped because it is missing member track for ' + n2});
            delete tk.cm.set[n];
        } else {
            t.mastertk = tk;
            tk.cm.set[n] = t;
            t.canvas.style.display = 'none';
            if (t.header) t.header.style.display = 'none';
            if (t.atC) t.atC.style.display = 'none';
        }
    }
};


