/**
 * Created by dpuru on 2/27/15.
 */
/*** __hub__ */

Genome.prototype.publichub_makehandle = function (hub, holder) {
    var table = dom_create('table', holder, 'display:inline-block;margin:15px 15px 15px 0px;background-color:' + colorCentral.background_faint_5);
    table.cellPadding = 10;
    table.cellSpacing = 0;
    if (hub.hublist) {
        table.style.borderTop = '2px solid white';
    }
    var tr = table.insertRow(0);
    var td0 = tr.insertCell(0);
    td0.className = 'clb4';
    dom_addtext(td0, hub.name);
    dom_addtext(td0, '&nbsp;&nbsp;' +
        (hub.hublist ? (hub.hublist.length + ' hubs') : (hub.trackcount ? (hub.trackcount + ' tracks') : '')),
        colorCentral.foreground_faint_5);
    var td1 = tr.insertCell(1);
    if (hub.hublist) {
        td1.style.display = 'none';
    } else {
        td1.align = 'right';
        dom_addbutt(td1, '&nbsp; Load &nbsp;', publichub_load_closure(hub.id));
    }
    tr = table.insertRow(1);
    tr.style.display = 'none';
    td0.onclick = publichub_detail_closure(tr);
    var td = tr.insertCell(0);
    td.colSpan = 2;
    var d = dom_create('div', td, 'position:relative;width:' + (hub.hublist ? 700 : 600) + 'px;');
      if (hub.logo) {
        var img = dom_create('img', d, 'display:block;position:absolute;left:0px;top:0px;opacity:0.1;');
        img.src = hub.logo;
    }
    dom_create('div', d, 'margin:5px 20px 10px 20px;').innerHTML = hub.desc;
    if (hub.institution) {
        var d3 = dom_create('div', d, 'margin:10px 20px;');
        for (var j = 0; j < hub.institution.length; j++) {
            dom_create('div', d3, 'display:inline-block;white-space:nowrap;margin-right:10px;').innerHTML = hub.institution[j];
        }
    }
    if (hub.cite) {
        var d3 = dom_create('table', d, 'margin:10px 20px;');
        var tr4 = d3.insertRow(0);
        var td4 = tr4.insertCell(0);
        td4.vAlign = 'top';
        td4.innerHTML = 'Please cite:';
        td4 = tr4.insertCell(1);
        td4.innerHTML = hub.cite.join('<br>');
    }
    if (hub.hublist) {
        var d2 = dom_create('div', d, 'margin:10px 20px;');
        dom_create('div', d2, 'margin-top:20px;').innerHTML = 'This collection has following hubs:';
        return d2;
    } else {
        this.publichub.lst.push({says: td1, url: hub.url, id: hub.id});
    }
};

function publichub_detail_closure(tr) {
    return function () {
        publichub_detail(tr);
    };
}
function publichub_detail(d) {
    if (d.style.display == 'none') {
        d.style.display = 'table-row';
    } else {
        d.style.display = 'none';
    }
}
function publichub_load_closure(hubid) {
    return function () {
        publichub_load_page(hubid);
    };
}

function publichub_load_page(hubid) {
    apps.publichub.bbj.publichub_load(hubid);
}

Browser.prototype.publichub_load = function (hubid) {
    for (var i = 0; i < this.genome.publichub.lst.length; i++) {
        var h = this.genome.publichub.lst[i];
        if (h.id == hubid) {
            var butt = h.says.firstChild;
            if (butt.tagName == 'BUTTON') butt.disabled = true;
            this.loadhub_urljson(h.url, function () {
                h.says.innerHTML = ' <span class=clb onclick="apps.publichub.bbj.toggle8();apps.publichub.bbj.toggle1()">Loaded &#187;</span>';
            });
            return;
        }
    }
    print2console('Unknown publichub identifier: ' + hubid, 2);
    this.ajax_loadbbjdata(this.init_bbj_param);
};

Browser.prototype.loaddatahub_pushbutt = function () {
    var ui = this.genome.custtk.ui_hub;
    var url = ui.input_url.value;
    if (url.length == 0 || url == 'Enter URL of hub descriptor file') {
        print2console('URL to hub descriptor file required', 2);
        return;
    }
    ui.submit_butt.disabled = true;
    print2console('Loading data hub...', 0);
    this.cloak();
    var which = ui.select.options[ui.select.selectedIndex].value;
    if (which == 'json') {
        this.loadhub_urljson(url);
    } else {
        this.loaddatahub_ucsc(url);
    }
};


function jsonhub_upload(event) {
    gflag.fileupload_bbj = apps.custtk.bbj;
    var p = event.target;
    while (p.className != 'largebutt') p = p.parentNode;
    simulateEvent(p.previousSibling, 'click');
}


function jsonhub_choosefile(event) {
    var reader = new FileReader();
    reader.onerror = function () {
        print2console('Error reading file', 2);
    };
    reader.onabort = function () {
        print2console('Error reading file', 2);
    };
    reader.onload = function (e) {
        var j = parse_jsontext(e.target.result);
        if (!j) {
            return;
        }
        if (apps.custtk.main.style.display == 'block') {
            toggle7_2();
        }
        var b = gflag.fileupload_bbj;
        b.loaddatahub_json(j);
    };
    reader.readAsText(event.target.files[0]);
}


Browser.prototype.loadhub_urljson = function (url, callback) {
    /* load datahub from json text file by url
     oh, must use trunk please..
     */

    //dpuru : No idea what is trunk
    var bbj = this.trunk ? this.trunk : this;
    bbj.shieldOn();
    bbj.cloak();
    bbj.ajaxText('loaddatahub=on&url=' + url, function (text) {
            bbj.loadhub_urljson_cb(text, url, callback);
        }
    );
};

Browser.prototype.loadhub_urljson_cb = function (text, url, callback) {
    if (this.genome.custtk) {
        this.genome.custtk.ui_hub.submit_butt.disabled = false;
    }
    if (!text) {
        print2console('Cannot load this hub: ' + url, 2);
    } else {
        var j = parse_jsontext(text);
        if (j) {
            this.loaddatahub_json(j, url);
            if (apps.custtk && apps.custtk.main.style.display == 'block') {
                toggle7_2();
            }
            /* this callback is currently only used for public hubs
             */
            if (callback) {
                callback();
            }
            return;
        } else {
            print2console('Invalid JSON from this hub: ' + url, 2);
        }
    }
    this.ajax_loadbbjdata(this.init_bbj_param);
};


function jsontext_removecomment(t) {
    var lines = t.split('\n');
    if (lines.length == 0) return null;
    var nlst = [];
    for (var i = 0; i < lines.length; i++) {
        var l = lines[i].trim();
        if (l[0] == '#') continue;
        nlst.push(l);
    }
    return nlst.join('');
}

