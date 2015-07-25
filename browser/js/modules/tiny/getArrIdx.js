/**
 * return -1 if thing is not found
 * @param thing
 * @param lst
 * @return -1 <br><br><br>
 */

function getArrIdx(thing, lst) {
    // return -1 if thing is not found
    if (lst.length == 0) return -1;
    for (var i = 0; i < lst.length; i++) {
        if (lst[i] == thing) return i;
    }
    return -1;
}