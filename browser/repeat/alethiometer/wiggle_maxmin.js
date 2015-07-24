/**
 *
 * @param data
 */

function wiggle_maxmin(data) {
    var max=0, min=0;
    for(var i=0; i<data.length; i++) {
        for(var j=0; j<data[i][1].length; j++) {
            var v=data[i][1][j];
            if(max<v) max=v;
            else if(min>v) min=v;
        }
    }
    return [max, min];
}