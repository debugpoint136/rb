/**
 * ===BASE===// render // qtrack_getthreshold.js
 * @param 
 */

function qtrack_getthreshold(data, qtconfig, startRidx, stopRidx, startDidx, stopDidx) {
    /* figure out threshold for a quantitative track for plotting
     compute for positive/negative data separately
     if not using threshold, use max value
     args:
     data: nested array
     qtconfig is qtc object of the track
     startRidx/stopRidx: data array index
     startDidx/stopDidx: data[x] array index
     */
    if (qtconfig.thtype == scale_fix) {
        return [qtconfig.thmax, qtconfig.thmin];
    }
    var pth; // positive threshold value
    var nth; // negative
    if (qtconfig.thtype == scale_percentile) {
        /*** fixed percentile ***/
        var plst = [];
        var nlst = [];
        for (var i = startRidx; i <= stopRidx; i++) {
            var start = (i == startRidx) ? startDidx : 0;
            var stop = (i == stopRidx) ? stopDidx : data[i].length;
            for (var j = start; j < stop; j++) {
                var v = data[i][j];
                if (isNaN(v) || v == Infinity || v == -Infinity) {
                } else if (v > 0) {
                    plst.push(v);
                } else if (v < 0) {
                    nlst.push(v);
                }
            }
        }
        if (plst.length > 0) {
            plst.sort(numSort);
            var n = parseInt(plst.length * qtconfig.thpercentile / 100);
            if (n >= plst.length)
                n = plst.length - 1;
            pth = plst[n];
        } else {
            pth = 0;
        }
        if (nlst.length > 0) {
            nlst.sort(numSort);
            var n = parseInt(nlst.length * (100 - qtconfig.thpercentile) / 100);
            if (n < 0) n = 0;
            nth = nlst[n];
        } else {
            nth = 0;
        }
    } else if (qtconfig.thtype == scale_auto) {
        /*** auto scale
         bug fixed 2013/9/18
         originally set nth=0, but all values are >0 so nth never set to true min
         ***/
        pth = null;
        nth = null;
        for (var i = startRidx; i <= stopRidx; i++) {
            //if(!data[i]) fatalError(i);
            var start = (i == startRidx) ? startDidx : 0;
            var stop = (i == stopRidx) ? stopDidx : data[i].length;
            for (var j = start; j < stop; j++) {
                var v = data[i][j];
                if (isNaN(v) || v == Infinity || v == -Infinity) {
                } else {
                    if (pth == null) {
                        pth = v;
                    } else if (v > pth) {
                        pth = v;
                    }
                    if (nth == null) {
                        nth = v;
                    } else if (v < nth) {
                        nth = v;
                    }
                }
            }
            if (qtconfig.min_fixed != undefined) {
                nth = Math.max(qtconfig.min_fixed, nth);
            }
            if (qtconfig.max_fixed != undefined) {
                pth = Math.min(qtconfig.max_fixed, pth);
            }
            if (pth < nth) {
                pth = nth;
            }
        }
    } else {
        fatalError("qtrack_getthreshold: unknown threshold type");
    }
    return [pth, nth];
}

