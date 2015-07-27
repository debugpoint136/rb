/**
 * ===BASE===// facet // flattenhmtk.js
 * @param __Browser.prototype__
 * @param 
 */

Browser.prototype.flattenhmtk = function(){
    /* # Before you call this - lets flatten genome.hmtk
     # create a global object that has key as cterm
     # and array, where index is md #
     # value is an array of track num
     */

    var globalHMhash = {};
    for ( var track in this.genome.hmtk){
        var tkNum = this.genome.hmtk[track];
        var arrLen = tkNum.md.length;
        for (var m = 1; m < arrLen; m++ ) {
            for (var n in tkNum.md[m]){
                var arr = [];
                var trackArr = [];
                trackArr.push(track);
                arr[m] = trackArr;
                if ( globalHMhash[n] ) {
                    var curArr = globalHMhash[n];
                    if ( curArr[m] ){
                        curArr[m].push(track);
                    }
                } else {
                    globalHMhash[n] = arr;
                }
            }
        }
    }
    return globalHMhash;
};

Browser.prototype.flatHmtk = {};

