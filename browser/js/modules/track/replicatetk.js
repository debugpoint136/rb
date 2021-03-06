/**
 * ===BASE===// track // replicatetk.js
 * @param __Genome.prototype__
 * @param 
 */

Genome.prototype.replicatetk = function (t) {
// make tkobj to go into datahub
    var _o = {}; // temp obj for stringify
    if (t.ft == FT_cm_c) {
        if (t.cm.combine) {
            _o.combinestrands = true;
        }
        if (t.cm.combine_chg) {
            _o.combinestrands_chg = true;
        }
        if (t.cm.scale) {
            _o.scalebarheight = true;
        }
        if (t.cm.filter) {
            _o.filterreaddepth = t.cm.filter;
        }
        // smooth?
        var trd = t.cm.set.rd_f;
        if (trd && trd.qtc && trd.qtc.smooth) {
            _o.smoothwindow = trd.qtc.smooth;
        }
        _o.tracks = {forward: {}, reverse: {}};
        var no_r = true;
        // if t is registry object, the member tracks are just names
        if (t.cm.set.cg_f) {
            if (typeof(t.cm.set.cg_f) == 'string') {
                var o3 = this.hmtk[t.cm.set.cg_f];
                if (o3) {
                    _o.tracks.forward.CG = {color: t.cm.color.cg_f, bg: t.cm.bg.cg_f, url: o3.url};
                }
            } else {
                _o.tracks.forward.CG = {color: t.cm.color.cg_f, bg: t.cm.bg.cg_f, url: t.cm.set.cg_f.url};
            }
        }
        if (t.cm.set.cg_r) {
            if (typeof(t.cm.set.cg_r) == 'string') {
                var o3 = this.hmtk[t.cm.set.cg_r];
                if (o3) {
                    _o.tracks.reverse.CG = {color: t.cm.color.cg_r, bg: t.cm.bg.cg_r, url: o3.url};
                    no_r = false;
                }
            } else {
                _o.tracks.reverse.CG = {color: t.cm.color.cg_r, bg: t.cm.bg.cg_r, url: t.cm.set.cg_r.url};
                no_r = false;
            }
        }
        if (t.cm.set.chg_f) {
            if (typeof(t.cm.set.chg_f) == 'string') {
                var o3 = this.hmtk[t.cm.set.chg_f];
                if (o3) {
                    _o.tracks.forward.CHG = {color: t.cm.color.chg_f, bg: t.cm.bg.chg_f, url: o3.url};
                }
            } else {
                _o.tracks.forward.CHG = {color: t.cm.color.chg_f, bg: t.cm.bg.chg_f, url: t.cm.set.chg_f.url};
            }
        }
        if (t.cm.set.chg_r) {
            if (typeof(t.cm.set.chg_r) == 'string') {
                var o3 = this.hmtk[t.cm.set.chg_r];
                if (o3) {
                    _o.tracks.reverse.CHG = {color: t.cm.color.chg_r, bg: t.cm.bg.chg_r, url: o3.url};
                    no_r = false;
                }
            } else {
                _o.tracks.reverse.CHG = {color: t.cm.color.chg_r, bg: t.cm.bg.chg_r, url: t.cm.set.chg_r.url};
                no_r = false;
            }
        }
        if (t.cm.set.chh_f) {
            if (typeof(t.cm.set.chh_f) == 'string') {
                var o3 = this.hmtk[t.cm.set.chh_f];
                if (o3) {
                    _o.tracks.forward.CHH = {color: t.cm.color.chh_f, bg: t.cm.bg.chh_f, url: o3.url};
                }
            } else {
                _o.tracks.forward.CHH = {color: t.cm.color.chh_f, bg: t.cm.bg.chh_f, url: t.cm.set.chh_f.url};
            }
        }
        if (t.cm.set.chh_r) {
            if (typeof(t.cm.set.chh_r) == 'string') {
                var o3 = this.hmtk[t.cm.set.chh_r];
                if (o3) {
                    _o.tracks.reverse.CHH = {color: t.cm.color.chh_r, bg: t.cm.bg.chh_r, url: o3.url};
                    no_r = false;
                }
            } else {
                _o.tracks.reverse.CHH = {color: t.cm.color.chh_r, bg: t.cm.bg.chh_r, url: t.cm.set.chh_r.url};
                no_r = false;
            }
        }
        if (t.cm.set.rd_f) {
            if (typeof(t.cm.set.rd_f) == 'string') {
                var o3 = this.hmtk[t.cm.set.rd_f];
                if (o3) {
                    _o.tracks.forward.ReadDepth = {color: t.cm.color.rd_f, bg: t.cm.bg.rd_f, url: o3.url};
                }
            } else {
                _o.tracks.forward.ReadDepth = {color: t.cm.color.rd_f, bg: t.cm.bg.rd_f, url: t.cm.set.rd_f.url};
            }
        }
        if (t.cm.set.rd_r) {
            if (typeof(t.cm.set.rd_r) == 'string') {
                var o3 = this.hmtk[t.cm.set.rd_r];
                if (o3) {
                    _o.tracks.reverse.ReadDepth = {color: t.cm.color.rd_r, bg: t.cm.bg.rd_r, url: o3.url};
                    no_r = false;
                }
            } else {
                _o.tracks.reverse.ReadDepth = {color: t.cm.color.rd_r, bg: t.cm.bg.rd_r, url: t.cm.set.rd_r.url};
                no_r = false;
            }
        }
        if (no_r) {
            delete _o.tracks.reverse;
        }
    } else if (t.ft == FT_matplot) {
        var lst = [];
        for (var i = 0; i < t.tracks.length; i++) {
            var t2 = t.tracks[i];
            // t2 will be tkname if t is registry obj
            if (typeof(t2) == 'string') {
                var t3 = this.getTkregistryobj(t2);
                if (t3) {
                    lst.push({
                        type: FT2verbal[t3.ft],
                        url: t3.url,
                        name: t3.label,
                        colorpositive: 'rgb(' + t3.qtc.pr + ',' + t3.qtc.pg + ',' + t3.qtc.pb + ')',
                    });
                }
            } else {
                lst.push({
                    type: FT2verbal[t2.ft],
                    url: t2.url,
                    name: t2.label,
                    colorpositive: 'rgb(' + t2.qtc.pr + ',' + t2.qtc.pg + ',' + t2.qtc.pb + ')',
                });
            }
        }
        _o.tracks = lst;
    } else if (t.ft == FT_catmat) {
        _o.rowcount = t.rowcount;
        _o.rowheight = t.rowheight;
    } else if (t.ft == FT_weaver_c) {
        _o.querygenome = t.cotton;
        _o.color = t.qtc.bedcolor;
        _o.weaver = {};
    }

    if (isCustom(t.ft)) {
        _o.type = FT2verbal[t.ft];
        _o.name = t.label;
        _o.url = t.url;
        //if(t.public) { _o.public=true; }
    } else {
        _o.name = t.name;
    }
    _o.mode = t.mode;
    if (t.defaultmode != undefined) {
        _o.defaultmode = t.defaultmode;
    }
    if (t.qtc) {
        _o.qtc = t.qtc;
    }
    if (t.showscoreidx != undefined) {
        _o.showscoreidx = t.showscoreidx;
        _o.scorenamelst = t.scorenamelst;
        _o.scorescalelst = t.scorescalelst;
    }
    if (t.md) {
        _o.metadata = {};
        for (var i = 0; i < t.md.length; i++) {
            if (t.md[i]) {
                if (gflag.mdlst[i].tag == literal_imd) {
                    // skip internal md
                    continue;
                }
                var a = [];
                for (var n in t.md[i]) {
                    a.push(n);
                }
                _o.metadata['md' + i] = a;
            }
        }
    }
    if (t.cateInfo) {
        _o.categories = t.cateInfo;
    }
    if (t.details) {
        _o.details = t.details;
    }
    if (t.geolst) {
        _o.geolst = t.geolst;
    }
    if (t.group != undefined) {
        _o.group = t.group;
    }
    if (t.horizontallines) {
        _o.horizontallines = t.horizontallines;
    }
    return _o;
};


