/**
 * @param thing
 * @param lst
 * @return false <br><br><br>
 */

function thinginlist(thing, lst) {
    for (var i = 0; i < lst.length; i++) {
        if (lst[i] == thing) return true;
    }
    return false;
}