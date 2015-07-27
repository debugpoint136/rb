/**
 * ===BASE===// misc // app_get_sequence.js
 * @param 
 */

function app_get_sequence(event) {
    var bbj = gflag.menu.bbj;
    var lst = menu.apppanel.getseq.input.value.split('\n');
    if (lst.length == 0) {
        print2console('No coordinates given', 2);
        return;
    }
    var gc = [],
        lc = []; // for looking
    for (var i = 0; i < lst.length; i++) {
        var c = bbj.genome.parseCoordinate(lst[i], 2);
        if (c && c[0] == c[2]) {
            if (c[3] - c[1] > 5000) {
                print2console('Sequence was trimmed to 5kb', 2);
                c[3] = c[1] + 5000;
            }
            gc.push(c[0] + ',' + c[1] + ',' + c[3]);
            lc.push(c[0] + ':' + c[1] + '-' + c[3]);
        }
    }
    if (gc.length == 0) {
        print2console('No acceptable coordinates, please check your input', 2);
        return;
    }
    event.target.disabled = true;
    bbj.ajax("getChromseq=on&regionlst=" + gc.join(',') + '&dbName=' + bbj.genome.name, function (data) {
        app_showseq(data, lc);
    });
}
