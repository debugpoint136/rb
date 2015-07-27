/**
 * ===BASE===// custtk // registerCustomtrack.js
 * @param __Genome.prototype__
 * @param 
 */

Genome.prototype.registerCustomtrack = function (hash) {
    /* register one custom track, has nothing to do with bbj
     hash/oo: raw materials for making registry object
     */
    if (!isCustom(hash.ft)) fatalError("registerCustomtrack: not custom track filetype");
    if (!hash.name) fatalError('cannot registery nameless custom track');
    //dpuru - commenting this for performance testing
   /* if (hash.url) {
        // XXXb
        if (this.tkurlInUse(hash.url)) return;
    }*/

    var oo = this.pending_custtkhash[hash.name];
    delete this.pending_custtkhash[hash.name];
    if (!oo) {
        oo = {};
    }
    if (hash.name in this.hmtk) {
        /* is the case of adding back a hidden track
         in golden, the track style might have changed
         must update .qtc in registry obj
         */
        var _o = this.hmtk[hash.name];
        if (oo.qtc) {
            if (!_o.qtc) {
                _o.qtc = {};
            }
            qtc_paramCopy(oo.qtc, _o.qtc);
        }
        return;
    }

    /* the registry object */
    var o = {
        name: hash.name,
        label: hash.label,
        url: hash.url,
        ft: hash.ft,
        mode: hash.mode,
        md: [],
        qtc: {},
    };
    if (o.ft == FT_cm_c || o.ft == FT_matplot) {
        delete o.url;
    }

// parse and append attributes
    var x = hash.public ? true : (oo.public ? true : false);
    if (x) {
        o.public = true;
    }

    x = hash.horizontallines ? hash.horizontallines : (oo.horizontallines ? oo.horizontallines : null);
    if (x) {
        o.horizontallines = x;
    }

    x = hash.cotton ? hash.cotton : (oo.cotton ? oo.cotton : null);
    if (x) {
        o.cotton = x;
    }

    if (o.ft == FT_catmat) {
        o.rowcount = hash.rowcount ? hash.rowcount : oo.rowcount;
        if (!o.rowcount) {
            print2console('rowcount missing in registering catmat', 2);
        }
        o.rowheight = hash.rowheight ? hash.rowheight : oo.rowheight;
        if (!o.rowheight) {
            print2console('rowheight missing in registering catmat', 2);
        }
    }

    if (o.ft == FT_weaver_c) {
        x = hash.reciprocal ? hash.reciprocal : (oo.reciprocal ? oo.reciprocal : null);
        if (x) {
            o.reciprocal = x;
        }
    }

    x = hash.weaver ? hash.weaver : (oo.weaver ? oo.weaver : null);
    if (x) {
        o.weaver = {};
        for (var n in x) {
            o.weaver[n] = x[n];
        }
    }

    x = hash.defaultmode != undefined ? hash.defaultmode : ((oo.defaultmode != undefined) ? oo.defaultmode : null);
    if (x != null) {
        o.defaultmode = x;
    }

    x = hash.showscoreidx != undefined ? hash.showscoreidx : ((oo.showscoreidx != undefined) ? oo.showscoreidx : null);
    if (x != null) {
        o.showscoreidx = x;
    }

    x = hash.scorenamelst ? hash.scorenamelst : (oo.scorenamelst ? oo.scorenamelst : null);
    if (x) {
        o.scorenamelst = x;
    }

    x = hash.scorescalelst ? hash.scorescalelst : (oo.scorescalelst ? oo.scorescalelst : null);
    if (x) {
        o.scorescalelst = x;
    }

    x = hash.details ? hash.details : (oo.details ? oo.details : null);
    if (x) {
        o.details = x;
    }

    x = hash.detail_url ? hash.detail_url : (oo.detail_url ? oo.detail_url : null);
    if (x) {
        o.detail_url = x;
    }

// track name
    x = hash.mastertk ? hash.mastertk : (oo.mastertk ? oo.mastertk : null);
    if (x) {
        o.mastertk = x;
    }

    var cm = hash.cm ? hash.cm : (oo.cm ? oo.cm : null);
    if (cm) {
        o.cm = cm;
    }
    if (o.ft == FT_matplot) {
        o.tracks = [];
        x = hash.tracks ? hash.tracks : (oo.tracks ? oo.tracks : null);
        if (x) {
            o.tracks = x;
        }
    }
    var md = hash.md ? hash.md : (oo.md ? oo.md : null);
    if (md) {
        for (var i = 0; i < md.length; i++) {
            if (!md[i]) continue;
            var s = {};
            for (var x in md[i]) {
                s[x] = 1;
            }
            o.md[i] = s;
        }
    }

    // dpuru : ternary operator : if hash.geo exists then return hash.geo else if oo.geo exists then return oo.geo else null
    var geo = hash.geo ? hash.geo : (oo.geo ? oo.geo : null);
    if (geo) {
        o.geolst = geo.split(',');
    }
    var x = hash.geolst ? hash.geolst : (oo.geolst ? oo.geolst : null);
    if (x) {
        o.geolst = [];
        for (var i = 0; i < x.length; i++) {
            o.geolst.push(x[i]);
        }
    }
    var normalize = hash.normalize ? hash.normalize : (oo.normalize ? oo.normalize : null);
    if (normalize) {
        o.normalize = {method: normalize};
        var rn = hash.total_mapped_reads ? hash.total_mapped_reads : (oo.total_mapped_reads ? oo.total_mapped_reads : null);
        o.normalize.total_mapped_reads = rn;
    }
    var group = hash.group != undefined ? hash.group : (oo.group != undefined ? oo.group : null);
    if (group) {
        o.group = group;
    }
    var ci = hash.cateInfo ? hash.cateInfo : (oo.cateInfo ? oo.cateInfo : null);
    if (ci) {
        o.cateInfo = {};
        cateInfo_copy(ci, o.cateInfo);
    }

    /* qtc */
    var tq = hash.qtc ? hash.qtc : oo.qtc;
    if (tq) {
        if (!o.qtc) {
            o.qtc = {};
        }
        qtc_paramCopy(tq, o.qtc);
    }
    this.custtk.names.push(o.name);
    this.hmtk[o.name] = o;
};


