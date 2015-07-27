/**
 * Created by dpuru on 2/27/15.
 */


/*** __qtc__ ***/

function qtc2json(q) {
    var lst = [];
    for (var attr in q) {
        var v = q[attr];
        lst.push(attr + ':' + (typeof(v) == 'string' ? '"' + v + '"' : v));
    }
    return '{' + lst.join(',') + '}';
}


