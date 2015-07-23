/**
 * Created by dpuru on 2/27/15.
 */

/*** __base__ ***/

Browser.prototype.loadgenome_initbrowser = function (param) {
    /* to fill up a freshly-made browser scaffold with genome data
     if the genome is missing, load it first
     browser data content (tracks, mcm) can be customized by param
     args:
     - browserparam: arg of ajax_loadbbjdata()
     - genomeparam: arg for initiating genome obj
     the rest are ajax arg for loading genome
     */

    if (param.dbname in genome) {
        this.genome = genome[param.dbname];
        this.runmode_set2default();
        this.migratedatafromgenome();
        this.init_bbj_param = param.browserparam;
        this.ajax_loadbbjdata(param.browserparam);
        return;
    }

// genome is not there, load it first
    this.init_bbj_param = param.browserparam;
    var p = param.genomeparam;
    this.init_genome_param = p;
    this.onunknowngenome = param.onunknowngenome;
    /*** load genome info ***/
    var bbj = this;
    this.ajax('loadgenome=on&dbName=' + param.dbname + (param.serverload ? '&serverload=on' : ''), function (data) {
        bbj.loadgenome_gotdata(data);
    });
};

Browser.prototype.loadgenome_gotdata = function (data) {
    if (!data) {
        fatalError('Crashed when loading genome info!');
        return;
    }
    if (data.unknowngenomedb) {
        if (this.onunknowngenome) {
            this.onunknowngenome(data.unknowngenomedb);
        } else {
            alert('Unknown genome name: ' + data.unknowngenomedb);
        }
        return;
    }
    var genomeobj = new Genome(this.init_genome_param);
    genomeobj.jsonGenome(data);
    genome[genomeobj.name] = genomeobj;
    this.genome = genomeobj;
    if (apps.session) {
        this.show_sessionid();
    }
    this.runmode_set2default();
    this.migratedatafromgenome();
    if (data.trashDir) {
        gflag.trashDir = data.trashDir;
    }
    this.__jsonPageinit(data);
    print2console(this.genome.name + ' genome loaded', 1);
    this.ajax_loadbbjdata(this.init_bbj_param);
};

