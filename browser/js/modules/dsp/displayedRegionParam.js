/**
 * Created by dpuru on 2/27/15.
 */

/*** __dsp__ ***/

Browser.prototype.displayedRegionParam = function () {
    /* only viewbox region
     optional arg: start coord of first region, stop coord of last region to cope with zoom in
     */
    var t = this.getDspStat();
    var jt = this.juxtaposition.type;
    var param = '&runmode=' + jt;
    if (this.is_gsv()) {
        // TODO remove itemlist parameter
        param += '&itemlist=on&startChr=' + t[0] + '&stopChr=' + t[2];
    } else {
        param += '&juxtaposeTk=' + this.juxtaposition.what + '&startChr=' + t[0] + '&stopChr=' + t[2];
    }
    if (arguments[0] != undefined && arguments[1] != undefined) {
        return param + "&startCoord=" + arguments[0] + "&stopCoord=" + arguments[1];
    } else {
        return param + "&startCoord=" + t[1] + "&stopCoord=" + t[3];
    }
};

