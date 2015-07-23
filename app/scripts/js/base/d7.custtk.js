/**
 * Created by dpuru on 2/27/15.
 */
/*** __custtk__ custom track submission and management ***/
function custtk_shortcut(ft) {
    menu_hide();
    toggle7_1();
    custtkpanel_show(ft);
}
function facet2custtklst(event) {
    gflag.menu.bbj = apps.hmtk.bbj;
    menu_shutup();
    menu_show_beneathdom(0, event.target);
    menu_custtk_showall();
}
function menu_custtk_showall() {
// called by "List of all" option in custtk menu
    var bbj = gflag.menu.bbj;
    if (bbj.genome.custtk.names.length == 0) {
        menu_hide();
        return;
    }
    var lst = [];
    for (var i = 0; i < bbj.genome.custtk.names.length; i++) {
        var n = bbj.genome.custtk.names[i];
        var tk = bbj.genome.hmtk[n];
        if (!tk) {
            print2console('this guy has gone missing!? ' + n, 2);
            continue;
        }
        if (tk.mastertk) {
            // this is a member tk
            continue;
        }
        if (tk.public) {
            // from public hub
            continue;
        }
        lst.push(n);
    }
    bbj.showhmtkchoice({lst: lst, delete: true, context: 22});
}

function custtk_useexample(ft) {
    var info = apps.custtk.bbj.genome.defaultStuff.custtk;
    if (!(ft in info)) {
        print2console('Not available for this track type.', 2);
        return;
    }
    var c = apps.custtk.bbj.genome.custtk;
    switch (ft) {
        case FT_bed_c:
            c.ui_bed.input_url.value = info[ft].url;
            c.ui_bed.input_name.value = info[ft].name;
            return;
        case FT_bedgraph_c:
            c.ui_bedgraph.input_url.value = info[ft].url;
            c.ui_bedgraph.input_name.value = info[ft].name;
            return;
        case FT_bam_c:
            c.ui_bam.input_url.value = info[ft].url;
            c.ui_bam.input_name.value = info[ft].name;
            return;
        case FT_lr_c:
            c.ui_lr.input_url.value = info[ft].url;
            c.ui_lr.input_name.value = info[ft].name;
            return;
        case FT_bigwighmtk_c:
            c.ui_bigwig.input_url.value = info[ft].url;
            c.ui_bigwig.input_name.value = info[ft].name;
            return;
        case FT_cat_c:
            c.ui_cat.input_url.value = info[ft].url;
            c.ui_cat.input_name.value = info[ft].name;
            return;
        case FT_huburl:
            c.ui_hub.input_url.value = info[ft].url;
            return;
        case FT_anno_c:
            c.ui_hammock.input_url.value = info[ft].url;
            c.ui_hammock.input_name.value = info[ft].name;
            if (info[ft].json) {
                c.ui_hammock.input_json.value = JSON.stringify(info[ft].json);
            }
            return;
        case FT_weaver_c:
            c.ui_weaver.input_url.value = info[ft].url;
            c.ui_weaver.input_name.value = info[ft].name;
            return;
        default:
            fatalError('unknown ft');
    }
}
function custtkpanel_show(ft) {
// clicking big butt to show submit ui
    var c = apps.custtk.bbj.genome.custtk;
    apps.custtk.main.__hbutt2.style.display = 'block';
    c.ui_bed.style.display = ft == FT_bed_c ? 'block' : 'none';
    c.ui_bedgraph.style.display = ft == FT_bedgraph_c ? 'block' : 'none';
    c.ui_cat.style.display = ft == FT_cat_c ? 'block' : 'none';
    c.ui_bam.style.display = ft == FT_bam_c ? 'block' : 'none';
    c.ui_lr.style.display = ft == FT_lr_c ? 'block' : 'none';
    c.ui_bigwig.style.display = ft == FT_bigwighmtk_c ? 'block' : 'none';
    c.ui_hammock.style.display = ft == FT_anno_c ? 'block' : 'none';
    c.ui_weaver.style.display = ft == FT_weaver_c ? 'block' : 'none';
    c.ui_hub.style.display = ft == FT_huburl ? 'block' : 'none';
    if (c.ui_submit.style.display == 'none') {
        flip_panel(c.buttdiv, c.ui_submit, true);
    }
    apps.custtk.shortcut[ft].style.display = 'inline-block';
}
function custtkpanel_back2control() {
    apps.custtk.main.__hbutt2.style.display = 'none';
    var c = apps.custtk.bbj.genome.custtk;
    if (c.ui_submit.style.display != 'none') {
        flip_panel(c.buttdiv, c.ui_submit, false);
    }
}

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


