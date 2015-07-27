/**
 * ===BASE===// baseFunc // smooth_tkdata.js
 * @param 
 */

function smooth_tkdata(obj) {
    if (!obj.data_raw) {
        /* for a smoothed tk, when splintering, splinter tk will lack data_raw
         */
        obj.data_raw = obj.data;
    }
    obj.data = [];
    var smooth = obj.qtc.smooth;
    for (var j = 0; j < obj.data_raw.length; j++) {
        var tmpv = [];
        for (var k = 0; k < obj.data_raw[j].length; k++) {
            var v = obj.data_raw[j][k];
            if (isNaN(v) || v == Infinity || v == -Infinity) {
                tmpv.push(v);
            } else {
                var sum = 0, count = 0;
                for (var m = k - (smooth - 1) / 2; m < k + (smooth - 1) / 2; m++) {
                    var v2 = obj.data_raw[j][m];
                    if (v2 != undefined && !isNaN(v2) && v2 != Infinity && v2 != -Infinity) {
                        sum += v2;
                        count++;
                    }
                }
                if (count == 0) {
                    tmpv.push(NaN);
                } else {
                    tmpv.push(sum / count);
                }
            }
        }
        obj.data.push(tmpv);
    }
}

/*** __base__ ends ***/

