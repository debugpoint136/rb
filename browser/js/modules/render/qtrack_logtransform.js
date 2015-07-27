/**
 * ===BASE===// render // qtrack_logtransform.js
 * @param 
 */

function qtrack_logtransform(data, _qtc) {
    /* data is nested array
     returns new vector same as data
     */
    if (_qtc.logtype == undefined || _qtc.logtype == log_no) return data;
    var nd = [];
    for (var i = 0; i < data.length; i++) {
        nd.push([]);
    }
    for (i = 0; i < data.length; i++) {
        for (var j = 0; j < data[i].length; j++) {
            switch (_qtc.logtype) {
                case log_2:
                    nd[i][j] = Math.log(data[i][j]) * Math.LOG2E;
                    break;
                case log_e:
                    nd[i][j] = Math.log(data[i][j]);
                    break;
                case log_10:
                    nd[i][j] = Math.log(data[i][j]) * Math.LOG10E;
                    break;
                default:
                    fatalError('unknown log type');
            }
        }
    }
    return nd;
}