Browser.prototype.ajax_loadbbjdata = function (param) {
    /*** load all types of data ***
     fill data for a browser, do some proper setup
     genome object must already been built
     handles multiple triggers in iterative manner
     TODO .genome.defaultStuff.initmatplot should be handled somewhere else
     */
    if (!param) {
        // escape iteration
        this.shieldOff();
        loading_done();
        if (this.onloadend_once) {
            this.onloadend_once(this);
            delete this.onloadend_once;
        }
        return;
    }
    if (param.session) {
        var oldsession = param.session;
        delete this.init_bbj_param;
        var bbj = this;
        this.validatesession(oldsession, param.statusId, function (data) {
            bbj.initbrowser_session(data);
        });
        return;
    }
    if (param.defaultcontent) {
        delete param.defaultcontent;
        this.adddecorparam(this.genome.defaultStuff.decor);

        /* Copy the default co-ordinates say - coord: "chr7,27053398,chr7,27373766 "*/
        if (!param.coord_rawstring) {
            param.coord_rawstring = this.genome.defaultStuff.coord;
        }
        /*
         // no matplot, auto height adjustment about numerical tracks
         // only adjust height of bedgraph and bigwig, not cat
         var _lst=[];
         for(var i=0; i<bbj.tklst.length; i++) {
         var t=bbj.tklst[i];
         if(t.ft==FT_bigwighmtk_n||t.ft==FT_bedgraph_n) {
         _lst.push(t);
         }
         }
         var h2=parseInt((document.body.clientHeight-400)/_lst.length);
         if(h2<bbj.minTkheight) h2=bbj.minTkheight;
         else if(h2>max_initial_qtkheight) h2=max_initial_qtkheight;
         for(i=0; i<_lst.length; i++) _lst[i].qtc.height=h2;
         */
    }
    if (param.mcm_termlst) {
        if (this.weaver && this.weaver.iscotton) {
            // don't do it
        } else if (this.mcm) {
            var lst = [];
            for (var i = 0; i < param.mcm_termlst.length; i++) {
                var m1 = param.mcm_termlst[i];
                var isnew = true;
                for (var j = 0; j < this.mcm.lst.length; j++) {
                    var m2 = this.mcm.lst[j];
                    if (m2[1] == m1[1] && m2[0] == m1[0]) {
                        isnew = false;
                        break;
                    }
                }
                if (isnew) {
                    lst.push(m1);
                }
            }
            if (lst.length > 0) {
                this.mcm.lst = this.mcm.lst.concat(lst);
            }
        }
        delete param.mcm_termlst;
    }
    /* dsp
     only alter dsp when geneset is given, or .regionLst is empty!
     even if coord params are not given, dsp will also be set to default, good idea
     */
    if (param.gsvparam) {
        var p = param.gsvparam;
        if (p.viewrange) {
            this.run_gsv(p.list, p.viewrange);
        } else {
            this.run_gsv(p.list);
        }
        delete param.gsvparam;
        return;
    }
    if (param.geneset_rawstring) {
        var s = param.geneset_rawstring;
        if (!apps.gsm || !this.genome.geneset) {
            print2console('cannot process geneset: gene set function not available!', 2);
            delete param.geneset_rawstring;
            return;
        }
        apps.gsm.bbj = this;
        this.genome.geneset.textarea_submitnew.value = s.replace(/,/g, '\n');
        gflag.gs_load2gsv = true;
        addnewgeneset_pushbutt();
        // try add this gene set
        delete param.geneset_rawstring;
        return;
    } else if (param.coord_rawstring || param.juxtapose_rawstring || this.regionLst.length == 0) {
        if (this.genome.iscustom) {
            /* custom genome, avoid ajax
             decide dsp by js, duplicate task of cgi
             */
            var data = {}; // returned json obj
            // border
            var slst = this.genome.scaffold.current;
            data.border = [slst[0], 0, slst[slst.length - 1], this.genome.scaffold.len[slst[slst.length - 1]]];
            // regions
            data.regionLst = [];
            var c = this.defaultposition();
            var startchr = c[0], stopchr = c[2], startcoord = c[1], stopcoord = c[3];
            if (param.coord_rawstring) {
                var c = this.parseCoord_wildgoose(param.coord_rawstring, true);
                if (c.length == 3) {
                    startchr = stopchr = c[0];
                    startcoord = c[1];
                    stopcoord = c[2];
                } else if (c.length == 4) {
                    startchr = c[0];
                    startcoord = c[1];
                    stopchr = c[2];
                    stopcoord = c[3];
                }
                delete param.coord_rawstring;
            }
            var totallen = 0;
            var inuse = false;
            for (var i = 0; i < slst.length; i++) {
                var a = 0,
                    b = this.genome.scaffold.len[startchr];
                if (slst[i] == startchr) {
                    a = startcoord;
                    inuse = true;
                }
                if (slst[i] == stopchr) {
                    b = stopcoord;
                    inuse = true;
                }
                if (inuse) {
                    data.regionLst.push([slst[i], 0, this.genome.scaffold.len[slst[i]], a, b, this.hmSpan * 3, '']);
                    totallen += b - a;
                }
                if (slst[i] == stopchr) break;
                inuse = false;
            }
            // find view start!
            var j = 0;
            for (var i = 0; i < data.regionLst.length; i++) {
                var a = data.regionLst[i][3],
                    b = data.regionLst[i][4];
                if (j < totallen / 3 && j + b - a > totallen / 3) {
                    data.viewStart = [i, a + totallen / 3 - j];
                    break;
                }
                j += b - a;
            }
            data.tkdatalst = [];
            this.ajaxX_cb(data);
            return;
        }
        // given coord, or juxtaposition
        var c = this.defaultposition();
        var startchr = c[0], stopchr = c[2], startcoord = c[1], stopcoord = c[3];
        if (param.coord_rawstring) {
            var c = this.parseCoord_wildgoose(param.coord_rawstring, true);
            if (c.length == 3) {
                startchr = stopchr = c[0];
                startcoord = c[1];
                stopcoord = c[2];
            } else if (c.length == 4) {
                startchr = c[0];
                startcoord = c[1];
                stopchr = c[2];
                stopcoord = c[3];
            }
            delete param.coord_rawstring;
        }
        var paramstring = 'changeGF=on&dbName=' + this.genome.name + '&startChr=' + startchr + '&startCoord=' + startcoord + '&stopChr=' + stopchr + '&stopCoord=' + stopcoord;
        if (param.juxtapose_rawstring) {
            var bbf = param.juxtapose_rawstring;
            if (param.juxtaposecustom) {
                // custom bed
                this.juxtaposition.type = RM_jux_c;
                this.juxtaposition.note = "custom bed track";
                this.juxtaposition.what = bbf;
                paramstring += '&runmode=' + RM_jux_c + '&juxtaposeTk=' + bbf;
                print2console('Running juxtaposition...', 0);
                delete param.juxtaposecustom;
            } else {
                var tk = this.genome.decorInfo[bbf];
                if (tk) {
                    // native
                    this.juxtaposition.type = RM_jux_n;
                    this.juxtaposition.note = tk.label;
                    this.juxtaposition.what = bbf;
                    paramstring += '&runmode=' + RM_jux_n + '&juxtaposeTk=' + bbf;
                    print2console('Running juxtaposition...', 0);
                } else {
                    print2console('Not running juxtapose: unknown native bed/annotation track name', 2);
                    paramstring += '&runmode=' + this.genome.defaultStuff.runmode;
                }
            }
            delete param.juxtapose_rawstring;
        } else {
            paramstring += '&runmode=' + this.genome.defaultStuff.runmode;
        }
        print2console('Setting view range...', 0);
        this.ajaxX(paramstring, true);
        return;
    }
    /* tracks
     */
    if (param.mustaddcusttk) {
        // in effect for loading tracks
        this.mustaddcusttk = true;
        delete param.mustaddcusttk;
    }
    if (param.datahub_json) {
        // json file
        this.loadhub_urljson(param.datahub_json);
        delete param.datahub_json;
        return;
    }
    if (param.datahub_ucsc) {
        this.loaddatahub_ucsc(param.datahub_ucsc);
        delete param.datahub_ucsc;
        return;
    }
    if (param.publichubloadlst) {
        if (this.genome.publichub.lst.length == 0) {
            print2console('No public hub available for this genome!', 2);
            delete param.publichubloadlst;
        } else {
            if (param.publichubloadlst.length == 0) {
                delete param.publichubloadlst;
            } else {
                // load first hub in queue
                this.publichub_load(param.publichubloadlst.splice(0, 1));
                return;
            }
        }
    }
    if (param.hubjsoncontent) {
        var j = param.hubjsoncontent;
        delete param.hubjsoncontent;
        this.loaddatahub_json(j);
        return;
    }
    if (param.forceshowallhubtk) {
        delete param.forceshowallhubtk;
    }
    if (param.native_track) {
        /* native tracks with name-only, no ft, from urlparam
         valid items that are not displayed yet will be added to param.tklst
         */
        // guard against repetitive ones
        var n2t = {};
        for (var i = 0; i < param.native_track.length; i++) {
            var t = param.native_track[i];
            n2t[t.name] = t;
        }
        var _lst = [];
        for (var name in n2t) {
            if (this.findTrack(name)) continue;
            var t2 = this.genome.parse_native_track(n2t[name]);
            if (t2) {
                _lst.push(t);
            } else {
                print2console('Error parsing native track ' + name, 2);
            }
        }
        if (_lst.length > 0) {
            if (!param.tklst) param.tklst = [];
            param.tklst = param.tklst.concat(_lst);
        }
        delete param.native_track;
    }

    if (param.weaver_raw) {
        // only from urlparam
        if (!param.tklst) param.tklst = [];
        for (var i = 0; i < param.weaver_raw.length; i++) {
            var c = param.weaver_raw[i];
            if (c.query in gflag.tol_hash) {
                param.tklst.push({
                    ft: FT_weaver_c,
                    url: c.url,
                    mode: M_full,
                    cotton: c.query,
                    weaver: {mode: W_fine},
                    qtc: {stackheight: weavertkstackheight, bedcolor: weavertkcolor_query},
                    label: c.query + ' to ' + this.genome.name
                });
            } else {
                // do not support custom genome
                print2console('Unrecognized genome name for linking: ' + c.query, 2);
                print2console('If this is a custom-built genome, use datahub to submit this track and include "newgenome" attribute', 0);
            }
        }
        delete param.weaver_raw;
    }

    if (param.matplot) {
        // before getting data track, make display obj for matplot
        for (var i = 0; i < param.matplot.length; i++) {
            var t = param.matplot[i];
            this.genome.registerCustomtrack(t);
            this.tklst.push(this.makeTrackDisplayobj(t.name, FT_matplot));
        }
        delete param.matplot;
    }
    if (param.tklst) {
        /********** the only place to call ajax_addtracks
         only singular tracks, not compound ones (cmtk)
         - native or custom
         - duplication allowed
         - must all have ft
         - must all be data track, not composite
         */
        // remove redundancy
        var urlhash = {}; // cust
        var namehash = {}; // native
        for (var i = 0; i < param.tklst.length; i++) {
            var t = param.tklst[i];
            if (t.ft == FT_weaver_c) {
                /*********** the only place to add weavertk
                 the part of creating cottonbbj cannot be moved to ajax_addtracks
                 since it involves loading query genome and relies on ajax_loadbbjdata
                 */
                if (!t.cotton) fatalError('pending weavertk has no cotton');
                if (!this.weaver) {
                    this.weaver = {insert: [], q: {}, mode: W_rough};
                    this.weavertoggle(this.hmSpan * (this.entire.atbplevel ? 1 : this.entire.summarySize));
                }
                this.mcm_mayaddgenome();
                if (!t.weaver) {
                    t.weaver = {};
                }
                t.weaver.mode = this.weaver.mode;
                gflag.dspstat_showgenomename = true;
                if (!(t.cotton in this.weaver.q)) {
                    // load cottonbbj
                    var bbj = new Browser();
                    this.weaver.q[t.cotton] = bbj;
                    bbj.weaver = {insert: [], iscotton: true, target: this};
                    bbj.browser_makeDoms({
                        mainstyle: 'display:none;',
                        facet: true,
                    });

                    // dummy
                    if (bb) cc = bbj;
                    else bb = bbj;

                    var b2 = this;
                    bbj.onloadend_once = function () {
                        bbj.hmSpan = b2.hmSpan;
                        bbj.entire = b2.entire;
                        bbj.leftColumnWidth = b2.leftColumnWidth;
                        bbj.move = b2.move;
                        bbj.hmdiv = b2.hmdiv;
                        bbj.hmheaderdiv = b2.hmheaderdiv;
                        bbj.decordiv = b2.decordiv;
                        bbj.decorheaderdiv = b2.decorheaderdiv;
                        if (b2.mcm) {
                            bbj.mcm = b2.mcm;
                        }
                        b2.ajax_loadbbjdata(b2.init_bbj_param);
                    };

                    if (!(t.cotton in gflag.tol_hash)) {
                        if (t.newgenome) {
                            // create custom genome
                            if (!t.newgenome.scaffoldlength) fatalError('.newgenome.scaffoldlength missing');
                            if (!t.newgenome.defaultposition) fatalError('.newgenome.defaultposition missing');
                            var scf1 = [['ROOT', 'chromosome', 0]];
                            var scf2 = [];
                            for (var n in t.newgenome.scaffoldlength) {
                                scf2.push(n);
                                scf1.push(['chromosome', n, t.newgenome.scaffoldlength[n]]);
                            }
                            var g = new Genome({custom_track: true});
                            g.jsonGenome({
                                dbname: t.cotton,
                                scaffoldInfo: scf1,
                                defaultScaffold: scf2.join(','),
                                defaultPosition: t.newgenome.defaultposition,
                            });
                            if (t.newgenome.sequencefile) {
                                g.scaffold.fileurl = t.newgenome.sequencefile;
                            }
                            g.defaultStuff.runmode = RM_genome;
                            g.hmtk = {};
                            g.decorInfo = {};
                            g.iscustom = true;
                            genome[t.cotton] = g;
                        } else {
                            print2console('Unknow genome name: ' + t.cotton, 2);
                            print2console('If this is a custom-built genome, use datahub to submit this track and include "newgenome" attribute', 0);
                        }
                    }

                    bbj.loadgenome_initbrowser({
                        dbname: t.cotton,
                        browserparam: null,
                        genomeparam: {custom_track: true},
                    });
                    return;
                }
            }
            if (isCustom(t.ft)) {
                if (!t.url) {
                    print2console('URL-less custom track: (' + t.name + ', ' + t.label + ')', 2);
                    continue;
                }
                if (!this.mustaddcusttk) {
                    if (this.genome.tkurlInUse(t.url)) {
                        // XXXb
                        var f = false;
                        for (var j = 0; j < this.tklst.length; j++) {
                            if (this.tklst[j].url == t.url) {
                                f = true;
                                break;
                            }
                        }
                        if (f) {
                            continue;
                        }
                    }
                }
                // must check tk on display
                var skip = false;
                for (var j = 0; j < this.tklst.length; j++) {
                    if (t.url == this.tklst[j].url) {
                        skip = true;
                        break;
                    }
                }
                if (skip) {
                    continue;
                }
                if (t.name) {
                    /* name already provided, should be from golden
                     patch here
                     if registry obj already exist for this track
                     need to update qtc
                     since new track height could have been updated by other spins
                     */
                    var _o = this.genome.hmtk[t.name];
                    if (_o) {
                        if (t.qtc && t.qtc.height) {
                            if (!_o.qtc) {
                                _o.qtc = {};
                            }
                            _o.qtc.height = t.qtc.height;
                        }
                    }
                } else {
                    t.name = this.genome.newcustomtrackname();
                }
                urlhash[t.url] = t;
            } else {
                if (this.findTrack(t.name)) continue;
                namehash[t.name] = t;
            }
        }
        delete param.tklst;
        var lst = [];
        for (var u in urlhash) {
            var o = urlhash[u];
            this.genome.pending_custtkhash[o.name] = o;
            lst.push(o);
        }
        for (var n in namehash) {
            lst.push(namehash[n]);
        }
        if (lst.length > 0) {
            print2console('Loading <strong>' + lst.length + '</strong> tracks...', 0);
            this.ajax_addtracks(lst);
            return;
        }
    }
    if (param.cmtk) {
        var namelst = [];
        for (var i = 0; i < param.cmtk.length; i++) {
            var t = param.cmtk[i];
            this.genome.registerCustomtrack(t);
            var t2 = this.makeTrackDisplayobj(t.name, FT_cm_c);
            this.tklst.push(t2);
            namelst.push(t.name);
            if (t2.cotton) {
                if (this.weaver && this.weaver.iscotton) {
                    this.weaver.target.tklst.push(t2);
                }
            }
        }
        this.trackdom2holder();
        this.aftertkaddremove(namelst);
        delete param.cmtk;
    }
    if (param.show_linkagemap) {
        if (!this.genome.linkagegroup) {
            print2console('No linkage group data for this genome', 2);
        } else {
            menu_shutup();
            menu.relocate.style.display =
                menu.relocate.div1.style.display = 'block';
            menu.relocate.div2.style.display = 'none';
            gflag.browser = this;
            gflag.menu.bbj = this;
            var div = param.show_linkagemap_div;
            var pos = absolutePosition(div);
            toggle25();
            menu.style.display = 'block';
            menu.style.left = pos[0];
            menu.style.top = pos[1];
        }
        delete param.show_linkagemap;
        delete param.show_linkagemap_div;
    }

    if (param.newbrowserlst) {
        for (var i = 0; i < param.newbrowserlst.length; i++) {
            add_new_browser(param.newbrowserlst[i]);
        }
        delete param.newbrowserlst;
    }
    if (param.coord_notes) {
        if (!this.notes) {
            this.notes = [];
        }
        this.notes = this.notes.concat(param.coord_notes);
        delete param.coord_notes;
    }
    if (param.geneset_ripe) {
        if (this.genome.geneset) {
            this.genome.geneset.__pendinggs = this.genome.geneset.__pendinggs.concat(param.geneset_ripe);
            this.genome.addgeneset_recursive();
        }
        delete param.geneset_ripe;
    }
    if (param.askabouttrack) {
        delete param.askabouttrack;
        cloakPage();
        gflag.browser = this;
        var d = dom_create('div', document.body, 'position:absolute;z-index:100;');
        gflag.askabouttrack = d;
        dom_create('div', d, 'color:white;font-size:150%;padding-bottom:20px;text-align:center;').innerHTML =
            'The "' + this.genome.name + '" genome has been loaded.<br><br>' +
            'Would you like to go to ...';
        dom_create('div', d, 'display:inline-block;margin-right:20px;', {
            c: 'whitebar',
            t: '<span style="font-size:140%">C</span>USTOM tracks',
            clc: toggle7_2
        });
        if (this.genome.publichub.lst.length > 0) {
            dom_create('div', d, 'display:inline-block;margin-right:20px;', {
                c: 'whitebar',
                t: '<span style="font-size:140%">P</span>UBLIC hubs <span style="font-size:80%">(' + this.genome.publichub.lst.length + ' available)</span>',
                clc: toggle8_2
            });
        }
        dom_create('div', d, 'display:inline-block;', {
            c: 'whitebar',
            t: '<span style="font-size:140%">G</span>ENOME browser &#187;',
            clc: toggle9
        });
        panelFadein(d, window.innerWidth / 2 - 270, window.innerHeight / 2 - 100);
    }


    this.initiateMdcOnshowCanvas();
    this.prepareMcm();


    if (param.track_order) {
        // adjust order
        if (param.track_order.length > 0) {
            var newlst = [], used = {};
            for (var i = 0; i < param.track_order.length; i++) {
                var o = param.track_order[i];
                var t = this.findTrack(o.name,
                    (this.weaver && this.weaver.iscotton) ? this.genome.name : null);
                if (!t) {
                    print2console(this.genome.name + 'Missing track for reordering: ' + o.name, 2);
                } else {
                    t.where = o.where;
                    newlst.push(t);
                    used[t.name] = 1;
                }
            }
            for (i = 0; i < this.tklst.length; i++) {
                var t = this.tklst[i];
                if (!(t.name in used)) {
                    newlst.push(t);
                }
            }
            this.tklst = newlst;
            this.trackdom2holder();
        }
        delete param.track_order;
    }


    if (param.splinters) {
        /* birth place of splinters??
         this must be the last command to be processed, because it requires the trunk components to be made
         splinters is to be added in serial manner
         each time trunk will be shrinked, very inefficient
         */
        var lst = [];
        for (var i = 0; i < param.splinters.length; i++) {
            var str = param.splinters[i];
            if (str == 'nocoord_fromapp') {
                lst.push({});
            } else {
                var c = this.genome.parseCoordinate(str, 2);
                if (!c) {
                    print2console('Invalid coordinate for adding secondary panel', 2);
                } else {
                    if (c[0] == c[2]) {
                        lst.push({coord: c[0] + ':' + c[1] + '-' + c[3]});
                    }
                }
            }
        }
        delete param.splinters;
        if (lst.length > 0) {
            this.splinter_pending = lst;
            // get new hmspan for everybody
            var newhm = 0, shm = 500;
            if (this.hmSpan > shm * (lst.length + 1)) {
                newhm = this.hmSpan - shm * lst.length;
            } else {
                shm = 400;
                if (this.hmSpan > shm * (lst.length + 1)) {
                    newhm = this.hmSpan - shm * lst.length;
                }
            }
            for (var i = 0; i < lst.length; i++) {
                lst[i].width = shm;
            }
            if (newhm) {
                // will shrink trunk
                if (this.scalebar) {
                    // move scale bar
                    var s = this.scalebar;
                    var newleft = newhm / 2 - 25;
                    s.slider.style.left = newleft;
                    s.says.style.left = newleft - s.says.clientWidth - 3;
                    s.arrow.style.left = newleft + 45;
                    s.slider.width = 50;
                    scalebarbeam.style.left = newleft + this.leftColumnWidth;
                    this.drawScalebarSlider();
                }
                // ajax
                this.sethmspan_refresh(newhm);
                return;
            }
        }
    }
    if (this.splinter_pending) {
        if (this.splinter_pending.length > 0) {
            print2console('Adding a secondary panel...', 0);
            var bbj = this;
            this.splinter_recursive(function () {
                bbj.ajax_loadbbjdata(bbj.init_bbj_param);
            });
            return;
        }
        delete this.splinter_pending;
    }


    this.render_browser(false);
    this.generateTrackselectionLayout();

    print2console('Stand by', 1);
    loading_done();

// a patch
    var c = this.genome.custtk;
    if (c) {
        var b = c.ui_hub.submit_butt;
        if (b.disabled) {
            b.disabled = false;
            flip_panel(c.buttdiv, c.ui_submit, false);
            apps.custtk.main.__hbutt2.style.display = 'none';
        }
    }
    this.shieldOff();
    if (this.onloadend_once) {
        this.onloadend_once(this);
        delete this.onloadend_once;
    }

    if (this.weaver && this.weaver.iscotton) {
        // cottonbbj may have added tracks, have been squeezed into target, need to redo mcm
        var target = this.weaver.target;
        if (target.mcm) {
            if (!target.mcm.manuallysorted) {
                // sort against genome
                var mhi = target.mcm_mayaddgenome();
                if (mhi != undefined) {
                    target.mcm.sortidx = mhi;
                    target.mcm_sort();
                }
            }
            target.prepareMcm();
            target.drawMcm();
        }
    }

    if (gflag.tol_hash) {
        var o = gflag.tol_hash[this.genome.name];
        if (o && o.snp) {
            this.genome.snptable = o.snp;
        }
    }

    delete this.init_bbj_param;
};


