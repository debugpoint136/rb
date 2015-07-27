/**
 * ===BASE===// scaffold // scfdruntimesync.js
 * @param __Browser.prototype__
 * @param 
 */

Browser.prototype.scfdruntimesync = function (data) {
    if (!data || data.error) {
        print2console('scfdruntimesync failed!', 2);
        return;
    }
    var right = [];
    if (this.is_gsv()) {
        right[0] = this.border.rname;
        right[1] = this.border.rpos;
    }
    for (var i = 0; i < data.lst.length; i++) {
        if (!thinginlist(data.lst[i], this.genome.scaffold.current)) {
            this.genome.addnewscaffold([data.lst[i]]);
        }
    }
    if (this.is_gsv()) {
        // flip it back...
        this.border.rname = right[0];
        this.border.rpos = right[1];
    }
};