function parse_jsontext(text) {
    if (!text) return null;
    //var startTime = new Date().getTime();
    //var parsedJSON = undefined; //will save asynschronously parsed JSON in this variable
    try {
        var j = JSON.parse(text);
/*        var currentTime = new Date().getTime();
        var time = currentTime - startTime;
        console.log( "Parsing this json took: " + time + "ms" );*/

        //kick off async JSON parsing
/*        JSON.parseAsync( text, function( json )
        {
            var currentTime = new Date().getTime();
            var time = currentTime - startTime;
            console.log( "Parsing this json took: " + time + "ms" );
            parsedJSON = json;
        });*/
    } catch (e) {
        try {
            var t2 = jsontext_removecomment(text);
            if (!t2) return null;
            try {
                var j = eval('(' + t2 + ')');
            } catch (err) {
                return null;
            }
            return j;
        } catch (e) {
            return null;
        }
    }
    return j;
}

function hubtagistrack(tag) {
// this supports longrange to be backward compatible
    if (tag == 'bedgraph' || tag == 'bigwig' || tag == 'bed' ||
        tag == 'longrange' || tag == 'interaction' ||
        tag == 'bam' || tag == 'categorical' ||
        tag == 'methylc' || tag == 'ld' ||
        tag == 'annotation' || tag == 'hammock' ||
        tag == 'categorymatrix' ||
        tag == 'quantitativecategoryseries' ||
        tag == 'genomealign' ||
        tag == 'matplot'
    ) return true;
    return false;
}


