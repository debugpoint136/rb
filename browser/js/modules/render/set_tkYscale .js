/**
 * ===BASE===// render // set_tkYscale .js
 * @param __Browser.prototype__
 * @param 
 */

Browser.prototype.set_tkYscale = function (tk) {
    if (tk.group != undefined) {
        // group scale should have been computed
        var t = this.tkgroup[tk.group];
        tk.maxv = t.max;
        tk.minv = t.min;
        return;
    }
    var max, min;
    if (this.trunk) {
        // one splinter
        var tmp = this.get_tkyscale(tk);
        max = tmp[0];
        min = tmp[1];
        var _o = this.trunk.findTrack(tk.name);
        if (_o) {
            tmp = this.trunk.get_tkyscale(_o);
            max = Math.max(max, tmp[0]);
            min = Math.min(min, tmp[1]);
        }
        for (var h in this.trunk.splinters) {
            if (h != this.horcrux) {
                var b = this.trunk.splinters[h];
                _o = b.findTrack(tk.name);
                if (_o) {
                    tmp = b.get_tkyscale(_o);
                    max = Math.max(max, tmp[0]);
                    min = Math.min(min, tmp[1]);
                }
            }
        }
    } else {
        // is trunk
        var tmp = this.get_tkyscale(tk);
        max = tmp[0];
        min = tmp[1];
        for (var h in this.splinters) {
            var b = this.splinters[h];
            var _o = b.findTrack(tk.name);
            if (_o) {
                tmp = b.get_tkyscale(_o);
                max = Math.max(max, tmp[0]);
                min = Math.min(min, tmp[1]);
            }
        }
    }
    /*
     if(max>0) {
     if(min>0) {
     } else {
     min=0;
     }
     } else {
     max=0;
     }
     */
    tk.maxv = max;
    tk.minv = min;
};

