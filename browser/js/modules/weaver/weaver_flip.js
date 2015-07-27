/**
 * ===BASE===// weaver // weaver_flip.js
 * @param 
 */

function weaver_flip() {
    var tk = gflag.menu.tklst[0];
    if (tk.ft != FT_weaver_c) fatalError('but is not weavertk');
    var newtarget = tk.cotton;
    var b = gflag.menu.bbj;
    var oldtarget = b.genome.name;
    menu_hide();
    if (b.weaver.q[newtarget].regionLst.length == 0) {
        print2console('Cannot use ' + newtarget + ' as target: no regions in view range', 2);
        return;
    }
// check this tk
    if (!tk.reciprocal) {
        print2console('missing .reciprocal on calling tk', 2);
        return;
    }
    if (!(b.genome.name in tk.reciprocal)) {
        print2console('missing ' + oldtarget + ' to ' + newtarget + ' genomealign track', 2);
        return;
    }
// check other wtk
    for (var i = 0; i < b.tklst.length; i++) {
        var t2 = b.tklst[i];
        if (t2.ft == FT_weaver_c && t2.name != tk.name) {
            if (!t2.reciprocal) {
                print2console('missing .reciprocal on ' + t2.cotton, 2);
                return;
            }
            if (!(newtarget in t2.reciprocal)) {
                print2console('missing ' + t2.cotton + ' to ' + newtarget + ' genomealign track', 2);
                return;
            }
        }
    }
// swap color
    var a = weavertkcolor_target;
    weavertkcolor_target = tk.qtc.bedcolor;

// assemble hub for flushing
    var hub = [];

// wtk for old target
    var wtk = {
        type: FT2verbal[FT_weaver_c],
        url: tk.reciprocal[oldtarget],
        mode: 'show',
        color: a,
        querygenome: oldtarget,
        reciprocal: {},
        tracks: []
    };
    wtk.reciprocal[newtarget] = tk.url;
// collect url of other weavertk as its reciprocal
    for (var i = 0; i < b.tklst.length; i++) {
        var t2 = b.tklst[i];
        if (t2.ft != FT_weaver_c || t2.name == tk.name) continue;
        wtk.reciprocal[t2.cotton] = t2.url;
    }
    var newtargetnative = [];
    var nativelst = [];
// collect tracks from old target
    for (var i = 0; i < b.tklst.length; i++) {
        var t2 = b.tklst[i];
        if (tkishidden(t2)) continue;
        if (t2.ft != FT_weaver_c && t2.cotton == newtarget) {
            // cottontk, becoming free-standing in new target
            if (isCustom(t2.ft)) {
                hub.push(b.genome.replicatetk(t2));
            } else {
                newtargetnative.push(b.genome.replicatetk(t2));
            }
            continue;
        }
        if (b.targetBypassQuerytk(t2) || t2.ft == FT_weaver_c) continue;
        if (isCustom(t2.ft)) {
            wtk.tracks.push(b.genome.replicatetk(t2));
        } else {
            nativelst.push(b.genome.replicatetk(t2));
        }
    }
    if (nativelst.length > 0) {
        wtk.tracks.push({type: 'native_track', list: nativelst});
    }
    hub.push(wtk);
    if (newtargetnative.length > 0) {
        hub.push({type: 'native_track', list: newtargetnative});
    }

// collect wtk of other genomes
    for (var i = 0; i < b.tklst.length; i++) {
        var t2 = b.tklst[i];
        if (t2.ft != FT_weaver_c || t2.name == tk.name) continue;
        if (!(t2.cotton in tk.reciprocal)) {
            print2console('missing ' + t2.cotton + ' to ' + newtarget + ' genomealign track', 2);
            return;
        }
        var oldurl = t2.url;
        var wtk = {
            type: FT2verbal[FT_weaver_c],
            url: tk.reciprocal[t2.cotton],
            mode: 'show',
            color: t2.qtc.bedcolor,
            querygenome: t2.cotton,
            tracks: []
        };
        wtk.reciprocal = t2.reciprocal;
        var nativelst = [];
        var b2 = b.weaver.q[t2.cotton];
        for (var j = 0; j < b2.tklst.length; j++) {
            var t3 = b2.tklst[j];
            if (isCustom(t3.ft)) {
                wtk.tracks.push(b.genome.replicatetk(t3));
            } else {
                nativelst.push(b.genome.replicatetk(t3));
            }
        }
        if (nativelst.length > 0) {
            wtk.tracks.push({type: 'native_track', list: nativelst});
        }
        hub.push(wtk);
    }

// first clear custtk from other genomes
    for (var i = 0; i < b.tklst.length; i++) {
        var t2 = b.tklst[i];
        if (t2.ft != FT_weaver_c) continue;
        var g = genome[t2.cotton];
        for (var n in g.hmtk) {
            if (isCustom(g.hmtk[n].ft)) {
                delete g.hmtk[n];
            }
        }
    }
    b.cleanuphtmlholder();

    b.init_bbj_param = {
        hubjsoncontent: hub,
    };
// view range
    var b2 = b.weaver.q[newtarget];
    var r = null;
    for (var i = 0; i < b2.regionLst.length; i++) {
        var r2 = b2.regionLst[i];
        var start = r2[3];
        var stop = r2[4];
        if (i == b2.dspBoundary.vstartr) {
            if (r2[8].item.hsp.strand == '+') {
                start = b2.dspBoundary.vstartc;
            } else {
                stop = b2.dspBoundary.vstartc;
            }
        }
        if (i == b2.dspBoundary.vstopr) {
            if (r2[8].item.hsp.strand == '+') {
                stop = b2.dspBoundary.vstopc;
            } else {
                start = b2.dspBoundary.vstopc;
            }
        }
        if (r) {
            if (r[0] != r2[0]) {
                if (stop - start > r[2] - r[1]) {
                    r = [r2[0], start, stop];
                }
            } else {
                r[1] = Math.min(r[1], start);
                r[2] = Math.max(r[2], stop);
            }
        } else {
            r = [r2[0], start, stop];
        }
    }
    b.init_bbj_param.coord_rawstring = r[0] + ':' + r[1] + '-' + r[2];
    b.genome = b2.genome;
    if (showgenomelogo) {
        showgenomelogo(b.genome.name, true);
    }
    /* must reset genome and weaver
     */
    b.weaver.q = {};
    b.regionLst = [];

    b.ajax_loadbbjdata(b.init_bbj_param);
}