Browser.prototype.parse_custom_track = function (obj) {
// mode
    var tmp = parse_tkmode(obj.mode);
    var m = tmp[0];
    if (tmp[1]) {
        // mode error
        print2console(tmp[1] + ' (' + obj.label + ')', 2);
    }
    var tag = obj.type.toLowerCase();
    switch (tag) {
        case 'bedgraph':
            obj.ft = FT_bedgraph_c;
            if (m != M_hide) {
                m = M_show;
            }
            break;
        case 'bigwig':
            obj.ft = FT_bigwighmtk_c;
            if (m != M_hide) {
                m = M_show;
            }
            break;
        case 'bed':
            obj.ft = FT_bed_c;
            if (m == M_show || m == M_arc || m == M_trihm) {
                m = M_full;
            }
            break;
        case 'longrange':
        case 'interaction':
            obj.ft = FT_lr_c;
            if (m == M_show) {
                m = M_arc;
            }
            break;
        case 'bam':
            obj.ft = FT_bam_c;
            if (m == M_show || m == M_arc || m == M_trihm) {
                m = M_den;
            }
            break;
        case 'categorical':
            obj.ft = FT_cat_c;
            if (m != M_hide) {
                m = M_show;
            }
            break;
        case 'methylc':
            obj.ft = FT_cm_c;
            if (m != M_hide) {
                m = M_show;
            }
            break;
        case 'matplot':
            obj.ft = FT_matplot;
            if (m != M_hide) {
                m = M_show;
            }
            break;
        case 'ld':
            obj.ft = FT_ld_c;
            if (m != M_hide) {
                m = M_trihm;
            }
            break;
        case 'annotation':
        case 'hammock':
            obj.ft = FT_anno_c;
            if (m == M_show || m == M_arc || m == M_trihm) {
                m = M_full;
            }
            break;
        case 'genomealign':
            obj.ft = FT_weaver_c;
            if (!obj.querygenome) {
                print2console('Query genome missing from ' + FT2verbal[FT_weaver_c] + ' track', 2);
                return null;
            }
            obj.cotton = obj.querygenome;
            delete obj.querygenome;
            m = M_full;
            if (!obj.name) obj.name = obj.cotton + ' to ' + this.genome.name;
            obj.weaver = {mode: W_fine};
            if (!obj.qtc) {
                obj.qtc = {};
            }
            obj.qtc.stackheight = weavertkstackheight;
            break;
        case 'categorymatrix':
            if (!obj.rowcount) {
                print2console('"rowcount" missing from catmat', 2);
                return null;
            }
            if (typeof(obj.rowcount) != 'number') {
                print2console('Invalid rowcount from catmat, must be integer', 2);
                return null;
            }
            if (!obj.rowheight || typeof(obj.rowheight) != 'number') {
                print2console('Invalid or missing "rowheight" from catmat', 2);
                return null;
            }
            obj.ft = FT_catmat;
            if (m != M_hide) {
                m = M_show;
            }
            break;
        case 'quantitativecategoryseries':
            obj.ft = FT_qcats;
            if (m != M_hide) {
                m = M_show;
            }
            break;
    }
    obj.mode = m;
    if (this.init_bbj_param && this.init_bbj_param.forceshowallhubtk) {
        obj.mode = tkdefaultMode(obj);
    }

    if (!obj.name) {
        obj.name = 'Unamed hub track';
    }
    obj.label = obj.name.replace(/,/g, ' ');
    //dpuru - commenting this for performance testing

    /*    if (obj.url && this.genome.tkurlInUse(obj.url)) {
            // XXXb
            for (var n in this.genome.hmtk) {
                var t2 = this.genome.hmtk[n];
                if (t2.url == obj.url) {
                    obj.name = t2.name;
                    break;
                }
            }
        } else {
            obj.name = this.genome.newcustomtrackname();
        }*/

    //dpuru
    obj.name = this.genome.newcustomtrackname();

    if (obj.ft == FT_cm_c) {
        if (!obj.tracks) {
            var msg = 'methylC track "' + obj.label + '" is dropped for missing the "tracks" attribute"';
            print2console(msg, 2);
            alertbox_addmsg({text: msg});
            return null;
        }
        if (!obj.tracks.forward) {
            var msg = 'methylC track "' + obj.label + '" is dropped for missing essential parameter ".tracks.forward"';
            print2console(msg, 2);
            alertbox_addmsg({text: msg});
            return null;
        }
        if (!obj.tracks.forward.ReadDepth) {
            var msg = 'methylC track "' + obj.label + '" is dropped for missing essential member track ".tracks.forward.ReadDepth"';
            print2console(msg, 2);
            alertbox_addmsg({text: msg});
            return null;
        }
        if (!obj.tracks.forward.CG) {
            var msg = 'methylC track "' + obj.label + '" is dropped for missing essential member track ".tracks.forward.CG"';
            print2console(msg, 2);
            alertbox_addmsg({text: msg});
            return null;
        }
        /* restrict, if any of the member track has been loaded, reject
         */
        for (var n in obj.tracks.forward) {
            var u = obj.tracks.forward[n].url;
            if (!u) {
                var msg = 'methylC track "' + obj.label + '" is dropped for missing track file URL for the member track ' + n + '/forward';
                print2console(msg, 2);
                alertbox_addmsg({text: msg});
                return null;
            }
            if (this.genome.tkurlInUse(u)) {
                var msg = 'methylC track "' + obj.label + '" problem: track file url of member track ' + n + '/forward is already in use.';
                print2console(msg, 2);
                alertbox_addmsg({text: msg + ' A track file URL cannot be used at multiple places in the same session. One way to get around this issue is to duplicate this file by soft-linking it to a new file name and obtain a new file URL.'});
                return null;
            }
        }
        if (obj.tracks.reverse) {
            for (var n in obj.tracks.reverse) {
                var u = obj.tracks.reverse[n].url;
                if (!u) {
                    var msg = 'methylC track "' + obj.label + '" lacks track file URL for the member track ' + n + '/reverse';
                    print2console(msg, 2);
                    alertbox_addmsg({text: msg});
                    return null;
                }
                if (this.genome.tkurlInUse(u)) {
                    var msg = 'methylC track ' + obj.label + ' problem: track file url of member track ' + n + '/reverse already in use.';
                    print2console(msg, 2);
                    alertbox_addmsg({text: msg + ' A track file URL cannot be used at multiple places in the same session. One way to get around this issue is to duplicate this file by soft-linking it to a new file name and obtain a new file URL.'});
                    return null;
                }
            }
        }
        obj.cm = {set: {}, color: {}, bg: {}};
        if (obj.combinestrands != undefined) {
            obj.cm.combine = obj.combinestrands;
            delete obj.combinestrands;
        } else {
            obj.cm.combine = false;
        }
        if (obj.combinestrands_chg != undefined) {
            obj.cm.combine_chg = obj.combinestrands_chg;
            delete obj.combinestrands_chg;
        } else {
            obj.cm.combine_chg = false;
        }
        obj.cm.scale = obj.scalebarheight;
        delete obj.scalebarheight;
        if (obj.filterreaddepth == undefined) {
            obj.cm.filter = 0;
        } else if (isNaN(obj.filterreaddepth) || obj.filterreaddepth <= 0) {
            print2console('value for "filterreaddepth" should be positive integer', 2);
            obj.cm.filter = 0;
        } else {
            obj.cm.filter = obj.filterreaddepth;
            delete obj.filterreaddepth;
        }

        var x = obj.tracks.forward.ReadDepth;
        obj.cm.set.rd_f = {
            ft: FT_bedgraph_c,
            name: this.genome.newcustomtrackname(),
            label: 'read depth - forward',
            url: x.url,
            mode: obj.mode,
            qtc: {summeth: summeth_mean},
            mastertk: obj.name,
        };
        obj.cm.color.rd_f = x.color;

        x = obj.tracks.forward.CG;
        obj.cm.set.cg_f = {
            ft: FT_bedgraph_c,
            name: this.genome.newcustomtrackname(),
            label: 'CG - forward',
            url: x.url,
            mode: obj.mode,
            qtc: {summeth: summeth_mean},
            mastertk: obj.name,
        };
        obj.cm.color.cg_f = x.color;
        obj.cm.bg.cg_f = x.bg;

        if (obj.tracks.forward.CHG) {
            x = obj.tracks.forward.CHG;
            obj.cm.set.chg_f = {
                ft: FT_bedgraph_c,
                name: this.genome.newcustomtrackname(),
                label: 'CHG - forward',
                url: x.url,
                mode: obj.mode,
                qtc: {summeth: summeth_mean},
                mastertk: obj.name,
            };
            obj.cm.color.chg_f = x.color;
            obj.cm.bg.chg_f = x.bg;
        }
        if (obj.tracks.forward.CHH) {
            x = obj.tracks.forward.CHH;
            obj.cm.set.chh_f = {
                ft: FT_bedgraph_c,
                name: this.genome.newcustomtrackname(),
                label: 'CHH - forward',
                url: x.url,
                mode: obj.mode,
                qtc: {summeth: summeth_mean},
                mastertk: obj.name,
            };
            obj.cm.color.chh_f = x.color;
            obj.cm.bg.chh_f = x.bg;
        }
        if (obj.tracks.reverse) {
            if (!obj.tracks.reverse.ReadDepth) {
                print2console('missing ".tracks.reverse.ReadDepth" in methylC track', 2);
                return null;
            }
            if (!obj.tracks.reverse.CG) {
                print2console('missing ".tracks.reverse.CG" in methylC track', 2);
                return null;
            }
            x = obj.tracks.reverse.ReadDepth;
            obj.cm.set.rd_r = {
                ft: FT_bedgraph_c,
                name: this.genome.newcustomtrackname(),
                label: 'read depth - reverse',
                url: x.url,
                mode: obj.mode,
                qtc: {summeth: summeth_mean},
                mastertk: obj.name,
            };
            obj.cm.color.rd_r = x.color;

            x = obj.tracks.reverse.CG;
            obj.cm.set.cg_r = {
                ft: FT_bedgraph_c,
                name: this.genome.newcustomtrackname(),
                label: 'CG - reverse',
                url: x.url,
                mode: obj.mode,
                qtc: {summeth: summeth_mean},
                mastertk: obj.name,
            };
            obj.cm.color.cg_r = x.color;
            obj.cm.bg.cg_r = x.bg;

            if (obj.tracks.reverse.CHG) {
                x = obj.tracks.reverse.CHG;
                obj.cm.set.chg_r = {
                    ft: FT_bedgraph_c,
                    name: this.genome.newcustomtrackname(),
                    label: 'CHG - reverse',
                    url: x.url,
                    mode: obj.mode,
                    qtc: {summeth: summeth_mean},
                    mastertk: obj.name,
                };
                obj.cm.color.chg_r = x.color;
                obj.cm.bg.chg_r = x.bg;
            }
            if (obj.tracks.reverse.CHH) {
                x = obj.tracks.reverse.CHH;
                obj.cm.set.chh_r = {
                    ft: FT_bedgraph_c,
                    name: this.genome.newcustomtrackname(),
                    label: 'CHH - reverse',
                    url: x.url,
                    mode: obj.mode,
                    qtc: {summeth: summeth_mean},
                    mastertk: obj.name,
                };
                obj.cm.color.chh_r = x.color;
                obj.cm.bg.chh_r = x.bg;
            }
        }
    } else if (obj.ft == FT_matplot) {
        if (!obj.tracks) {
            print2console('matplot track lacks "tracks" attribute"', 2);
            return null;
        }
        /* restrict, if any of the member track has been loaded, reject
         */
        var newlst = [];
        for (var i = 0; i < obj.tracks.length; i++) {
            var t = obj.tracks[i];
            if (!t.url) {
                print2console('missing member track URL of ' + t.name + ' in ' + obj.label, 2);
                return null;
            }

            //dpuru - commenting this for performance testing
/*            if (this.genome.tkurlInUse(t.url)) {
                // XXXb
                var f = false;
                for (var j = 0; j < this.tklst.length; j++) {
                    if (this.tklst[j].url == t.url) {
                        f = true;
                        break;
                    }
                }
                if (f) {
                    print2console('cannot load ' + obj.label + ', member track ' + t.name + ' already in use', 2);
                    print2console('try duplicating this file by softlinking it to get around this issue', 0);
                    return null;
                }
            }*/
            var t2 = this.parse_custom_track(t);
            if (!t2) {
                print2console('cannot load ' + obj.label + ': invalid member track ' + t.name, 2);
                return null;
            }
            t2.mastertk = obj.name;
            newlst.push(t2);
        }
        obj.tracks = newlst;
    } else {
        if (!obj.url) {
            print2console('datahub track lacks URL: ' + obj.label, 2);
            return null;
        }
        // TODO redundant tkurl from this hub
        //dpuru - commenting this for performance testing

        /*   if (!this.mustaddcusttk) {
               // XXXb
               if (this.genome.tkurlInUse(obj.url)) {
                   var f = false;
                   for (var i = 0; i < this.tklst.length; i++) {
                       if (this.tklst[i].url == obj.url) {
                           f = true;
                           break;
                       }
                   }
                   if (f) {
                       print2console('This hub track already exists: ' + obj.url, 2);
                       return null;
                   }
               }
           }*/
    }
    if (!obj.md) {
        obj.md = [];
    }
    if (obj.metadata) {
        for (var mdkey in obj.metadata) {
            if (!(mdkey in this.__hubmdvlookup)) {
                print2console('Invalid metadata for track annotation: ' + mdkey, 2);
                continue;
            }
            var mdvidx = this.__hubmdvlookup[mdkey];
            if (!gflag.mdlst[mdvidx]) {
                print2console('!! mdv cannot be found by idx: ' + mdvidx, 2);
                continue;
            }
            var c2p = gflag.mdlst[mdvidx].c2p;
            var md = {};
            if (Array.isArray(obj.metadata[mdkey])) {
                for (var i = 0; i < obj.metadata[mdkey].length; i++) {
                    var term = obj.metadata[mdkey][i];
                    if (term in c2p) {
                        md[term] = 1;
                    } else {
                        print2console('track ' + obj.label + ' has unknown term id (' + term + ') for ' + mdkey, 2);
                    }
                }
            } else {
                var term = obj.metadata[mdkey];
                if (term in c2p) {
                    md[term] = 1;
                } else {
                    print2console('track ' + obj.label + ' has unknown term id (' + term + ') for ' + mdkey, 2);
                }
            }
            obj.md[mdvidx] = md;
        }
        delete obj.metadata;
    }
// set internal md, so that it will show up in facet
    var mdi = getmdidx_internal();
    var a = {};
    a[FT2verbal[obj.ft]] = 1;
    if (obj.ft == FT_weaver_c) {
        a[obj.cotton] = 1;
    } else {
        a[this.genome.name] = 1;
    }
    obj.md[mdi] = a;

    if (obj.categories) {
        obj.cateInfo = obj.categories;
        delete obj.categories;
    }
// TODO ensembl accession
    if (obj.geo) {
        if (typeof(obj.geo) == 'string') {
            obj.geolst = obj.geo.split(',');
        } else if (Array.isArray(obj.geo)) {
            obj.geolst = obj.geo;
        }
        delete obj.geo;
    }
    if (obj.details_text) {
        obj.details = {};
        tkinfo_parse(obj.details_text, obj.details);
    }
    if (obj.group != undefined) {
        var _g = parseInt(obj.group);
        if (isNaN(_g)) {
            print2console('Value of group attribute must be non-negative integer', 2);
            delete obj.group;
        } else {
            obj.group = _g;
        }
    }
    parseHubtrack(obj);
    if (obj.ft == FT_cm_c) {
        // for cmtk, may apply smoothing to read depth tracks
        if (obj.qtc.smooth) {
            // cmtk smoothing applies to read depth data
            if (obj.cm.set.rd_f) {
                obj.cm.set.rd_f.qtc.smooth = obj.qtc.smooth;
            }
            if (obj.cm.set.rd_r) {
                obj.cm.set.rd_r.qtc.smooth = obj.qtc.smooth;
            }
        }
        delete obj.qtc.summeth;
    }
    return obj;
};

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

