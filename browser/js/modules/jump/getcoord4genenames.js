/**
 * ===BASE===// jump // getcoord4genenames.js
 * @param __Browser.prototype__
 * @param 
 */

Browser.prototype.getcoord4genenames = function (lst, callback) {
    var bbj = this;
    this.ajax('getcoord4genenames=on&scaffoldruntimenoupdate=on&dbName=' + this.genome.name +
        '&lst=' + lst.join(',') + '&searchgenetknames=' + this.genome.searchgenetknames.join(','),
        function (data) {
            bbj.getcoord4genenames_cb(data, callback);
        });
};

