/**
 * Created by dpuru on 2/27/15.
 */


/*** __scaffold__ ***/

Browser.prototype.ajax_scfdruntimesync = function () {
    /* big trap!!
     in case of gsv, border name is itemname, but not chrom name
     so adding new chrom in case of gsv need to preserve old right border!!
     */
    var bbj = this;
    this.ajax('scfdruntimesync=on&dbName=' + this.genome.name + '&session=' + this.sessionId + '&status=' + this.statusId, function (data) {
        bbj.scfdruntimesync(data)
    });
};