function trackParam(_tklst, nocotton) {
    /* nocotton: no cottontk
     noweavertk: no FT_weaver_c, use when weaving is disabled at large view range
     */
    var lst = [];
    lst[FT_bedgraph_c] = [];
    lst[FT_bedgraph_n] = [];
    lst[FT_bigwighmtk_c] = [];
    lst[FT_bigwighmtk_n] = [];
    lst[FT_bam_n] = [];
    lst[FT_bam_c] = [];
    lst[FT_sam_n] = [];
    lst[FT_sam_c] = [];
    lst[FT_bed_n] = [];
    lst[FT_bed_c] = [];
    lst[FT_cat_c] = [];
    lst[FT_cat_n] = [];
    lst[FT_lr_n] = [];
    lst[FT_lr_c] = [];
    lst[FT_qdecor_n] = [];
    lst[FT_weaver_c] = [];
    lst[FT_ld_c] = [];
    lst[FT_ld_n] = [];
    lst[FT_anno_n] = [];
    lst[FT_anno_c] = [];
    lst[FT_catmat] = [];
    lst[FT_qcats] = [];
    for (var i = 0; i < _tklst.length; i++) {
        var t = _tklst[i];
        if (nocotton && t.cotton && t.ft != FT_weaver_c) {
            continue;
        }
        var name = t.name;
        var mode = t.mode;
        var url = t.url;
        var label = t.label;
        var summ = (!t.qtc || t.qtc.summeth == undefined) ? summeth_mean : t.qtc.summeth;
        switch (t.ft) {
            case FT_bedgraph_c:
                lst[FT_bedgraph_c].push(name + ',' + label + ',' + url + ',' + mode + ',' + summ);
                break;
            case FT_bedgraph_n:
                lst[FT_bedgraph_n].push(name + ',' + url + ',' + mode + ',' + summ);
                break;
            case FT_bigwighmtk_c:
                lst[FT_bigwighmtk_c].push(name + ',' + label + ',' + url + ',' + mode + ',' + summ);
                break;
            case FT_bigwighmtk_n:
                lst[FT_bigwighmtk_n].push(name + ',' + url + ',' + mode + ',' + summ);
                break;
            case FT_cat_n:
                lst[FT_cat_n].push(name + ',' + url + ',' + mode);
                break;
            case FT_cat_c:
                lst[FT_cat_c].push(name + ',' + label + ',' + url + ',' + mode);
                break;
            case FT_bed_n:
                lst[FT_bed_n].push(name + ',' + url + ',' + mode);
                break;
            case FT_bed_c:
                lst[FT_bed_c].push(name + ',' + label + ',' + url + ',' + mode);
                break;
            case FT_bam_n:
                lst[FT_bam_n].push(name + ',' + url + ',' + mode);
                break;
            case FT_bam_c:
                lst[FT_bam_c].push(name + ',' + label + ',' + url + ',' + mode);
                break;
            case FT_lr_n:
                lst[FT_lr_n].push(name + ',' + url + ',' + mode + ',' + t.qtc.pfilterscore + ',' + t.qtc.nfilterscore);
                break;
            case FT_lr_c:
                lst[FT_lr_c].push(name + ',' + label + ',' + url + ',' + mode + ',' + t.qtc.pfilterscore + ',' + t.qtc.nfilterscore);
                break;
            case FT_ld_c:
                lst[FT_ld_c].push(name + ',' + label + ',' + url);
                break;
            case FT_ld_n:
                lst[FT_ld_n].push(name + ',' + url);
                break;
            case FT_matplot:
                break;
            case FT_cm_c:
                break;
            case FT_anno_n:
                lst[FT_anno_n].push(name + ',' + url + ',' + mode);
                break;
            case FT_anno_c:
                lst[FT_anno_c].push(name + ',' + label + ',' + url + ',' + mode);
                break;
            case FT_catmat:
                lst[FT_catmat].push(name + ',' + label + ',' + url + ',' + mode);
                break;
            case FT_qcats:
                lst[FT_qcats].push(name + ',' + label + ',' + url + ',' + mode);
                break;
            case FT_weaver_c:
                lst[FT_weaver_c].push(name + ',' + label + ',' + url + ',' + t.weaver.mode);
                break;
            default:
                fatalError('trackParam: unknown ft ' + t.ft);
        }
    }
    return '' +
        (lst[FT_bedgraph_n].length > 0 ? '&hmtk2=' + lst[FT_bedgraph_n].join(',') : '') +
        (lst[FT_bedgraph_c].length > 0 ? '&hmtk3=' + lst[FT_bedgraph_c].join(",") : '') +
        (lst[FT_bigwighmtk_n].length > 0 ? '&hmtk14=' + lst[FT_bigwighmtk_n].join(',') : '') +
        (lst[FT_bigwighmtk_c].length > 0 ? '&hmtk15=' + lst[FT_bigwighmtk_c].join(',') : '') +
        (lst[FT_cat_n].length > 0 ? '&hmtk12=' + lst[FT_cat_n].join(',') : '') +
        (lst[FT_cat_c].length > 0 ? '&hmtk13=' + lst[FT_cat_c].join(",") : '') +
        (lst[FT_bed_n].length > 0 ? '&decor0=' + lst[FT_bed_n].join(',') : '') +
        (lst[FT_bed_c].length > 0 ? '&decor1=' + lst[FT_bed_c].join(',') : '') +
        (lst[FT_lr_n].length > 0 ? '&decor9=' + lst[FT_lr_n].join(',') : '') +
        (lst[FT_lr_c].length > 0 ? '&decor10=' + lst[FT_lr_c].join(',') : '') +
        (lst[FT_qdecor_n].length > 0 ? '&decor8=' + lst[FT_qdecor_n].join(',') : '') +
        (lst[FT_sam_n].length > 0 ? '&decor4=' + lst[FT_sam_n].join(',') : '') +
        (lst[FT_sam_c].length > 0 ? '&decor5=' + lst[FT_sam_c].join(',') : '') +
        (lst[FT_bam_n].length > 0 ? '&decor17=' + lst[FT_bam_n].join(',') : '') +
        (lst[FT_bam_c].length > 0 ? '&decor18=' + lst[FT_bam_c].join(',') : '') +
        (lst[FT_ld_c].length > 0 ? '&track23=' + lst[FT_ld_c].join(',') : '') +
        (lst[FT_ld_n].length > 0 ? '&track26=' + lst[FT_ld_n].join(',') : '') +
        (lst[FT_weaver_c].length > 0 ? '&track21=' + lst[FT_weaver_c].join(',') : '') +
        (lst[FT_anno_n].length > 0 ? '&track24=' + lst[FT_anno_n].join(',') : '') +
        (lst[FT_anno_c].length > 0 ? '&track25=' + lst[FT_anno_c].join(',') : '') +
        (lst[FT_catmat].length > 0 ? '&track20=' + lst[FT_catmat].join(',') : '') +
        (lst[FT_qcats].length > 0 ? '&track27=' + lst[FT_qcats].join(',') : '');
}


