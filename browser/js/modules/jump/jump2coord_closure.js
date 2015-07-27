/**
 * Created by dpuru on 2/27/15.
 */


/*** __jump__ ***/

function jump2coord_closure(bbj, chr, start, stop) {
    return function () {
        bbj.weavertoggle(stop - start);
        bbj.cgiJump2coord(chr + ' ' + start + ' ' + stop);
    };
}

