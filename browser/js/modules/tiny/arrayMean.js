/**
 * @param arr
 * @return s <br><br><br>
 */

function arrayMean(arr) {
    if (arr.length == 0) fatalError("arrayMean: zero length array");
    var s = 0;
    for (var i = 0; i < arr.length; i++)
        s += arr[i];
    return s / arr.length;
}