Browser.prototype.houseParam = function () {
    /* house keeping
     */
    if (this.weaver) {
        return trackParam(this.tklst, this.weaver.iscotton ? false : true) +
            '&dbName=' + this.genome.name +
            this.genome.customgenomeparam();
    }
    return trackParam(this.tklst) + '&dbName=' + this.genome.name + this.genome.customgenomeparam();
};
Browser.prototype.htestParams = function () {
    if (!this.htest.inuse) return '';
    var lst = [];
    for (var i = 1; i <= this.htest.grpnum; i++) {
        lst.push("&htestgrp" + i + "=" + this.htest["gtn" + i].join(","));
    }
    var v = getSelectValueById("htestc"); // correction
    return "&htest=on&htestgrpnum=" + this.htest.grpnum + lst.join("") + (v == "no" ? "" : "&htestc=" + v);
};
Browser.prototype.corrParam = function () {
    /* if doing inter-track correlation, no need to interact with CGI,
     and will return empty string
     */
    if (!this.correlation.inuse) return "";
    var tname = this.correlation.targetname;
    var obj = this.findtkobj_display(tname);
    switch (this.correlation.targetft) {
        case FT_bed_n: // bigbed
            if (obj != null && obj.mode == M_den)
                return "";
            return "&corrft=0&correlation=" + tname;
        case FT_bed_n: // bigbed (c)
            if (obj != null && obj.mode == M_den)
                return "";
            return "&corrft=1&correlation=" + obj.url;
        case FT_bedgraph_c:
        case FT_bedgraph_n:
        case FT_bigwighmtk_c:
        case FT_bigwighmtk_n:
            return "";
        case FT_qdecor_n:
            // decor
            if (obj != null)
                return "";
            return "&corrft=8&correlation=" + tname;
        default:
            fatalError("corrParam: unknown file type");
    }
};