Genome.prototype.newcustomtrackname = function () {
    var n = Math.random().toString().split('.')[1];
    while ((n in this.hmtk) || (n in this.decorInfo))
        n = Math.random().toString().split('.')[1];
    return n;
};

Genome.prototype.tkurlInUse = function (url) {
    for (var t in this.hmtk) {
        var tk = this.hmtk[t];
        if (isCustom(tk.ft) && tk.url == url) return true;
    }
    return false;
};


function submitCustomtrack(event) {
    /* called only by pushing button, works for all types
     real tracks, not datahub
     20130326 big old bug of not adding track for splinters
     */
    var ft = event.target.ft;
    var bbj = apps.custtk.bbj;
    if (ft == FT_huburl) {
        bbj.loaddatahub_pushbutt();
        return;
    }
    if (!isCustom(ft)) fatalError('wrong ft');
    var c;
    var _tmp = {
        ft: ft,
        name: bbj.genome.newcustomtrackname(),
        mode: M_show,
    };

    switch (ft) {
        case FT_bedgraph_c:
            c = bbj.genome.custtk.ui_bedgraph;
            _tmp.url = c.input_url.value.trim();
            _tmp.label = c.input_name.value;
            _tmp.qtc = {height: 40};
            break;
        case FT_bigwighmtk_c:
            c = bbj.genome.custtk.ui_bigwig;
            _tmp.url = c.input_url.value.trim();
            _tmp.label = c.input_name.value;
            _tmp.qtc = {height: 40};
            break;
        case FT_cat_c:
            c = bbj.genome.custtk.ui_cat;
            _tmp.url = c.input_url.value.trim();
            _tmp.label = c.input_name.value;
            if (c.lst.length <= 1) {
                print2console('Wrong cateinfo', 2);
                return;
            }
            _tmp.cateInfo = {};
            for (var i = 0; i < c.lst.length; i++) {
                var textinput = c.lst[i][0].value;
                if (textinput.length > 0) {
                    _tmp.cateInfo[i + 1] = [textinput, c.lst[i][1].style.backgroundColor];
                } else {
                    print2console('No name provided for category ' + (i + 1), 2);
                    return;
                }
            }
            break;
        case FT_bed_c:
            c = bbj.genome.custtk.ui_bed;
            _tmp.url = c.input_url.value.trim();
            _tmp.label = c.input_name.value;
            _tmp.mode = parseInt(c.mode.options[c.mode.selectedIndex].value);
            break;
        case FT_lr_c:
            c = bbj.genome.custtk.ui_lr;
            _tmp.url = c.input_url.value.trim();
            _tmp.label = c.input_name.value;
            _tmp.mode = parseInt(c.mode.options[c.mode.selectedIndex].value);
            var score1 = parseFloat(c.input_pscore.value);
            if (isNaN(score1)) {
                print2console('Invalid positive threshold value', 2);
                return;
            }
            if (score1 < 0) {
                print2console('Positive threshold value must be >=0', 2);
                return;
            }
            var score2 = parseFloat(c.input_nscore.value);
            if (isNaN(score2)) {
                print2console('Invalid negative threshold value', 2);
                return;
            }
            if (score2 > 0) {
                print2console('Negative threshold value must be <=0', 2);
                return;
            }
            _tmp.qtc = {pfilterscore: score1, nfilterscore: score2};
            break;
        case FT_bam_c:
            c = bbj.genome.custtk.ui_bam;
            _tmp.url = c.input_url.value.trim();
            _tmp.label = c.input_name.value;
            _tmp.mode = parseInt(c.mode.options[c.mode.selectedIndex].value);
            break;
        case FT_anno_c:
            c = bbj.genome.custtk.ui_hammock;
            _tmp.url = c.input_url.value.trim();
            _tmp.label = c.input_name.value;
            _tmp.mode = parseInt(c.mode.options[c.mode.selectedIndex].value);
            var s = c.input_json.value;
            if (s.length > 0) {
                var j = str2jsonobj(s);
                if (!j) {
                    print2console('Syntax error with JSON description', 2);
                    return;
                }
                hammockjsondesc2tk(j, _tmp);
            }
            break;
        case FT_weaver_c:
            c = bbj.genome.custtk.ui_weaver;
            _tmp.url = c.input_url.value.trim();
            _tmp.cotton = c.input_name.value;
            _tmp.label = c.cotton + ' to ' + bbj.genome.name;
            break;
        default:
            fatalError('ft exception: ' + ft);
    }
    //dpuru - commenting this for performance testing
    /*if (bbj.genome.tkurlInUse(_tmp.url)) {
        print2console('This track has already been submitted', 2);
        return;
    }*/
    if (newCustomTrack_isInvalid(_tmp)) {
        return;
    }

    if (ft == FT_weaver_c) {
        if (bbj.weaver && bbj.weaver.mode == W_fine) {
            /* already weaving in fine mode
             must refresh all other tracks especially the existing weavertk
             or else eerie things happen
             */
            bbj.onloadend_once = function () {
                bbj.ajaxX(bbj.displayedRegionParam() + '&changeGF=on');
            };
        }
        bbj.init_bbj_param = {tklst: [_tmp]};
        bbj.ajax_loadbbjdata(bbj.init_bbj_param);
        return;
    }
    c.submit_butt.disabled = true;
    bbj.cloak();
    bbj.genome.pending_custtkhash[_tmp.name] = _tmp;
    print2console("Adding custom track...", 0);
    bbj.ajax('addtracks=on&dbName=' + bbj.genome.name + '&' + bbj.displayedRegionParamPrecise() + trackParam([_tmp]), function (data) {
        bbj.submitCustomtrack_cb(data, _tmp, c);
    });
}


