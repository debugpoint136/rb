/**
 * @param obj
 */

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