Browser.prototype.ajaxX = function (param, norendering) {
    /* special treatmet for following conditions
     - jumping to a gene but got multiple hits
     - gsv itemlist updating
     - generate a splinter
     */
    gflag.bbj_x_updating[this.horcrux] = 1;
    if (this.main) {
        // cottonbbj mainless
        this.shieldOn();
    }
    var bbj = this;
    this.ajax(param + this.houseParam(), function (data) {
        bbj.ajaxX_cb(data, norendering);
    });
};

Browser.prototype.ajaxX_cb = function (data, norendering) {
    delete gflag.bbj_x_updating[this.horcrux];
    this.shieldOff();
    if (!data) {
        print2console('Crashed upon ajaxX', 3);
        return;
    }
    if (data.abort) {
        print2console(data.abort, 3);
    } else {
        if (this.__pending_coord_hl) {
            this.highlight_regions[0] = this.__pending_coord_hl;
            delete this.__pending_coord_hl;
        }
        menu_hide();
        menu2.style.display = 'none';
        if (data.newscaffold) {
            this.ajax_scfdruntimesync();
        }
        this.jsonDsp(data);
        this.jsonTrackdata(data);
        this.move.direction = null;
        if (this.is_gsv() && data.ajaxXtrigger_gsvupdate) {
            /* gsv updating existing list
             always loses original dsp info
             returned regionLst always contains updated itemlist
             */
            if (data.entirelst == undefined || data.entirelst.length == 0) fatalError('gsv update: entirelst missing');
            this.genesetview.lst = data.entirelst;
            this.drawNavigator();
        }
        if (this.onupdatex) {
            this.onupdatex(this);
        }
        if (this.animate_zoom_stat == 1) {
            /* browser shows the animated zoom effect
             now tk data is ready, quit, browser render will be done once animation is over
             */
            this.animate_zoom_stat = 0;
            return;
        }
        if (!norendering) {
            this.drawRuler_browser(false);
            this.drawTrack_browser_all();
            this.drawIdeogram_browser(false);
        }
    }
    this.ajax_loadbbjdata(this.init_bbj_param);
};


function genelist2selectiontable(genelst, table, callback) {
    stripChild(table, 0);
    var total = 0;
    for (var i = 0; i < genelst.length; i++) {
        total += genelst[i].lst.length;
    }
    var showlimit = 30;
    var showcount = Math.min(total, showlimit);
    if (showcount < total) {
        var tr = table.insertRow(0);
        var td = tr.insertCell(0);
        td.colSpan = 4;
        td.align = 'center';
        td.innerHTML = 'Showing first ' + showlimit + ' genes, ' + (total - showcount) + ' not shown';
    }
// hardcoded genename, put xeno genes to bottom
    var L1 = [], L2 = [];
    for (var i = 0; i < genelst.length; i++) {
        for (var j = 0; j < genelst[i].lst.length; j++) {
            var g = genelst[i].lst[j];
            if (g.type && g.type.toLowerCase() == 'xenorefgene') {
                L2.push(g);
            } else {
                L1.push(g);
            }
        }
    }
    genelst = L1.concat(L2);
// see if genes are in same chr, if so, use better graphic
    var chr = genelst[0].c;
    var insamechr = true;
    for (var i = 1; i < showcount; i++) {
        if (genelst[i].c != chr) {
            insamechr = false;
            break;
        }
    }

    var w = 200, h = 11; // canvas size
    if (insamechr) {
        // get left/right most coord
        var start = genelst[0].a, stop = genelst[0].b;
        for (i = 1; i < showcount; i++) {
            start = Math.min(start, genelst[i].a);
            stop = Math.max(stop, genelst[i].b);
        }
        var sf = w / (stop - start);
        // first row is header
        var tr = table.insertRow(-1);
        var td = tr.insertCell(0);
        td.align = 'center';
        td.innerHTML = chr;
        var td = tr.insertCell(-1);
        var c = dom_create('canvas', td);
        c.width = w;
        c.height = 10;
        var ctx = c.getContext('2d');
        ctx.fillStyle = colorCentral.foreground;
        ctx.fillRect(0, 0, 1, 10);
        ctx.fillRect(w - 1, 0, 1, 10);
        ctx.fillRect(0, 9, w, 1);
        ctx.fillText(start, 3, 8);
        var w2 = ctx.measureText(stop.toString()).width;
        ctx.fillText(stop, w - w2 - 3, 8);
        tr.insertCell(-1);
        tr.insertCell(-1);
        for (i = 0; i < showcount; i++) {
            var g = genelst[i];
            var tr = table.insertRow(-1);
            tr.className = 'clb_o';
            tr.onclick = callback(g);
            tr.addEventListener('click', callback, false);
            tr.idx = i;
            var td = tr.insertCell(0);
            td.align = 'right';
            td.innerHTML = g.type;
            td = tr.insertCell(-1);
            var c = dom_create('canvas', td);
            c.width = w;
            c.height = h;
            var ctx = c.getContext('2d');
            plotGene(ctx, '#956584', 'white',
                {start: g.a, stop: g.b, strand: g.strand, struct: g.struct},
                (g.a - start) * sf,
                0,
                sf * (g.b - g.a),
                h,
                g.a, g.b, false);
            td = tr.insertCell(-1);
            td.innerHTML = g.a + '-' + g.b;
            if (g.desc) {
                td = tr.insertCell(-1);
                td.style.fontSize = 10;
                td.innerHTML = g.desc.length > 100 ? (g.desc.substr(0, 100) + '...') : g.desc;
            }
        }
    } else {
        // get max width of these genes for plotting
        var maxbp = 0;
        for (var i = 0; i < showcount; i++) {
            maxbp = Math.max(maxbp, genelst[i].b - genelst[i].a);
        }
        var sf = w / maxbp;
        for (i = 0; i < showcount; i++) {
            var g = genelst[i];
            var tr = table.insertRow(-1);
            tr.className = 'clb_o';
            tr.onclick = callback(g);
            tr.idx = i;
            var td = tr.insertCell(0);
            td.align = 'right';
            td.innerHTML = g.type;
            td = tr.insertCell(-1);
            var c = dom_create('canvas', td);
            c.width = w;
            c.height = h;
            var ctx = c.getContext('2d');
            plotGene(ctx, '#956584', 'white',
                {start: g.a, stop: g.b, strand: g.strand, struct: g.struct},
                0, 0, sf * (g.b - g.a), h, g.a, g.b, false);
            td = tr.insertCell(-1);
            td.innerHTML = g.c + ':' + g.a + '-' + g.b;
            if (g.desc) {
                td = tr.insertCell(-1);
                td.innerHTML = g.desc.length > 100 ? (g.desc.substr(0, 100) + '...') : g.desc;
            }
        }
    }
}

