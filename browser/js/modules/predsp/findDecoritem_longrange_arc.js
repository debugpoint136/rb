/**
 * ===BASE===// predsp // findDecoritem_longrange_arc.js
 * @param 
 */

function findDecoritem_longrange_arc(data, x, y) {
    /* data: .data_arc
     x/y: absolute postion on tk canvas
     */
    for (var i = 0; i < data.length; i++) {
        var t = data[i];
        if (Math.abs(Math.sqrt(Math.pow(x - t[0], 2) + Math.pow(y - t[1], 2)) - t[2]) <= 2) {
            return t;
        }
    }
    return null;
}