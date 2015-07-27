/**
 * ===BASE===// track // jsonAddtracks.js
 * @param __Browser.prototype__
 * @param 
 */

Browser.prototype.jsonAddtracks = function (data) {
    /* first, need to register those that are new customs */
    if (data.brokenbeads) {
        print2console('Failed to load following tracks:', 0);
        var lst = data.brokenbeads;
        for (var i = 0; i < lst.length; i++) {
            var w = '<span style="background-color:red;color:white;">&nbsp;' + FT2verbal[lst[i].ft] + '&nbsp;</span> ' +
                (isCustom(lst[i].ft) ? lst[i].url : '');
            print2console(w, 2);
            var d = document.createElement('div');
            this.refreshcache_maketkhandle(d, lst[i]);
            alertbox_addmsg({text: w, refreshcachehandle: d});
        }
    }
    var lst = data.tkdatalst;
    /* pre-process json data
     */
    for (var i = 0; i < lst.length; i++) {
        if (!lst[i].data) {
            // no data, wrong track
            print2console('Error adding ' + FT2verbal[lst[i].ft] + ' track "' + lst[i].label + '"', 3);
            continue;
        }
        if (!isCustom(lst[i].ft)) continue;
        if (lst[i].name in this.genome.hmtk) continue;
        /* unregistered custtk, register it here
         what's the possibilities??
         */
        this.genome.registerCustomtrack(lst[i]);
    }
    /* now all tracks should be registered, add them */
    var tknamelst = this.jsonTrackdata(data);
    for (var i = 0; i < tknamelst.length; i++) {
        if (!tknamelst[i][1]) continue;
        // newly added tk
        var t = this.findTrack(tknamelst[i][0]);
        /*
         if(this.weaver && this.weaver.iscotton) {
         // cottonbbj adding a new track, must put to target
         this.weaver.target.tklst.push(t);
         }
         */
        if (t.mastertk && t.mastertk.ft == FT_matplot) {
            // new tk belongs to matplot, assemble matplot
            var nlst = [];
            for (var j = 0; j < t.mastertk.tracks.length; j++) {
                var o = t.mastertk.tracks[j];
                if (typeof(o) == 'string') {
                    nlst.push(this.findTrack(o));
                } else {
                    nlst.push(o);
                }
            }
            t.mastertk.tracks = nlst;
        }
    }

    if (!this.init_bbj_param) {
        var someingroup = false;
        for (var i = 0; i < tknamelst.length; i++) {
            if (this.findTrack(tknamelst[i][0]).group != undefined) {
                someingroup = true;
                break;
            }
        }
        if (someingroup) {
            this.drawTrack_browser_all();
        } else {
            // nobody in group, only draw involved ones
            for (var i = 0; i < tknamelst.length; i++) {
                var o = this.findTrack(tknamelst[i][0]);
                if (!o) continue;
                if (o.mastertk) {
                    this.drawTrack_browser(o.mastertk);
                } else {
                    this.stack_track(o, 0);
                    this.drawTrack_browser(o);
                }
            }
        }

        if (!this.weaver || !this.weaver.iscotton) {
            this.prepareMcm();
            this.drawMcm();
            this.trackHeightChanged();
        }

        var newlst = []; // names of newly added tracks
        for (var i = 0; i < tknamelst.length; i++) {
            if (tknamelst[i][1]) {
                newlst.push(tknamelst[i][0]);
            }
        }
        this.aftertkaddremove(newlst);
        if (this.trunk) {
            /* !!! this is a splinter, sync track style and order, no facet
             */
            var nk = this.trunk;
            for (var i = 0; i < this.tklst.length; i++) {
                var t0 = this.tklst[i];
                if (tkishidden(t0)) continue;
                var t = nk.findTrack(t0.name);
                if (!t) {
                    // might not be error because when deleting track from trunk
                    print2console('track missing from trunk ' + t0.label, 2);
                    continue;
                }
                qtc_paramCopy(t.qtc, t0.qtc);
            }
            var newlst = [];
            for (var i = 0; i < nk.tklst.length; i++) {
                var t = nk.tklst[i];
                if (tkishidden(t)) continue;
                for (var j = 0; j < this.tklst.length; j++) {
                    var t2 = this.tklst[j];
                    if (t2.name == t.name) {
                        t2.where = t.where;
                        newlst.push(t2);
                        this.tklst.splice(j, 1);
                        break;
                    }
                }
            }
            this.tklst = newlst.concat(this.tklst);
            this.trackdom2holder();
        }
    }

// add new cottontk to target, do this after tracks are rendered
    if (this.weaver && this.weaver.iscotton) {
        var target = this.weaver.target;
        for (var i = 0; i < tknamelst.length; i++) {
            if (!tknamelst[i][1]) continue;
            var t = this.findTrack(tknamelst[i][0]);
            target.tklst.push(t);
        }
        target.trackdom2holder();
        target.prepareMcm();
        target.drawMcm();
    }

    if (this.splinterTag) return;

    var hassp = false;
    for (var a in this.splinters) {
        hassp = true;
        break;
    }
    if (!hassp) return;
// this is a trunk with splinters
    var singtk = [], // singular tk
        cmtk = [];
    for (var i = 0; i < tknamelst.length; i++) {
        var t = this.findTrack(tknamelst[i][0]);
        if (t.ft == FT_cm_c) {
            for (var a in t.cm.set) {
                singtk.push(t.cm.set[a]);
            }
            cmtk.push(t);
        } else {
            singtk.push(t);
        }
    }
// by adding cmtk for trunk, cmtk won't show up in tknamelst, but in .init_bbj_param
    if (this.init_bbj_param && this.init_bbj_param.cmtk) {
        for (var i = 0; i < this.init_bbj_param.cmtk.length; i++) {
            cmtk.push(this.init_bbj_param.cmtk[i]);
        }
    }
    for (var k in this.splinters) {
        var b = this.splinters[k];
        if (cmtk.length > 0) {
            if (!b.init_bbj_param) b.init_bbj_param = {};
            if (!b.init_bbj_param.cmtk) b.init_bbj_param.cmtk = [];
            for (var i = 0; i < cmtk.length; i++) {
                b.init_bbj_param.cmtk.push(cmtk[i]);
            }
        }
        b.ajax_addtracks(singtk);
    }
};