Browser.prototype.tkpanelheight = function () {
    return this.hmdiv.clientHeight + this.ideogram.canvas.height + this.decordiv.clientHeight;
};

Browser.prototype.migratedatafromgenome = function () {
    /* migrate data from genome to browser, no ajax
     genome must be already built
     supposed to be called after genome object is built
     */
    if (this.genome.geneset) {
        this.genome.geneset.textarea_submitnew.value = this.genome.defaultStuff.gsvlst;
    }
    if (apps.scp && apps.scp.textarea) {
        apps.scp.textarea.value = this.genome.defaultStuff.gsvlst;
    }
};

Browser.prototype.cleanuphtmlholder = function () {
    /* do this before restoring status or changing genome */
// gene set
    if (this.genome.geneset) {
        stripChild(this.genome.geneset.lstdiv, 0);
    }
// hmtk
    for (var n in this.genome.hmtk) {
        var t = this.genome.hmtk[n];
        if (t.public) continue;
        if (isCustom(this.genome.hmtk[n].ft)) {
            delete this.genome.hmtk[n];
        }
    }
    this.tklst = [];
    if (this.hmheaderdiv) {
        stripChild(this.hmheaderdiv, 0);
    }
    stripChild(this.hmdiv, 0);
//stripChild(this.pwc.grp1, 0);
//stripChild(this.pwc.grp2, 0);
    this.pwc.gtn1 = [];
    this.pwc.gtn2 = [];

    this.genome.custtk.names = [];

// decor
    stripChild(this.decordiv, 0);
    if (this.decorheaderdiv) {
        stripChild(this.decorheaderdiv, 0);
    }

// mcm
    if (this.mcm) {
        this.mcm.lst = [];
        stripChild(this.mcm.holder.firstChild.firstChild, 0);
        stripChild(this.mcm.tkholder, 0);
    }

// session
    apps.session.url_holder.style.display = 'none';

// splinters
    this.splinters = {};
    stripChild(this.splinterHolder.firstChild.firstChild, 0);
    this.init_hmSpan();
    this.applyHmspan2holders();

// misc
    this.notes = [];

    /* bev cleanup
     var lst = document.getElementById("bev_dataregistry").firstChild.childNodes;
     for(var i=0; i<lst.length; i++)
     delete bev.data[lst[i].vectorname];
     stripChild(document.getElementById("bev_dataregistry").firstChild, 0);
     for(var cn in bev.genomeCanvasTd)
     stripChild(bev.genomeCanvasTd[cn], 0);
     */
    this.turnoffJuxtapose(false);
};

function browser_table_mover(event) {
    /* must not use onmouseover=function(){gflag.browser=bbj;}
     since that will make splinters unreachable
     */
    var d = event.target;
    while (!d.ismaintable) d = d.parentNode;
    gflag.browser = d.bbj;
}

