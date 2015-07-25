/**
 * @param arr
 * @return s <br><br><br>
 */

function arrayMax(arr) {
    if (arr.length == 0) fatalError("arrayMax: zero length array");
    var s = 0;
    for (var i = 0; i < arr.length; i++) {
        if (s < arr[i])
            s = arr[i];
    }
    return s;
}