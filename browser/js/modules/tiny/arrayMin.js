/**
 * @param arr
 * @return s <br><br><br>
 */

function arrayMin(arr) {
    if (arr.length == 0) fatalError('arrayMin: zero length array');
    var s = arr[0];
    for (var i = 1; i < arr.length; i++) {
        if (s > arr[i]) s = arr[i];
    }
    return s;
}