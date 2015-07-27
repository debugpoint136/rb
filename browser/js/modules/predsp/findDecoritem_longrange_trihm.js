/**
 * ===BASE===// predsp // findDecoritem_longrange_trihm.js
 * @param 
 */

function findDecoritem_longrange_trihm(data, angle, mX, mY) {
    /* args:
     data - .data_trihm
     angle - .qtc.angle
     mX/mY - cursor position relative to start of canvas

     ascending lines:
     A : tan
     B : -1
     C : b-a*tan
     C2: b-a*tan-m*tan

     descending lines:
     A : -tan
     B : -1
     C : a*tan+b
     C2: a*tan+b-n*tan

     use formular to calculate point-to-line distance
     */
    var tan = Math.tan(angle);
    var sin = Math.sin(angle);
    for (var i = 0; i < data.length; i++) {
        var item = data[i];
        var a = item[0];
        var b = item[1];
        var m = item[2];
        var n = item[3];
        // distance to first ascending line
        if (Math.abs(tan * mX - mY + b - a * tan) > m * sin * Math.sqrt(tan * tan + 1)) continue;
        // distance to second ascending line
        if (Math.abs(tan * mX - mY + b - a * tan - m * tan) > m * sin * Math.sqrt(tan * tan + 1)) continue;
        // distance to first descending line
        if (Math.abs(-tan * mX - mY + a * tan + b) > n * sin * Math.sqrt(tan * tan + 1)) continue;
        // distance to second descending line
        if (Math.abs(-tan * mX - mY + a * tan + b - n * tan) > n * sin * Math.sqrt(tan * tan + 1)) continue;
        return item;
    }
    return null;
}