Browser.prototype.loaddatahub_json = function (json, sourcehub) {
    /** __jhub__ parsing a big json blob for:
     - loading datahub
     - recovering session
     - embed

     sourcehub: either url or file name

     attributes may come in as raw or cooked
     */
    /* need genome to validate native tk*/
    if (!this.genome) fatalError('Cannot parse hub: genome is not ready');

// brush off
    var err_notype = 0;
    var i = 0;
    while (i < json.length) {
        var o = json[i];
        if (!o.type) {
            err_notype++;
            json.splice(i, 1);
        } else {
            o.type = o.type.toLowerCase();
            i++;
        }
    } //parses 1 time
    if (err_notype) print2console(err_notype + ' items without type attribute dropped from hub', 2);

// check for duplicating tkurl
    var uh = {};
    var i = 0;
    while (i < json.length) {
        var o = json[i];
        if (hubtagistrack(o.type) && o.url) {
            if (o.url in uh) {
                var m = 'Track with duplicating URL removed: ' + o.name + ' ' + o.url;
                print2console(m, 1);
                alertbox_addmsg({text: m});
                json.splice(i, 1);
                continue;
            } else {
                uh[o.url] = 1;
            }
        }
        i++;
    } //parses 2 times

    /* initiate param
     */
    if (!this.init_bbj_param) {
        this.init_bbj_param = {};
    }
    var ibp = this.init_bbj_param;
    if (!ibp.tklst) {
        ibp.tklst = [];
    }
    if (!ibp.cmtk) {
        ibp.cmtk = [];
    }
    if (!ibp.matplot) {
        ibp.matplot = [];
    }
    if (!ibp.mcm_termlst) {
        ibp.mcm_termlst = [];
    }
    if (!ibp.track_order) {
        ibp.track_order = [];
    }

    /* compatible with single-vocabulary case
     simply convert to vocabulary_set/metadata and get done with it
     "mdkey" is reserved word
     */
    var convertmd = false;
    var md_obj = null;
    for (var i = 0; i < json.length; i++) {
        var obj = json[i];
        if (obj.type != 'metadata') continue;
        /*** the metadata object must not be deleted!!
         or else shared mdobj won't be put in __hubmdvlookup
         */
        md_obj = obj;
        if (!obj.vocabulary_set) obj.vocabulary_set = {};
        if (obj.vocabulary) {
            obj.vocabulary_set.mdkey = {
                vocabulary: obj.vocabulary,
                terms: obj.terms,
                source: sourcehub,
            };
            delete obj.vocabulary;
            if (obj.show_terms) {
                obj.show_terms = {mdkey: obj.show_terms};
            } else if (obj.show) {
                obj.show_terms = {mdkey: obj.show};
                delete obj.show;
            }
            convertmd = true;
        } else if (obj.vocabulary_file_url) {
            obj.vocabulary_set.mdkey = obj.vocabulary_file_url;
            if (obj.show_terms) {
                obj.show_terms = {mdkey: obj.show_terms};
            } else if (obj.show) {
                obj.show_terms = {mdkey: obj.show};
                delete obj.show;
            }
            convertmd = true;
            delete obj.vocabulary_file_url;
        }
        break;
    } //parses 3 times
    if (convertmd) {
        // deal with obsolete track md attributes
        var err1 = 0, err2 = 0;
        for (var i = 0; i < json.length; i++) {
            var obj = json[i];
            if (!hubtagistrack(obj.type)) continue;
            if (obj.annotation) {
                err1++;
            } else if (obj.custom_annotation) {
                // backward compatible
                err2++;
                obj.metadata = {mdkey: obj.custom_annotation};
                delete obj.custom_annotation;
            } else if (obj.metadata) {
                var v = obj.metadata;
                obj.metadata = {mdkey: v};
            }
        }
        if (err1) {
            alertbox_addmsg({text: 'Obsolete attribute "annotation" is found in ' + err1 + ' tracks, use shared metadata instead.<br>See ' + FT2noteurl.md});
        }
        if (err2) {
            alertbox_addmsg({text: 'Obsolete attribute "custom_annotation" is found in ' + err2 + ' tracks, use "metadata" attribute instead.<br>See ' + FT2noteurl.md});
        }
    }

    var mdi = getmdidx_internal();
    if (mdi != -1) this.__hubmdvlookup[literal_imd] = mdi;

    if (md_obj) {
        // process metadata, load mdv from url
        // process object first (private md)
        for (var mdkey in md_obj.vocabulary_set) {
            var md = md_obj.vocabulary_set[mdkey];
            if (typeof(md) == 'object') {
                if (!md.source) {
                    md.source = sourcehub;
                }
                var midx = load_metadata_json(md);
                this.__hubmdvlookup[mdkey] = midx;
                delete md_obj.vocabulary_set[mdkey];
            }
        }
        // process url (shared md)
        for (var mdkey in md_obj.vocabulary_set) {
            var mdurl = md_obj.vocabulary_set[mdkey];
            if (!typeof(mdurl) == 'string') {
                print2console('expecting url of shared md but got ' + typeof(mdurl), 2);
                continue;
            }
            var miss = true;
            for (var j = 0; j < gflag.mdlst.length; j++) {
                var m = gflag.mdlst[j];
                if (m.sourceurl && m.sourceurl == mdurl) {
                    this.__hubmdvlookup[mdkey] = j;
                    miss = false;
                    delete md_obj.vocabulary_set[mdkey];
                    break;
                }
            }
            if (miss) {
                if (mdurl in this.__hubfailedmdvurl) {
                    // failed, do not load it
                    delete this.__hubmdvlookup[mdurl];
                } else {
                    // load it then
                    print2console('Loading shared metadata...', 0);
                    this.__pending_hubjson = json;
                    this.load_metadata_url(mdurl);
                    return;
                }
            }
        }
        if (md_obj.show_terms) {
            for (var mdkey in md_obj.show_terms) {
                var mdidx = this.__hubmdvlookup[mdkey];
                if (mdidx == undefined) {
                    print2console('Unrecognized show_terms type: ' + mdkey, 2);
                    continue;
                }
                var mdobj = gflag.mdlst[mdidx];
                var showterm = [];
                if (Array.isArray(md_obj.show_terms[mdkey])) {
                    for (var j = 0; j < md_obj.show_terms[mdkey].length; j++) {
                        var term = md_obj.show_terms[mdkey][j];
                        if (term in mdobj.c2p || term in mdobj.p2c) {
                            showterm.push(term);
                        } else {
                            print2console('Unrecognized ' + mdkey + ' term: ' + term, 2);
                        }
                    }
                } else {
                    var term = md_obj.show_terms[mdkey];
                    if (term in mdobj.c2p || term in mdobj.p2c) {
                        showterm.push(term);
                    } else {
                        print2console('Unrecognized ' + mdkey + ' term: ' + term, 2);
                    }
                }
                if (showterm.length > 0) {
                    // check if the term has already been shown
                    for (var k = 0; k < showterm.length; k++) {
                        var st = showterm[k];
                        var shown = false;
                        for (var i = 0; i < this.mcm.lst.length; i++) {
                            var t = this.mcm.lst[i];
                            if (t[0] == st && t[1] == mdidx) {
                                shown = true;
                                break;
                            }
                        }
                        if (!shown) {
                            this.mcm.lst.push([st, mdidx]);
                        }
                    }
                }
            }
        }
        if (md_obj.facet_table && this.facet) {
            var k1 = md_obj.facet_table[0];
            if (k1) {
                var id1 = this.__hubmdvlookup[k1];
                if (id1 == undefined) {
                    print2console('Unknown key for facet table: ' + k1, 2);
                } else {
                    this.facet.dim1.mdidx = id1;
                    for (var n in gflag.mdlst[id1].root) {
                        this.facet.dim1.term = n;
                        break;
                    }
                }
            }
            var k2 = md_obj.facet_table[1];
            if (k2) {
                var id2 = this.__hubmdvlookup[k2];
                if (id2 == undefined) {
                    print2console('Unknown key for facet table: ' + k2, 2);
                } else {
                    this.facet.dim2.mdidx = id2;
                    for (var n in gflag.mdlst[id2].root) {
                        this.facet.dim2.term = n;
                        break;
                    }
                }
            }
        }
    }

    var gslst = []; // adding gene set not handled in ibp

    /* find category set
     */
    var category_set = null,
        err_tkcat1 = 0,
        err_tkcat2 = 0;
    for (var i = 0; i < json.length; i++) {
        var obj = json[i];
        if (!obj.type) continue;
        if (obj.type == 'category_set') {
            if (!obj.set) {
                print2console('set is missing from category_set', 2);
            } else {
                category_set = obj.set;
            }
            json.splice(i, 1);
            break;
        }
    } //parses 4 times


    /* go over list again to process all stuff
     all custom tracks go into ghm (where=1), natives go under it (where=2)
     */
    for (var i = 0; i < json.length; i++) {
        var obj = json[i];
        var tag = obj.type;
        if (hubtagistrack(tag)) {
            var tk = this.parse_custom_track(obj);
            if (!tk) {
                continue;
            }
            if (tk.category_set_index != undefined) {
                if (!category_set) {
                    err_tkcat1++;
                } else {
                    if (tk.category_set_index in category_set) {
                        tk.cateInfo = {};
                        cateInfo_copy(category_set[tk.category_set_index], tk.cateInfo);
                        delete tk.category_set_index;
                    } else {
                        err_tkcat2++;
                    }
                }
            }
            if (tk.ft == FT_cm_c) {
                // compound
                if (tk.mode == M_hide) {
                    this.genome.registerCustomtrack(tk);
                    for (var tn in tk.cm.set) {
                        var mt = tk.cm.set[tn];
                        this.genome.registerCustomtrack(mt);
                        tk.cm.set[tn] = mt.name;
                    }
                } else {
                    ibp.cmtk.push(tk);
                    ibp.track_order.push({name: tk.name, where: 1});
                    for (var tn in tk.cm.set) {
                        var mt = tk.cm.set[tn];
                        ibp.tklst.push(mt);
                        tk.cm.set[tn] = mt.name;
                    }
                }
            } else if (tk.ft == FT_matplot) {
                // compound
                var namelst = [];
                if (tk.mode == M_hide) {
                    for (var j = 0; j < tk.tracks.length; j++) {
                        var mt = tk.tracks[j];
                        this.genome.registerCustomtrack(mt);
                        namelst.push(mt.name);
                    }
                } else {
                    ibp.matplot.push(tk);
                    ibp.track_order.push({name: tk.name, where: 1});
                    for (var j = 0; j < tk.tracks.length; j++) {
                        var mt = tk.tracks[j];
                        mt.mode = tkdefaultMode(mt);
                        if (mt.mode != M_show) {
                            mt.mode = M_den;
                        }
                        ibp.tklst.push(mt);
                        namelst.push(mt.name);
                    }
                }
                tk.tracks = namelst;
                if (tk.mode == M_hide) {
                    this.genome.registerCustomtrack(tk);
                }
            } else {
                // all the other types
                if (tk.mode == M_hide) {
                    this.genome.registerCustomtrack(tk);
                } else {
                    ibp.tklst.push(tk);
                    ibp.track_order.push({name: tk.name, where: 1});
                }
            }
            if (tk.ft == FT_weaver_c && tk.tracks) {
                // pending cotton tracks
                if (!Array.isArray(tk.tracks)) {
                    print2console(FT2verbal[FT_weaver_c] + ' .tracks must be an array', 2);
                } else {
                    // cottonbbj has not been made, put into pending
                    if (!this.weaverpending) {
                        this.weaverpending = {};
                    }
                    this.weaverpending[tk.cotton] = tk.tracks;
                }
                delete tk.tracks;
            }

        } else if (tag == 'geneset') {
            if (!obj.list || obj.list.length == 0) {
                print2console('The gene set has no content', 2);
                continue;
            }
            if (!obj.name) {
                obj.name = 'A gene set from datahub';
            }
            gslst.push(obj);
        } else if (tag == 'geneset_ripe') {
            if (!obj.list) {
                print2console('list missing from geneset_ripe', 2);
            } else {
                ibp.geneset_ripe = obj.list;
            }
        } else if (tag == 'native_metadata_terms') {
            alertbox_addmsg({text: 'Use of obsolete attribute "native_metadata_terms" in datahub (see ' + FT2noteurl.md + ')'});
        } else if (tag == 'native_track') {
            // validate native tracks here and put to .tklst
            if (!obj.list) {
                print2console('Missing list in native_track', 2);
            } else {
                // guard against duplicates
                for (var j = 0; j < obj.list.length; j++) {
                    var t = this.genome.parse_native_track(obj.list[j]);
                    if (t) {
                        ibp.tklst.push(t);
                        ibp.track_order.push({name: t.name, where: 2});
                    }
                }
            }
        } else if (tag == 'newbrowser') {
            ibp.newbrowserlst = obj.list;
        } else if (tag == 'coordinate_override') {
            ibp.coord_rawstring = obj.coord;
        } else if (tag == 'coordinate_notes') {
            if (!obj.list) {
                print2console('list missing in coordinate notes', 2);
            } else {
                ibp.coord_notes = obj.list;
            }
        } else if (tag == 'run_genesetview') {
            if (!obj.list) {
                print2console('list missing in genesetview', 2);
            } else {
                ibp.gsvparam = obj;
            }
        } else if (tag == 'splinters') {
            if (!obj.list) {
                print2console('list missing in splinters', 2);
            } else {
                ibp.splinters = obj.list;
            }
        } else if (tag == 'customized_color') {
            if (!obj.list) {
                print2console('list missing in ' + tag, 2);
            } else {
                for (var x = 0; x < obj.list.length; x++) {
                    var _c = obj.list[x];
                    colorCentral.longlst[_c[0]] = _c[1];
                }
            }
        } else if (tag == 'group_yscale_fixed') {
            if (!obj.groups) {
                print2console('groups missing in ' + tag, 2);
            } else {
                for (var gid in obj.groups) {
                    var a = obj.groups[gid];
                    if (a.min == undefined) {
                        print2console('min is undefined in group ' + gid, 2);
                    } else if (a.max == undefined) {
                        print2console('max is undefined in group ' + gid, 2);
                    } else {
                        this.tkgroup[gid] = {
                            scale: scale_fix,
                            min: a.min,
                            min_show: a.min,
                            max: a.max,
                            max_show: a.max
                        };
                    }
                }
            }
        } else if (tag == 'metadata') {
        } else {
            print2console('Unknown type in datahub: ' + tag, 2);
        }
    } //parses 5 times

    if (err_tkcat1) {
        var m = err_tkcat1 + ' tracks are requiring category_set which is missing from the hub';
        print2console(m, 2);
        alertbox_addmsg({text: m});
    }
    if (err_tkcat2) {
        var m = err_tkcat2 + ' tracks are using wrong category_set_index';
        print2console(m, 2);
        alertbox_addmsg({text: m});
    }

    if (gslst.length > 0) {
        if (!apps.gsm) {
            print2console('Error: gene set management module is not loaded', 2);
        } else {
            this.genome.geneset.__pendinggs = this.genome.geneset.__pendinggs.concat(gslst);
            this.genome.addgeneset_recursive();
        }
    }

// juxtaposition
// do not concern about the case when multiple tracks are tagged with juxtapose
    for (var i = 0; i < ibp.tklst.length; i++) {
        var t = ibp.tklst[i];
        if (t.juxtapose == undefined) continue;
        if (t.issnp) continue;
        if (t.ft == FT_bed_n || t.ft == FT_anno_n) {
            ibp.juxtapose_rawstring = t.name;
            if (ibp.juxtaposecustom) {
                delete ibp.juxtaposecustom;
            }
        } else if (t.ft == FT_bed_c || t.ft == FT_anno_c) {
            ibp.juxtapose_rawstring = t.url;
            ibp.juxtaposecustom = true;
        } else {
            print2console('Juxtaposition can only be applied to bed or annotation tracks', 2);
        }
        delete t.juxtapose;
    } //parses 6 times

    if (this.__golden_loadhubcb) {
        // to prevent default processing of tracks
        this.__golden_loadhubcb();
    } else {
        this.ajax_loadbbjdata(ibp);
    }
};


