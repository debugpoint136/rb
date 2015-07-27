/**
 * 
 */

function getmdidx_internal() {
    for (var i = 0; i < gflag.mdlst.length; i++) {
        if (gflag.mdlst[i].tag == literal_imd) return i;
    }
    return -1;
}