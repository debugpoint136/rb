/**
 * @param h
 * @return true <br><br><br>
 */

function hashisempty(h) {
    for (var k in h)
        return false;
    return true;
}