function custmdanno_parsestr(str, obj) {
// obsolete from tabular datahub
    if (str == 'n/a') return false;
    var s = {};
    var lst = str.split(',');
    var err = false;
    for (var i = 0; i < lst.length; i++) {
        var t = lst[i].split(':');
        if (t.length != 2) {
            err = true;
            continue;
        }
        s[t[1]] = 1;
    }
    if (!obj.md) {
        obj.md = [];
    }
    obj.md[1] = s;
    return err;
}


function tkdefaultMode(o) {
    /* args: 1. tk obj, 2. native mdvidx2attr
     only for decors
     don't die when called upon hmtks
     */
    if (o.defaultmode != undefined) {
        if (typeof(o.defaultmode == 'string')) {
            return parse_tkmode(o.defaultmode);
        }
        return o.defaultmode;
    }
    switch (o.ft) {
        case FT_bed_c:
        case FT_bed_n:
        case FT_anno_n:
        case FT_anno_c:
            return M_full;
        case FT_qdecor_n:
        case FT_bigwighmtk_n:
        case FT_bigwighmtk_c:
        case FT_bedgraph_n:
        case FT_bedgraph_c:
        case FT_cat_n:
        case FT_cat_c:
        case FT_matplot:
        case FT_catmat:
        case FT_qcats:
        case FT_weaver_c:
            return M_show;
        case FT_lr_c:
        case FT_lr_n:
            return M_arc;
        case FT_sam_c:
        case FT_sam_n:
        case FT_bam_c:
        case FT_bam_n:
            return M_den;
        case FT_ld_c:
        case FT_ld_n:
            return M_trihm;
        case FT_cm_c:
            return M_show;
        default:
            print2console('unexpected ft: ' + o.ft, 2);
            return M_show;
    }
}

