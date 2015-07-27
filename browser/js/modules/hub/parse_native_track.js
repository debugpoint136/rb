/**
 * @param t
 * */

Genome.prototype.parse_native_track = function (t) {
    if (!t.name) {
        print2console('Native track missing name', 2);
        return null;
    }
    var oo = this.getTkregistryobj(t.name);
    if (!oo) {
        print2console('Unknown native track: ' + t.name, 2);
        return null;
    }
    t.ft = oo.ft;
    t.label = oo.label;
    if (oo.url) {
        t.url = oo.url;
    }
    var tmp = parse_tkmode(t.mode);
    if (tmp[1]) {
        print2console(tmp[1] + ': ' + t.label, 2);
    }
    t.mode = tmp[0];
    switch (t.ft) {
        case FT_bed_n:
            if (t.mode == M_show) t.mode = M_full;
            break;
        case FT_anno_n:
            if (t.mode == M_show) t.mode = M_full;
            break;
    }

    parseHubtrack(t);
    if (t.qtc) {
        // for restoring session
        if (!oo.qtc) {
            oo.qtc = {}
        }
        qtc_paramCopy(t.qtc, oo.qtc);
    }
    if (t.categories) {
        cateInfo_copy(t.categories, oo.cateInfo);
    }
    return t;
};