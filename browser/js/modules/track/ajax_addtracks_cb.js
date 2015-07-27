/**
 * ===BASE===// track // ajax_addtracks_cb.js
 * @param __Browser.prototype__
 * @param 
 */

Browser.prototype.ajax_addtracks_cb = function (data) {
    if (!data) {
        print2console('server crashed, please refresh and start over', 2);
        return;
    }
    var count = this.tklst.length;
    this.jsonAddtracks(data);
    if (count < this.tklst.length) {
        print2console('Tracks added', 1);
    }
    this.unveil();
    this.shieldOff();
    this.ajax_loadbbjdata(this.init_bbj_param);
};

