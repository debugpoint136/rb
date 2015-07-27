/**
 * ===BASE===// track // mergeStackdecor.js
 * @param 
 */

function mergeStackdecor(sink, source, ft, direction, offsetShift) {
    /* if is sam file:
     merge sink/source reads that have same id (make them a paired end)
     else, if source item also exists in sink (tell by item id), skip
     else, push it into sink

     args:
     - sink: array of bed items of "sink" region
     - source: array of bed items of "source" region
     - direction, offsetShift: from Browser.move

     ** beware **
     if move left, need to shift sink box start using move.offsetShift
     if move right, need to shift source box start using sink region length
     */
    if (direction != 'l' && direction != 'r') fatalError("mergeStackdecor: move direction error");
    if (direction == 'l') {
        // shift sink
        for (var i = 0; i < sink.length; i++) {
            sink[i].boxstart += offsetShift;
        }
    } else {
        // shift source
        for (var i = 0; i < source.length; i++) {
            var t = source[i];
            if (!t.boxstart) {
                t.boxstart = offsetShift;
            } else {
                t.boxstart += offsetShift;
            }
        }
    }
    var isSam = ft == FT_bam_n || ft == FT_bam_c;
// make lookup table for items in sink
    var lookup = {}; // key: item id, val: item array
    for (var i = 0; i < sink.length; i++) {
        lookup[sink[i].id] = sink[i];
    }
    for (var i = 0; i < source.length; i++) {
        var _item = lookup[source[i].id];
        if (_item) {
            if (isSam) {
                if (!_item.hasmate) {
                    // the sink read is not paired yet
                    sink.push(source[i]);
                }
            } else if (ft == FT_weaver_c) {
                delete _item.hsp;
                _item.genomealign = source[i].genomealign;
            }
        } else {
            sink.push(source[i]);
        }
    }
}