Browser.prototype.browser_makeDoms = function (param) {
    /* leftColumnWidth must be set prior to this
     */
    this.minTkheight = param.mintkheight ? param.mintkheight : 10;
    if (param.centralholder) {
        // cottonbbj has no visible main
        param.centralholder.style.position = 'relative';
        stripChild(param.centralholder, 0);
    }
    var o_test = false;
    var table = dom_create('table', param.centralholder, param.mainstyle);
    table.cellPadding = table.cellSpacing = 0;

    var bbj = this;
    /* must not use onmouseover=function(){gflag.browser=bbj;}
     since that will make splinters unreachable
     */
    table.ismaintable = true;
    table.onmouseover = browser_table_mover;
    table.horcrux = this.horcrux;
    table.bbj = this;
    this.main = table;
    /***** row 1 ******/
    var tr = table.insertRow(0);
    var td = tr.insertCell(0); // 1
    td.colSpan = 4; // for the splinter holder
    if (param.header) {
        this.header = {};
        td.vAlign = 'top';
        td.align = 'center';
        td.style.color = param.header.fontcolor ? param.header.fontcolor : colorCentral.foreground_faint_5;
        td.style.whiteSpace = 'nowrap';
        td.style.fontSize = param.header.fontsize;
        if (param.header.bg) td.style.backgroundColor = param.header.bg;
        if (param.header.height) td.style.height = param.header.height;
        if (param.header.padding) td.style.padding = param.header.padding;

        // navigation buttons
        var dspbutt = null;
        if (param.header.dspstat) {
            var u = param.header.dspstat.allowupdate;
            dspbutt = {
                text: '<span style="background-color:#545454;color:white;padding:5px;">LOADING...</span>',
                attr: {allowupdate: u},
                call: function (e) {
                    bbj.clicknavibutt({d: e.target});
                }
            };
            if (!u) {
                // no updating butt
                dspbutt.text = 'position';
            }
        }
        var buttlst = [];
        if (dspbutt) {
            buttlst.push(dspbutt);
        }
        buttlst.push({text: '&#10010;', pad: true, call: browser_zoomin, attr: {fold: 2, title: 'zoom in 1 fold'}});
        for (var i = 0; i < param.header.zoomout.length; i++) {
            var v = param.header.zoomout[i];
            buttlst.push({
                text: '&#9473;' + (param.header.zoomout.length == 1 ? '' : v[0]), pad: true,
                call: browser_zoomout,
                attr: {fold: v[1], title: 'zoom out ' + v[1] + ' fold'}
            });
        }
        buttlst.push({
            text: '&#9664;', call: browser_pan,
            attr: {direction: 'l', fold: 1, title: 'pan left'}
        });
        buttlst.push({
            text: '&#9654;', call: browser_pan,
            attr: {direction: 'r', fold: 1, title: 'pan right'}
        });
        this.header_naviholder = dom_addrowbutt(td, buttlst, undefined, colorCentral.background_faint_5);
        if (!this.trunk) {
            this.header_naviholder.style.zoom = 1.2;
        }
        if (dspbutt) {
            var b = this.header_naviholder.firstChild.firstChild.firstChild;
            this.header_dspstat = b;
            if (param.header.dspstat.tinyfont) {
                b.style.fontSize = param.header.dspstat.tinyfont;
            }
        }

        if (param.header.resolution) {
            var s = dom_addtext(td);
            this.header_resolution = s;
            s.style.margin = '0px 10px';
        }

        if (param.header.utils) {
            var blst = [];
            if (param.header.utils.track) {
                blst.push({text: 'Tracks', pad: true, call: grandaddtracks,});
                if (param.header.utils.track.no_publichub) {
                    this.header.no_publichub = true;
                }
                if (param.header.utils.track.no_custtk) {
                    this.header.no_custtk = true;
                }
                if (param.header.utils.track.no_number) {
                    this.header.no_number = true;
                }
            }
            if (param.header.utils.apps) {
                blst.push({text: 'Apps', pad: true, call: launchappPanel});
            }
            if (param.header.utils.print) {
                blst.push({text: '&#9113;', pad: true, call: param.header.utils.print});
            }
            if (param.header.utils.link) {
                blst.push({text: '&#8689;', pad: true, call: param.header.utils.link});
            }
            if (param.header.utils.bbjconfig) {
                blst.push({text: '&#9881;', pad: true, call: menu_bbjconfig_show});
            }
            if (param.header.utils.delete) {
                blst.push({text: '&#10005;', pad: true, call: param.header.utils.delete});
            }
            this.header_utilsholder = dom_addrowbutt(td, blst, 'margin-left:20px;', colorCentral.background_faint_5);
            if (!this.trunk) {
                this.header_utilsholder.style.zoom = 1.2;
            }
        }
    }
    /***** row 2 ******/
    tr = table.insertRow(-1);
    td = tr.insertCell(0); // 2-1
    if (o_test) td.innerHTML = 2;
    td = tr.insertCell(-1); // 2-2,3
    td.colSpan = 2;
    if (param.navigator) {
        var c = dom_create('canvas', td);
        c.className = 'opaque5';
        c.width = this.hmSpan;
        c.height = 0;
        this.navigator.canvas = c;
        this.navigator.show_ruler = param.navigator_ruler;
        c.addEventListener('mousemove', navigator_tooltip, false);
        c.addEventListener('mouseout', pica_hide, false);
        c.addEventListener('mousedown', navigatorMD, false);
    } else {
        this.navigator = null;
    }
    td = tr.insertCell(-1); // 2-4
    /***** row 3 ******/
    tr = table.insertRow(-1);
    td = tr.insertCell(0); // 3-1
    if (o_test) td.innerHTML = 3;
    td = tr.insertCell(1); // 3-2
    td.vAlign = 'bottom';
    if (param.ghm_scale) {
        var d = dom_create('div', td);
        d.style.height = browser_scalebar_height;
        d.style.position = 'relative';
        this.scalebar.holder = d;
        var d2 = dom_create('div', d);
        d2.style.position = 'absolute';
        d2.style.bottom = 0;
        d2.style.left = 352;
        d2.style.cursor = 'default';
        d2.innerHTML = '80mpg';
        d2.addEventListener('mousedown', scalebarSliderMD, false);
        this.scalebar.says = d2;
        var c = dom_create('canvas', d);
        c.style.display = 'block';
        c.style.position = 'absolute';
        c.style.left = 400;
        c.style.bottom = 0;
        c.width = 20;
        c.height = 16;
        c.addEventListener('mousedown', scalebarSliderMD, false);
        c.addEventListener('mouseover', scalebarMover, false);
        c.addEventListener('mouseout', scalebarMout, false);
        this.scalebar.slider = c;
        {
            var ctx = c.getContext('2d');
            ctx.fillStyle = 'black';
            ctx.fillRect(0, 3, 1, c.height - 5);
            ctx.fillRect(0, 8, c.width, 1);
        }
        c = dom_create('canvas', d);
        c.style.display = 'block';
        c.style.position = 'absolute';
        c.style.bottom = 0;
        c.style.left = 413;
        c.width = 20;
        c.height = 16;
        c.addEventListener('mousedown', scalebarArrowMD, false);
        c.addEventListener('mouseover', scalebarMover, false);
        c.addEventListener('mouseout', scalebarMout, false);
        this.scalebar.arrow = c;
        this.drawScalebarSlider();
        this.scalebararrowStroke();
    } else {
        this.scalebar = null;
    }
    if (param.ghm_ruler) {
        var d = dom_create('div', td);
        d.className = 'scholder';
        d.style.height = 20;
        var c = dom_create('canvas', d);
        c.height = 0;
        c.width = this.hmSpan;
        c.style.position = 'absolute';
        c.onmousedown = zoomin_MD;
        c.onmousemove = browser_ruler_mover;
        c.onmouseout = pica_hide;
        this.rulercanvas = c;
    } else {
        this.rulercanvas = null;
    }
    td = tr.insertCell(-1); // 3-3 the splinter holder!!
    td.rowSpan = 7;
    td.vAlign = 'top';
    if (!param.no_splinters) {
        var stb = dom_create('table', td);
        stb.cellSpacing = stb.cellPadding = 0;
        stb.insertRow(0);
        this.splinterHolder = stb;
    }
    td = tr.insertCell(-1); // 3-4
    if (param.mcm) {
        td.vAlign = 'bottom';
        this.mcm.headerholder_top = dom_create('div', td, 'position:relative');
    }
    /***** row 4 ******/
    tr = table.insertRow(-1);
    td = tr.insertCell(0); // 4-1
    if (o_test) td.innerHTML = 4;
    if (param.tkheader) {
        td.vAlign = 'top';
        this.hmheaderdiv = td;
    } else {
        this.hmheaderdiv = null;
    }
    td = tr.insertCell(-1); // 4-2
    td.vAlign = 'top';
    var d = dom_create('div', td);
    d.className = 'scholder';
    var d2 = dom_create('div', d);
    d2.style.position = 'absolute';
    d2.style.backgroundColor = param.hmdivbg;
    d2.addEventListener('mousedown', viewboxMD, false);
    d.appendChild(d2);
    this.hmdiv = d2;
// there's no 4-3
    td = tr.insertCell(-1); // 4-4
    if (param.mcm) {
        this.mcm.tkholder = td;
        var t = dom_create('table');
        t.horcrux = this.horcrux;
        t.addEventListener('mouseover', mcmheader_mover, false);
        this.mcm.holder = t;
        t.cellPadding = t.cellSpacing = 0;
        t.insertRow(0);
        if (!param.mcmfixposition) {
            t.style.position = 'absolute';
            t.style.left = 0;
            t.attop = true;
        }
    } else {
        this.mcm = null;
    }
    /***** row 5 ******/
    tr = table.insertRow(-1);
    td = tr.insertCell(0); // 5-1
    if (o_test) td.innerHTML = 5;
    td.align = 'center';
    td.vAlign = 'top';
    var c = dom_create('canvas', td);
//c.width= td.style.width=this.leftColumnWidth;
    c.height = 12;
    c.style.marginTop = 2;
    c.style.display = 'none';
    this.basepairlegendcanvas = c;
    td = tr.insertCell(-1); // 5-2
    td.vAlign = 'top';
    d = dom_create('div', td);
    d.className = 'scholder';
    d.style.marginBottom = 2;
    td.appendChild(d);
    var d2 = dom_create('div', d);
    d2.style.position = 'absolute';
    var d3 = dom_create('div', d2);
    d3.style.position = 'relative';
    c = dom_create('canvas', d3);
    c.style.marginBottom = 3;
    c.width = this.hmSpan;
    c.height = 20;
    c.onmousedown = zoomin_MD;
    c.onmousemove = browser_ruler_mover;
    c.onmouseout = pica_hide;
    this.ideogram.canvas = c;
    td = tr.insertCell(-1); // 5-4
    td.rowSpan = 4;
    if (this.mcm) {
        td.vAlign = 'top';
        this.mcm.headerholder_bottom = dom_create('div', td, 'position:relative');
    }
    /***** row 6 not in use ******/
    tr = table.insertRow(-1);
    td = tr.insertCell(0); // 6-1
    if (o_test) td.innerHTML = 6;
    c = dom_create('canvas', td);
    c.style.display = 'none';
    this.htest.header = c;
    td = tr.insertCell(-1); // 6-2
    d = dom_create('div', td);
    d.className = 'scholder';
    d.style.display = 'none';
    this.htest.holder = d;
    c = dom_create('canvas', d);
    c.style.position = 'absolute';
    this.htest.canvas = c;
    /***** row 7 not in use ******/
    tr = table.insertRow(-1);
    td = tr.insertCell(0); // 7-1
    if (o_test) td.innerHTML = 7;
    c = dom_create('canvas', td);
    c.style.display = 'none';
    this.pwc.header = c;
    td = tr.insertCell(-1); // 7-2
    d = dom_create('div', td);
    d.className = 'scholder';
    d.style.display = 'none';
    this.pwc.holder = d;
    td.appendChild(d);
    c = dom_create('canvas', d);
    c.style.position = 'absolute';
    this.pwc.canvas = c;
    /***** row 8 ******/
    tr = table.insertRow(-1);
    td = tr.insertCell(0); // 8-1
    if (o_test) td.innerHTML = 8;
    if (param.tkheader) {
        td.vAlign = 'top';
        this.decorheaderdiv = td;
    } else {
        this.decorheaderdiv = null;
    }
    td = tr.insertCell(-1); // 8-2
    td.vAlign = 'top';
    d = dom_create('div', td);
    d.className = 'scholder';
    d2 = dom_create('div', d);
    d2.style.position = 'absolute';
    d2.addEventListener('mousedown', viewboxMD, false);
    this.decordiv = d2;

    this.shield = dom_create('div', param.centralholder, 'position:absolute;top:0px;left:0px;');

    if (param.facet) {
        this.facet = {
            main: dom_create('div', null, 'display:none;padding-top:25px;'),
            dim1: {mdidx: null, term: null},
            dim2: {mdidx: null, term: null},
            rowlst: [],
            collst: [],
            rowlst_td: [],
            collst_td: [],
            pending: {}, // a hash of tk names
        };
        // outmost div, no border
        var d = dom_create('div', this.facet.main, 'display:table;margin:0px 20px 20px 0px;');
        // actual holder
        var d2 = dom_create('div', d, 'background-color:' + colorCentral.background_faint_7);
        var d3 = dom_create('div', d2, 'margin-bottom:15px;padding:10px 20px;background-color:' + colorCentral.foreground_faint_1 + ';border-bottom:solid 1px ' + colorCentral.foreground_faint_3);
        dom_addtext(d3, 'Row ');
        var s = dom_addtext(d3, '', null, 'mdt_box');
        s.isrow = true;
        this.facet.dim1.dom = s;
        s.onclick = facet_dimension_show;
        s.style.marginRight = 20;
        dom_addtext(d3, 'Column ');
        var s = dom_addtext(d3, '', null, 'mdt_box');
        s.isrow = false;
        this.facet.dim2.dom = s;
        s.onclick = facet_dimension_show;
        this.facet.swapbutt = dom_create('div', d3, 'display:none;margin-left:20px;', {
            t: '&#8646;',
            c: 'mdt_box',
            clc: function () {
                bbj.facet_swap();
            },
            title: 'swap row/column'
        });

        var d5 = dom_create('div', d2, 'margin:0px 15px;');
        this.facet.div1 = d5;
        d5 = dom_create('table', d2, 'margin:0px 15px;');
        this.facet.div2 = d5;
        d5.cellSpacing = 3;
        d5.cellPadding = 1;
        var s = dom_create('div', d2, 'margin-left:15px;');
        s.className = 'button_warning';
        s.style.display = 'inline-block';
        s.innerHTML = 'Remove all';
        s.onclick = facet_removeall;
    } else {
        this.facet = null;
    }

    if (param.gsv) {
        this.genesetview = {
            flanking: {},
            ideogram_stroke: '#1F3D7A',
            ideogram_fill5: '#85E094', // 5' upstream
            ideogram_fill3: '#E39F91', // 3' downstream
            minichr_filla: '#a3a3a3',
            minichr_fillb: '#c96',
            minichr_text: 'white',
            box_stroke: colorCentral.foreground_faint_5,
            lst: [], // item region [name, chr, start, stop, plotlen], this is ALL of them not merely in dsp
            lstsf: 0, // scaling factor from bplen to plot len
            lstholder: null, // item list holder table
        };
    } else {
        this.genesetview = null;
    }
};


