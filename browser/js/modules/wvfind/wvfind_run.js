/**
 * ===BASE===// wvfind // wvfind_run.js
 * @param __Browser.prototype__
 * @param 
 */

Browser.prototype.wvfind_run = function (rlst, wtks, callback) {
    var lst = [], a, b;
    for (var i = 0; i < rlst.length; i++) {
        var e = rlst[i];
        lst.push(e.chr + ',' + e.start + ',' + e.stop + ',' + 1);
        if (i == 0) {
            a = e.start;
        }
        if (i == rlst.length - 1) {
            b = e.stop;
        }
    }
    var param = 'dbName=' + this.genome.name + '&runmode=' + RM_genome + '&regionLst=' + lst.join(',') +
        '&startCoord=' + a + '&stopCoord=' + b;
    var bbj = this;
    this.ajax(param + '&' + trackParam(wtks), function (data) {
        bbj.wvfind_run_cb(data, rlst, wtks, callback);
    });
};

