/**
 * ===BASE===// baseFunc // ajax_loadbbjdata.js
 * @param __Browser.prototype__
 * @param 
 */

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


