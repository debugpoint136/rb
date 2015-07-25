/**
 * @param lst1
 * @param lst2
 * @return true <br><br><br>
 */

function stringLstIsIdentical(lst1, lst2) {
    if (lst1.length != lst2.length)
        return false;
    for (var i = 0; i < lst1.length; i++) {
        if (lst1[i] != lst2[i])
            return false;
    }
    return true;
}