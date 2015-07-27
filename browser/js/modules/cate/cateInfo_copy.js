/**
 * Created by dpuru on 2/27/15.
 */
/* __cate__ categorical track */

function cateInfo_copy(fromobj, toobj) {
    /* args are cateInfo hash */
    for (var k in fromobj) {
        toobj[k] = [fromobj[k][0], fromobj[k][1]];
    }
    toobj[-1] = ['no information', 'transparent'];
}