Browser.prototype.submitCustomtrack_cb = function (data, tk, ui) {
    ui.submit_butt.disabled = false;
    this.unveil();
    if (!data || data.brokenbeads) {
        print2console('Something about this track is broken. Please check your input.', 2);
        menu_blank();
        dom_create('div', menu.c32, 'margin:10px;width:200px;').innerHTML = 'Failed to add this track.<br><br>If this is an updated version of a previously used track, you need to refresh cache.';
        var d = dom_create('div', menu.c32, 'margin:20px;');
        this.refreshcache_maketkhandle(d, tk);
        menu_show_beneathdom(0, ui.submit_butt);
        gflag.menu.bbj = apps.custtk.bbj;
        return;
    }
    this.jsonAddtracks(data);
    done();
    flip_panel(this.genome.custtk.buttdiv, this.genome.custtk.ui_submit, false);
    apps.custtk.main.__hbutt2.style.display = 'none';
    for (var tag in this.splinters) {
        this.splinters[tag].ajax_addtracks([tk]);
    }
};

function newCustomTrack_isInvalid(hash) {
    /* first fetch url and name of custom track into global variables,
     then call the validation routine
     */
    var url = hash.url;
    if (url.length <= 0) {
        print2console("no URL given for custom track", 3);
        return true;
    }
    if (url.length <= 8) {
        print2console("URL looks invalid", 3);
        return true;
    }
    if (url.substr(0, 4).toLowerCase() != 'http' && url.substr(0, 3).toLowerCase() != 'ftp') {
        print2console("unrecognizable URL", 3);
        return true;
    }
    var label = hash.label;
    if (label.length == 0) {
        print2console("no track name entered", 3);
        return true;
    }
    if (label.indexOf(',') != -1) {
        print2console("no comma allowed for track name", 2);
        return true;
    }
    if (label.indexOf('|') != -1) {
        print2console("no vertical line allowed for track name", 2);
        return true;
    }
    return false;
}


