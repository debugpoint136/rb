/**
 * ===BASE===// track // ajax_addtracks.js
 * @param __Browser.prototype__
 * @param 
 */

Browser.prototype.ajax_addtracks = function (lst) {
    /* must provide tkobj, works for mixture of native/custom tracks
     custom track might be un-registered
     but if adding compound tracks, member tracks must be registered!
     */
    if (lst.length == 0) {
        return;
    }
    var olst = [];
    for (var i = 0; i < lst.length; i++) {
        var o = lst[i];
        if (o.ft == undefined || !FT2verbal[o.ft]) {
            print2console('missing or wrong ft', 2);
            continue;
        }
        if (o.ft == FT_cm_c) {
            if (!o.cm || !o.cm.set) {
                o = this.genome.hmtk[o.name];
                if (!o) {
                    print2console('registry object missing for a cmtk', 2);
                    continue;
                }
            }
            for (var k in o.cm.set) {
                var n = o.cm.set[k];
                var t = this.genome.hmtk[n];
                if (!t) {
                    print2console('registry object missing for cmtk member: ' + k, 2);
                } else {
                    olst.push({name: n, url: t.url, ft: t.ft, label: t.label, mode: M_show, qtc: {}});
                }
            }
            /* this cmtk won't go into olst
             but upon ajax return it should be rebuilt
             push it to init param
             TODO should be like matplot
             */
            if (!this.init_bbj_param) {
                this.init_bbj_param = {cmtk: []};
            }
            if (!this.init_bbj_param.cmtk) {
                this.init_bbj_param.cmtk = [];
            }
            this.init_bbj_param.cmtk.push(o);
            continue;
        } else if (o.ft == FT_matplot) {
            if (!o.tracks) {
                o = this.genome.hmtk[o.name];
                if (!o) {
                    print2console('registry obj missing for matplot', 2);
                    continue;
                }
            }
            for (var j = 0; j < o.tracks.length; j++) {
                var n = o.tracks[j];
                var t = this.genome.getTkregistryobj(n);
                if (!t) {
                    print2console('matplot member missing: ' + n, 2);
                } else {
                    var m = tkdefaultMode(t);
                    if (m != M_show) {
                        m = M_den;
                    }
                    olst.push({name: n, url: t.url, ft: t.ft, label: t.label, mode: m, qtc: {}});
                }
            }
            this.tklst.push(this.makeTrackDisplayobj(o.name, o.ft));
            continue;
        }
        if (!o.mode) {
            o.mode = tkdefaultMode(o);
        }
        olst.push(o);
    }
    this.cloak();
    this.shieldOn();
    var bbj = this;
// allow custom genome
    this.ajax(this.displayedRegionParamPrecise() + '&addtracks=on&' +
    'dbName=' + this.genome.name +
    this.genome.customgenomeparam() +
    trackParam(olst), function (data) {
        bbj.ajax_addtracks_cb(data);
    });
};