Browser.prototype.splinterSynctkorder = function () {
// called from trunk
    for (var tag in this.splinters) {
        var spt = this.splinters[tag];
        var newlst = [];
        for (var j = 0; j < this.tklst.length; j++) {
            var tk = spt.findTrack(this.tklst[j].name);
            tk.where = this.tklst[j].where;
            newlst.push(tk);
        }
        spt.tklst = newlst;
        spt.trackdom2holder();
    }
};


function add_new_browser(param) {
    /* add new browser, in addition to existing *main* one
     FIXME func comes from sukn
     */
// dspstat now shows genome name
    gflag.dspstat_showgenomename = true;
    for (var h in horcrux) {
        var b = horcrux[h];
        if (!b.splinterTag) {
            /* b is trunk
             in case of adding multiple new bbjs from golden, the bbj might be uninitiated
             so need to escape them
             */
            if (b.regionLst.length == 0) continue;
            b.updateDspstat();
        }
    }
    var hh = document.getElementById('additional_genomes_div');
    var border = dom_create('div', hh, 'margin-top:15px;margin-bottom:10px;border-top:solid 1px #a8a8a8;border-bottom:solid 1px white;background-color:#ccc;height:4px;');
    var mholder = dom_create('div', hh);
    var bbj = new Browser();
    bbj.leftColumnWidth = param.leftColumnWidth;
    bbj.hmSpan = param.hmSpan;
    bbj.browser_makeDoms({
        centralholder: mholder,
        mintkheight: 10,
        header: {
            padding: '0px 0px 10px 0px',
            fontsize: 'normal',
            zoomout: [['&#8531;', 0.3], [1, 1], [5, 5]],
            dspstat: {allowupdate: true},
            resolution: true,
            utils: {track: true, apps: true, bbjconfig: true, delete: sukn_bbj_delete},
        },
        navigator: true,
        navigator_ruler: true,
        hmdivbg: 'white',
        ghm_scale: true,
        ghm_ruler: true,
        tkheader: true,
        mcm: true,
        gsselect: true,
        gsv: true,
        gsv_geneplot: true,
        facet: true,
    });
    bbj.hmdiv.style.backgroundColor = 'white';
    if (param.stickynote) {
        bbj.ideogram.canvas.oncontextmenu = menu_coordnote;
    }
    bbj.mcm.holder.attop = true; // tells if holder be placed on top or bottom of mcm
    bbj.applyHmspan2holders();
// TODO make genomeparam configurable
    bbj.loadgenome_initbrowser({
        dbname: param.genome,
        browserparam: param.browserparam,
        genomeparam: {gsm: true, custom_track: true},
    });
}

function smooth_tkdata(obj) {
    if (!obj.data_raw) {
        /* for a smoothed tk, when splintering, splinter tk will lack data_raw
         */
        obj.data_raw = obj.data;
    }
    obj.data = [];
    var smooth = obj.qtc.smooth;
    for (var j = 0; j < obj.data_raw.length; j++) {
        var tmpv = [];
        for (var k = 0; k < obj.data_raw[j].length; k++) {
            var v = obj.data_raw[j][k];
            if (isNaN(v) || v == Infinity || v == -Infinity) {
                tmpv.push(v);
            } else {
                var sum = 0, count = 0;
                for (var m = k - (smooth - 1) / 2; m < k + (smooth - 1) / 2; m++) {
                    var v2 = obj.data_raw[j][m];
                    if (v2 != undefined && !isNaN(v2) && v2 != Infinity && v2 != -Infinity) {
                        sum += v2;
                        count++;
                    }
                }
                if (count == 0) {
                    tmpv.push(NaN);
                } else {
                    tmpv.push(sum / count);
                }
            }
        }
        obj.data.push(tmpv);
    }
}

/*** __base__ ends ***/