function parse_tkmode(mode) {
    if (mode == undefined) return [M_hide];
    if (typeof(mode) == 'string') {
        var m = decormodestr2num(mode);
        if (m == undefined) return [M_hide, 'Weird string value for track mode'];
        return [m];
    }
    if (typeof(mode) == 'number') {
        if (mode2str[mode]) return [mode];
        return [M_hide, 'Weird numerical value for track mode'];
    }
    return [M_hide, 'Value of track mode neither string nor digit'];
}

function parseHubtrack(obj) {
    /* a very centralized place to parse/validate hub track attributes
     works for both custom and native tracks
     do not handle cmtk member tracks, they were put in init_bbj_param.tklst already
     */

// showscoreidx needs to be validated first then it can be used to validate scorenamelst, scorescalelst
    for (var k1 in obj) {
        var k = k1.toLowerCase();
        var v = obj[k1];
        if (k == 'showscoreidx') {
            var n = parseInt(v);
            if (isNaN(n) || n < 0) {
                print2console('Invalid showscoreidx for track ' + obj.name, 2);
                obj.showscoreidx = 0;
            } else {
                obj.showscoreidx = n;
            }
        }
    }

// check the rest
    var tq = {}; // temp, to be appended as obj.qtc
    for (var k1 in obj) {

        var k = k1.toLowerCase();
        var v = obj[k1];
        var d = false;
        var err = null;
        var gray = 115; // gray color to apply to any error values
        var grayc = 'rgb(' + gray + ',' + gray + ',' + gray + ')';
        switch (k) {
            case 'color':
            // supposedly for the ruling color of query genome in weavertk, process into bedcolor
            case 'boxcolor':
                if (!isNaN(colorstr2int(v)[0])) {
                    tq.bedcolor = v;
                } else {
                    err = 'wrong value';
                    tq.bedcolor = grayc;
                }
                d = true;
                break;
            case 'strokecolor':
                if (!isNaN(colorstr2int(v)[0])) {
                    tq.strokecolor = v;
                } else {
                    err = 'wrong value';
                    tq.strokecolor = colorCentral.foreground;
                }
                d = true;
                break;
            case 'textcolor':
                if (!isNaN(colorstr2int(v)[0])) {
                    tq.textcolor = v;
                } else {
                    err = 'wrong value';
                    tq.textcolor = colorCentral.foreground;
                }
                d = true;
                break;
            case 'colorforward':
                if (!isNaN(colorstr2int(v)[0])) {
                    tq.forwardcolor = v;
                } else {
                    err = 'wrong value';
                    tq.forwardcolor = grayc;
                }
                d = true;
                break;
            case 'colorreverse':
                if (!isNaN(colorstr2int(v)[0])) {
                    tq.reversecolor = v;
                } else {
                    err = 'wrong value';
                    tq.reversecolor = grayc;
                }
                d = true;
                break;
            case 'colormismatch':
                if (!isNaN(colorstr2int(v)[0])) {
                    tq.mismatchcolor = v;
                } else {
                    err = 'wrong value';
                    tq.mismatchcolor = grayc;
                }
                d = true;
                break;
            case 'colorpositive':
                // color below threshold / beyond threshold
                var t = v.split('/');
                var c = colorstr2int(t[0]);
                if (!isNaN(c[0]) && !isNaN(c[1]) && !isNaN(c[2])) {
                    tq.pr = c[0];
                    tq.pg = c[1];
                    tq.pb = c[2];
                } else {
                    err = 'wrong value';
                    tq.pr = tq.pg = tq.pb = gray;
                }
                if (t[1]) {
                    c = colorstr2int(t[1]);
                    if (!isNaN(c[0]) && !isNaN(c[1]) && !isNaN(c[2])) {
                        tq.pth = 'rgb(' + c.join(',') + ')';
                    } else {
                        tq.pth = grayc;
                        err = 'wrong value';
                    }
                } else {
                    tq.pth = darkencolor(c, .3);
                }
                d = true;
                break;
            case 'colornegative':
                var t = v.split('/');
                var c = colorstr2int(t[0]);
                if (!isNaN(c[0]) && !isNaN(c[1]) && !isNaN(c[2])) {
                    tq.nr = c[0];
                    tq.ng = c[1];
                    tq.nb = c[2];
                } else {
                    err = 'wrong value';
                    tq.nr = tq.ng = tq.nb = gray;
                }
                if (t[1]) {
                    c = colorstr2int(t[1]);
                    if (!isNaN(c[0]) && !isNaN(c[1]) && !isNaN(c[2])) {
                        tq.nth = 'rgb(' + c.join(',') + ')';
                    } else {
                        err = 'wrong value';
                        tq.nth = grayc;
                    }
                } else {
                    tq.nth = darkencolor(c, .3);
                }
                d = true;
                break;
            case 'positivefilterthreshold':
                var v2 = parseFloat(v);
                if (!isNaN(v2) && v2 >= 0) {
                    tq.pfilterscore = v2;
                } else {
                    err = 'wrong value';
                    tq.pfilterscore = 0;
                }
                d = true;
                break;
            case 'negativefilterthreshold':
                var v2 = parseFloat(v);
                if (!isNaN(v2) && v2 <= 0) {
                    tq.nfilterscore = v2;
                } else {
                    err = 'wrong value';
                    tq.nfilterscore = 0;
                }
                d = true;
                break;
            case 'height':
                var n = parseInt(v);
                if (!isNaN(n)) {
                    tq.height = Math.max(10, n);
                } else {
                    err = 'wrong value';
                    tq.height = 15;
                }
                d = true;
                break;
            case 'summarymethod':
                var _s = v.toLowerCase();
                var _v = null;
                if (_s == 'average' || _s == 'mean') {
                    _v = summeth_mean;
                } else if (_s == 'max') {
                    _v = summeth_max;
                } else if (_s == 'min') {
                    _v = summeth_min;
                } else if (_s == 'total' || _s == 'sum') {
                    _v = summeth_sum;
                }
                if (_v == null) {
                    err = 'wrong value';
                    _v = summeth_mean;
                }
                tq.summeth = _v;
                d = true;
                break;
            case 'fixedscale':
                /* this will alter .qtc
                 but for hammock, also apply to .scorescalelst if that's not given
                 */
                if ('min' in v && typeof(v.min) == 'number') {
                    if ('max' in v && typeof(v.max) == 'number') {
                        tq.thtype = scale_fix;
                        tq.thmin = v.min;
                        tq.thmax = v.max;
                    } else {
                        tq.thtype = scale_auto;
                        tq.min_fixed = v.min;
                    }
                } else if ('max' in v && typeof(v.max) == 'number') {
                    tq.thtype = scale_auto;
                    tq.max_fixed = v.max;
                } else {
                    err = 'wrong value';
                }
                d = true;
                break;
            case 'barplot_bg':
                if (!isNaN(colorstr2int(v)[0])) {
                    tq.barplotbg = v;
                } else {
                    err = 'wrong value';
                    tq.barplotbg = grayc;
                }
                d = true;
                break;
            case 'backgroundcolor':
                if (!isNaN(colorstr2int(v)[0])) {
                    tq.bg = v;
                } else {
                    err = 'wrong value';
                }
                d = true;
                break;
            case 'smoothwindow':
                var n = parseInt(v);
                if (isNaN(n) || n < 3) {
                    err = 'wrong value';
                    tq.smooth = 5;
                } else {
                    if (n % 2 == 0) n++;
                    tq.smooth = n;
                }
                d = true;
                break;
            case 'scorenamelst':
                if (obj.showscoreidx == undefined) {
                    d = true;
                    err = 'showscoreidx is missing';
                } else if (!Array.isArray(v)) {
                    d = true;
                    err = 'scorenamelst value should be an array of strings';
                } else if (obj.showscoreidx >= v.length) {
                    d = true;
                    err = 'scorenamelst has wrong array size';
                }
                break;
            case 'scorescalelst':
                if (obj.showscoreidx == undefined) {
                    d = true;
                    err = 'showscoreidx is missing';
                } else if (!Array.isArray(v)) {
                    d = true;
                    err = 'scorescalelst value should be an array';
                } else if (obj.showscoreidx >= v.length) {
                    d = true;
                    err = 'scorescalelst has wrong array size';
                } else {
                    for (var i = 0; i < v.length; i++) {
                        if (v[i].type != scale_auto && v[i].type != scale_fix) {
                            err = 'scorescalelst item type value should be ' + scale_auto + ' (automatic scale) or ' + scale_fix + ' (fixed scale)';
                            v[i].type = scale_auto;
                        }
                        if (v[i].type == scale_fix) {
                            if (v[i].min == undefined || v[i].max == undefined) {
                                err = 'min or max value missing from scorescalelst item';
                                d = true;
                                break;
                            } else if (v[i].min >= v[i].max) {
                                err = 'scorescalelst item has wrong min/max values';
                            }
                        }
                    }
                }
                break;
            case 'horizontallines':
                var lst = [];
                for (var j = 0; j < v.length; j++) {
                    var a = v[j];
                    if ('value' in a && typeof(a.value) == 'number') {
                        if (!a.color) a.color = grayc;
                        lst.push(a);
                    } else {
                        err = 'Incorrect value setting';
                    }
                }
                if (lst.length > 0) {
                    obj.horizontallines = lst;
                } else {
                    d = true;
                }
                break;
            case 'defaultmode':
                var tmp = parse_tkmode(obj.defaultmode);
                if (tmp[1]) {
                    err = tmp[1];
                }
                if (tmp[0] != M_hide) {
                    obj.defaultmode = tmp[0];
                } else {
                    d = true;
                }
                break;
        }
        if (err) {
            var msg = 'Track error (' + obj.label + ') : at attribute "' + k + '", ' + err;
            print2console(msg, 2);
            alertbox_addmsg({text: msg});
        }
        if (d) {
            delete obj[k1];
        }
    }
// done looping, attach qtc

    if (!obj.qtc) {
        obj.qtc = {};
    }
    for (var k in tq) {
        obj.qtc[k] = tq[k];
    }
    if (obj.showscoreidx != undefined) {
        if (!obj.scorenamelst) {
            alertbox_addmsg({text: 'scorenamelst mising from track (' + obj.label + ')'});
            delete obj.showscoreidx;
        } else if (!obj.scorescalelst) {
            // fill in, also consider "fixedscale" setting
            obj.scorescalelst = [];
            for (var i = 0; i < obj.scorenamelst.length; i++) {
                if (tq.thtype == scale_fix) {
                    obj.scorescalelst.push({
                        type: scale_fix,
                        min: tq.thmin,
                        max: tq.thmax
                    });
                } else {
                    obj.scorescalelst.push({
                        type: scale_auto,
                        min_fixed: tq.min_fixed,
                        max_fixed: tq.max_fixed
                    });
                }
            }
        }
    }
    if (isNumerical(obj)) {
        if (!obj.qtc) {
            obj.qtc = {};
        }
        if (obj.qtc.thtype == undefined) {
            obj.qtc.thtype = scale_auto;
        }
    }
}


