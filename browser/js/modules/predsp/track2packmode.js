/**
 * ===BASE===// predsp // track2packmode.js
 * @param __Browser.prototype__
 * @param 
 */

Browser.prototype.track2packmode = function (tk) {
    var data2 = [];
    for (var i = 0; i < tk.data.length; i++) {
        var lst2 = [];
        for (var j = 0; j < tk.data[i].length; j++) {
            var item = tk.data[i][j];
            var ni = item.name2 ? item.name2 : item.name;
            var keep = true;
            for (var k = 0; k < lst2.length; k++) {
                var a = lst2[k].start,
                    b = lst2[k].stop,
                    nk = lst2[k].name2 ? lst2[k].name2 : lst2[k].name;
                if (a <= item.start && b >= item.stop && nk == ni) {
                    // do nothing
                    keep = false;
                    break;
                } else if (a >= item.start && b <= item.stop) {
                    lst2.splice(k, 1, item);
                    keep = false;
                    break;
                } else if (Math.max(a, item.start) < Math.min(b, item.stop)) {
                    // try name
                    if (nk == ni) {
                        if (b - a < item.stop - item.start) {
                            lst2.splice(k, 1, item);
                        }
                        keep = false;
                        break;
                    }
                }
            }
            if (keep) {
                lst2.push(item);
            }
        }
        data2.push(lst2);
    }
    tk.data = data2;
    var oldheight = tk.canvas.height;
    this.stack_track(tk, 0);
    this.drawTrack_browser(tk);
    if (tk.canvas.height != oldheight) {
        this.trackHeightChanged();
    }
};