Genome.prototype.custtk_makeui = function (ft, holder) {
    var d = make_headertable(holder);
    d.style.position = 'absolute';
    d.style.left = 0;
    d.style.top = 0;
    d._c.style.padding = '20px 30px';
    var ftname;
    switch (ft) {
        case FT_bedgraph_c:
            d._h.innerHTML = 'bedGraph track | <a href=http://washugb.blogspot.com/2012/09/generate-tabix-files-from-bigwig-files.html target=_blank>help</a>';
            ftname = 'bedGraph';
            break;
        case FT_cat_c:
            d._h.innerHTML = 'Categorical track | <a href=http://washugb.blogspot.com/2013/08/v23-custom-categorical-track.html target=_blank>help</a>';
            ftname = 'categorical';
            break;
        case FT_bed_c:
            d._h.innerHTML = 'Bed track | <a href=http://washugb.blogspot.com/2012/09/generate-tabix-files-from-bigbed-files.html target=_blank>help</a>';
            ftname = 'BED';
            break;
        case FT_anno_c:
            d._h.innerHTML = 'Hammock track | <a href=' + FT2noteurl[FT_anno_n] + ' target=_blank>help</a>';
            ftname = 'hammock';
            break;
        case FT_lr_c:
            d._h.innerHTML = 'Pairwise interaction track <a href=http://washugb.blogspot.com/2012/09/prepare-custom-long-range-interaction.html target=_blank>help</a>';
            ftname = 'long-range interaction';
            break;
        case FT_sam_c:
            d._h.innerHTML = '<a href=http://washugb.blogspot.com/2012/09/generate-tabix-file-from-bam-file.html target=_blank>help</a>';
            ftname = 'SAM';
            break;
        case FT_huburl:
            d._h.innerHTML = 'Data hub | <a href=' + FT2noteurl[FT_huburl] + ' target=_blank>JSON format preferred</a>, <a href=http://washugb.blogspot.com/2013/11/v29-2-of-4-displaying-track-hubs-from.html target=_blank>UCSC format partially supported</a>';
            ftname = 'Datahub';
            break;
        case FT_bigwighmtk_c:
            d._h.innerHTML = 'bigWig track | <a href=http://genome.ucsc.edu/goldenPath/help/bigWig.html target=_blank>help</a>';
            ftname = 'bigWig';
            break;
        case FT_bam_c:
            d._h.innerHTML = 'BAM track | <a href=http://washugb.blogspot.com/2013/05/v18-new-page-look-bam-file-support.html target=_blank>help</a>';
            ftname = 'BAM';
            break;
        case FT_weaver_c:
            d._h.innerHTML = 'Genomealign track | <a href=' + FT2noteurl[FT_weaver_c] + ' target=_blank>help</a>';
            ftname = 'Genomealign';
            break;
    }

    var table = dom_create('table', d._c);
    table.style.whiteSpace = 'nowrap';
    table.cellSpacing = 10;
// row 1
    var tr = table.insertRow(0);
    var td = tr.insertCell(0);
    td.align = 'right';
    td.innerHTML = ftname + ' file URL';
    var td = tr.insertCell(1);
    var inp = dom_create('input', td);
    inp.type = 'text';
    inp.size = 40;
    d.input_url = inp;
    if (ft == FT_huburl) {
        // tabular or json?
        d.select = dom_addselect(td, null, [
            {value: 'json', text: 'JSON', selected: true},
            {value: 'ucsctrackdb', text: 'UCSC data hub'}]);
    }
// row 2
    tr = table.insertRow(-1);
    td = tr.insertCell(0);
    td.align = 'right';
    if (ft != FT_huburl) {
        td.innerHTML = ft == FT_weaver_c ? 'Query genome name' : 'Track name';
    }
    td = tr.insertCell(1);
    if (ft == FT_huburl) {
    } else {
        inp = dom_create('input', td);
        inp.type = 'text';
        inp.size = 20;
        d.input_name = inp;
    }
    dom_addbutt(td, 'Clear', function () {
        d.input_url.value = '';
        if (d.input_name) d.input_name.value = '';
    });
// row 3
    if (ft == FT_anno_c || ft == FT_bed_c || ft == FT_lr_c || ft == FT_sam_c || ft == FT_bam_c) {
        tr = table.insertRow(-1);
        td = tr.insertCell(0);
        td.align = 'right';
        td.innerHTML = 'Show as';
        td = tr.insertCell(1);
        var options = [
            {value: M_full, text: 'full'},
            {value: M_thin, text: 'thin'},
        ];
        if (ft == FT_anno_c || ft == FT_bed_c || ft == FT_sam_c || ft == FT_bam_c) {
            options.push({value: M_den, text: 'density'});
        } else if (ft == FT_lr_c) {
            options.unshift({value: M_trihm, text: 'heatmap'});
            options.unshift({value: M_arc, text: 'arc'});
        }
        d.mode = dom_addselect(td, null, options);
    }
// row 4-5
    if (ft == FT_anno_c) {
        tr = table.insertRow(-1);
        td = tr.insertCell(0);
        td.align = 'right';
        td.innerHTML = 'JSON descriptions<br><span style="font-size:70%;opacity:.7;">required when "category" or "scorelst"<br>attributes are used<br><a href=' + FT2noteurl[FT_anno_n] + '#Compound_attributes target=_blank>learn more</a></span>';
        td = tr.insertCell(1);
        inp = dom_create('textarea', td);
        inp.rows = 4;
        inp.cols = 20;
        d.input_json = inp;
    }
    if (ft == FT_lr_c) {
        tr = table.insertRow(-1);
        td = tr.insertCell(0);
        td.align = 'right';
        td.innerHTML = 'Positive score cutoff';
        td = tr.insertCell(1);
        inp = dom_create('input', td);
        d.input_pscore = inp;
        inp.type = 'text';
        inp.size = 3;
        inp.value = 2;
        dom_addtext(td, 'only applies to positively-scored items', '#858585');
        tr = table.insertRow(-1);
        td = tr.insertCell(0);
        td.align = 'right';
        td.innerHTML = 'Negative score cutoff';
        td = tr.insertCell(1);
        inp = dom_create('input', td);
        d.input_nscore = inp;
        inp.type = 'text';
        inp.size = 3;
        inp.value = -2;
        dom_addtext(td, 'only applies to negatively-scored items', '#858585');
    }
    if (ft == FT_cat_c) {
        tr = table.insertRow(-1);
        td = tr.insertCell(0);
        td.align = 'right';
        td.innerHTML = 'Number of categories';
        td = tr.insertCell(1);
        var ip = dom_create('input', td);
        ip.type = 'text';
        ip.value = 5;
        ip.size = 5;
        ip.addEventListener('change', custcate_idnum_change_input, false);
        d.category_idnum = ip;
        dom_addbutt(td, 'set', custcate_idnum_change_input);
        tr = table.insertRow(-1);
        td = tr.insertCell(0);
        td.colSpan = 2;
        var d2 = dom_create('div', td, 'display:table;margin:5px 100px;padding:5px 15px;border:solid 1px #ccc;');
        dom_addtext(d2, 'Define categories of this track');
        d.category_table = dom_create('table', d2, 'display:block;margin-top:10px;');
    }
    tr = table.insertRow(-1);
    if (ft == FT_weaver_c) {
        td = tr.insertCell(0);
        td.align = 'right';
        td.innerHTML = 'Prebuilt alignments<div style="font-size:80%">source: <a href=http://genome.ucsc.edu target=_blank>UCSC Genome Browser</a></div>';
        d.weavertkholder = tr.insertCell(1);
        tr = table.insertRow(-1);
        tr.insertCell(0);
        td = tr.insertCell(1);
        d.submit_butt = dom_addbutt(td, 'SUBMIT', submitCustomtrack);
        d.submit_butt.ft = ft;
    } else {
        td = tr.insertCell(0);
        td.align = 'right';
        d.examplebutt = dom_addbutt(td, 'Use example', function () {
            custtk_useexample(ft);
        });
        td = tr.insertCell(1);
        d.submit_butt = dom_addbutt(td, 'SUBMIT', submitCustomtrack);
        d.submit_butt.ft = ft;
    }
    d.style.display = 'none';
    return d;
};

function tkentryclick_simple(event) {
    event.target.className = event.target.className == 'tkentry' ? 'tkentry_onfocus' : 'tkentry';
}

Browser.prototype.tkCount = function () {
    var total = 0, ctotal = 0;
    for (var k in this.genome.hmtk) {
        var t = this.genome.hmtk[k];
        if (!t.mastertk) {
            total++;
            if (!t.public && isCustom(t.ft)) {
                ctotal++;
            }
        }
    }
    return [total, ctotal];
};

/*** __custtk__ ends ***/