Browser.prototype.loaddatahub_ucsc = function (url) {
    var bbj = this;
    this.cloak();
    this.ajax('loaducschub=on&url=' + url, function (data) {
        bbj.loadhub_ucsc_cb(data, url);
    });
};
Browser.prototype.loadhub_ucsc_cb = function (data, url) {
    var hui = this.genome.custtk.ui_hub;
    hui.submit_butt.disabled = false;
    if (!data) {
        this.unveil();
        print2console('Failed to load this hub (' + url + ')', 2);
        return;
    }
    if (data.abort) {
        var m = 'Failed to load a UCSC hub: ' + data.abort + '<br>(' + url + ')';
        print2console(m, 2);
        alertbox_addmsg({text: m});
        this.ajax_loadbbjdata(this.init_bbj_param);
        return;
    }
    if (data.trackdbparsed) {
        if (data.acceptnum == 0) {
            var m = 'No tracks accepted from a UCSC hub (only bigWig and BAM are allowed at the moment)<br>(' + url + ')';
            print2console(m, 2);
            alertbox_addmsg({text: m});
            this.ajax_loadbbjdata(this.init_bbj_param);
        } else {
            // TODO make sure of tmp location t/
            var newurl = window.location.origin + window.location.pathname + 't/' + data.jsonfile;
            print2console(data.acceptnum + ' tracks parsed from the UCSC hub', 0);
            this.loadhub_urljson(newurl);
        }
        return;
    }
    if (!data.lst) {
        var m = 'genomesFile not found in UCSC hub (' + url + ')';
        print2console(m, 2);
        alertbox_addmsg({text: m});
        this.ajax_loadbbjdata(this.init_bbj_param);
        return;
    }
// find the right genome
    for (var i = 0; i < data.lst.length; i++) {
        var a = data.lst[i];
        var gn = a[0], url2 = a[1];
        if (gn == this.genome.name) {
            print2console('Loading the ' + gn + ' trackDb from UCSC hub...', 0);
            this.loaddatahub_ucsc(url2);
            return;
        }
    }
    var m = 'No ' + bbj.genome.name + ' trackDb file found in the UCSC hub.';
    print2console(m, 2);
    alertbox_addmsg({text: m});
    this.ajax_loadbbjdata(this.init_bbj_param);
};


/*** __hub__ ends ***/