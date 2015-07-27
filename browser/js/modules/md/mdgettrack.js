/**
 * search for any tracks annotated by an attribute, store in hash, key is track name
 * __Browser.prototype__
 * @param  term - term name
 * @param mdidx - genome.mdlst array index, to find the voc
 * @param {object} tkset
 */

Browser.prototype.mdgettrack = function (term, mdidx, tkset) {

    var voc = gflag.mdlst[mdidx];
    if (term in voc.p2c) {
        // not leaf
        for (var cterm in voc.p2c[term]) {
            this.mdgettrack(cterm, mdidx, tkset);
        }
    } else {
        // is leaf
        /*        for (var n in this.genome.hmtk) {
         var tk = this.genome.hmtk[n];
         if (!tk.md) continue;
         if (tk.md[mdidx] == undefined) continue;
         if (term in tk.md[mdidx]) {
         tkset[n] = 1;
         }
         }*/
        //Re-implement the above logic by inverting the loop call

        /*var hmtkCache = this.genome.hmtk,
         tkCache = {},
         tkmdCache = {};
         for( var n in hmtkCache ){
         tkCache = hmtkCache[n];
         tkmdCache = tkCache.md;
         if(!tkmdCache) continue;
         if( tkmdCache[mdidx] == undefined ) continue;
         if ( term in tkmdCache[mdidx] ) tkset[n] = 1;
         }*/
        var termFetch = this.flatHmtk[term];
        if ( termFetch ) {
            for( var n in termFetch[mdidx] ) {
                var foundArr = termFetch[mdidx];
                for ( var i = 0; i < foundArr.length ; i++){
                    tkset[foundArr[i]] = 1;
                }
            }
        }
    }
};