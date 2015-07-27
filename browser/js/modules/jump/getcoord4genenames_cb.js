/**
 * ===BASE===// jump // getcoord4genenames_cb.js
 * @param __Browser.prototype__
 * @param 
 */

Browser.prototype.getcoord4genenames_cb = function (data, callback) {
    if (!data) {
        print2console('Server crashed', 2);
        callback(null);
        return;
    }
    if (!data.result) {
        print2console('result missing from getcoord4genenames', 2);
    }
    if (data.newscaffold) {
        this.ajax_scfdruntimesync();
    }
    callback(data.result);
};

/*** __jump__ ends ***/