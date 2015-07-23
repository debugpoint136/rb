/**
 * Created by dpuru on 2/27/15.
 */


/** __wvfind__ **/
function wvfind_view_toggle(event) {
    var b = event.target;
    apps.wvfind.vertical = b.innerHTML == 'vertical';
    apps.wvfind.view_h.disabled = apps.wvfind.vertical ? false : true;
    apps.wvfind.view_v.disabled = apps.wvfind.vertical;
    wvfind_showresult(apps.wvfind);
}
function makepanel_wvfind(p) {
    var d = make_controlpanel(p);
    apps.wvfind = {
        main: d,
        tklst: [],
        goldengenomes: {hg19: 1, mm9: 1},
        tracks: {},
    };
    var ht = make_headertable(d.__contentdiv);
    var d2 = ht._h;
    d2.style.textAlign = '';
    apps.wvfind.gsbutt = dom_addbutt(d2, '', wvfind_showgeneset);
    apps.wvfind.gssays = dom_create('div', d2, 'display:inline;padding:0px 15px;', {t: 'no gene set chosen'});
    dom_addtext(d2, 'Compare with&nbsp;');
    apps.wvfind.querynames = dom_addtext(d2, '');
    apps.wvfind.submitbutt = dom_addbutt(d2, 'Find orthologs', wvfind_apprun);
    /*
     dom_addtext(d2,'&nbsp;&nbsp;View');
     apps.wvfind.view_h=dom_addbutt(d2,'horizontal',wvfind_view_toggle);
     apps.wvfind.view_v=dom_addbutt(d2,'vertical',wvfind_view_toggle);
     apps.wvfind.view_v.disabled=true;
     dom_addtext(d2,'&nbsp;&nbsp;');
     var b=dom_addbutt(d2,'Add track',wvfind_track_genomemenu);
     b.style.display='none';
     apps.wvfind.trackbutt=b;
     */
    var b = dom_addbutt(d2, 'Export', wvfind_export);
    b.style.display = 'none';
    apps.wvfind.textbutt = b;
    var b = dom_addbutt(d2, 'Compare epigenomes', wvfind_2golden);
    b.style.display = 'none';
    apps.wvfind.goldenbutt = b;
    apps.wvfind.error = dom_create('div', ht._c, 'display:none;', {
        c: 'alertmsg',
        t: 'No orthologs found for this gene/region set.'
    });
    var d3 = dom_create('div', ht._c, 'width:750px;height:400px;overflow:scroll;resize:both;');
    apps.wvfind.table = dom_create('table', d3);
}

function toggle31_1() {
    gflag.menu.bbj.toggle31();
}
function toggle31_2() {
    gflag.browser.toggle31();
}
Browser.prototype.toggle31 = function () {
    apps.wvfind.shortcut.style.display = 'inline-block';
    if (apps.wvfind.main.style.display == 'none') {
        if (!this.weaver) {
            print2console('Cannot invoke app, not in genome-alignment mode.', 2);
            return;
        }
        if (!this.weaver.q) fatalError('target.weaver.q missing');
        var lst = [];
        for (var n in this.weaver.q) {
            lst.push(n);
        }
        cloakPage();
        apps.wvfind.target = [this.genome.name, weavertkcolor_target];
        apps.wvfind.gsbutt.innerHTML = 'Choose ' + this.genome.name + ' gene set';
        apps.wvfind.querynames.innerHTML = lst.join(' and ') + '&nbsp;';
        panelFadein(apps.wvfind.main, 100 + document.body.scrollLeft, 50 + document.body.scrollTop);
        apps.wvfind.bbj = this;
    } else {
        pagecloak.style.display = "none";
        panelFadeout(apps.wvfind.main);
    }
    menu_hide();
};

function menu_gs2wvfind() {
    panelFadeout(apps.gsm.main);
    toggle31_1();
    wvfind_gs_chosen(menu.genesetIdx);
}
function wvfind_showgeneset(event) {
    menu_showgeneset(apps.wvfind.bbj, event.target, wvfind_choosegeneset);
}
function wvfind_choosegeneset(event) {
    wvfind_gs_chosen(event.target.idx);
    menu_hide();
}
function wvfind_gs_chosen(idx) {
    var e = apps.wvfind.bbj.genome.geneset.lst[idx];
    apps.wvfind.geneset = e;
    stripChild(apps.wvfind.gssays, 0);
    dom_addtkentry(3, apps.wvfind.gssays, false, null, e.name);
//apps.wvfind.gssays.innerHTML=e.name+' ('+e.lst.length+' items)';
}
function wvfind_gs2lst(gs) {
    var lst = [];
    for (var i = 0; i < gs.length; i++) {
        var e = gs[i];
        var t = {chr: e.c, start: e.a1, stop: e.b1, hit: {}};
        if (e.isgene) {
            t.isgene = true;
            t.name = e.name;
            t.struct = eval('(' + JSON.stringify(e.struct) + ')');
            t.strand = e.strand;
            t.genetrack = e.type;
        }
        lst.push(t);
    }
    lst.sort(gfSort_len);
    return lst;
}
function wvfind_apprun() {
    if (!apps.wvfind.geneset) {
        print2console('Please select a gene set.', 2);
        return;
    }
    apps.wvfind.tracks = {};
    apps.wvfind.goldenbutt.style.display =
//apps.wvfind.trackbutt.style.display=
        apps.wvfind.textbutt.style.display = 'none';
    stripChild(apps.wvfind.table, 0);
    apps.wvfind.rlst = wvfind_gs2lst(apps.wvfind.geneset.lst);
    var bbj = apps.wvfind.bbj;
    var wtks = [], oldmodes = {};
    for (var i = 0; i < bbj.tklst.length; i++) {
        var t = bbj.tklst[i];
        if (t.ft == FT_weaver_c) {
            wtks.push(t);
            oldmodes[t.name] = t.weaver.mode;
            t.weaver.mode = W_rough;
        }
    }
    if (wtks.length == 0) {
        fatalError('no weaver tk');
    }
    apps.wvfind.submitbutt.disabled = true;
    apps.wvfind.submitbutt.innerHTML = 'Running...';
    bbj.wvfind_run(apps.wvfind.rlst, wtks, wvfind_app_cb);
    for (var i = 0; i < wtks.length; i++) {
        wtks[i].weaver.mode = oldmodes[wtks[i].name];
    }
}

Browser.prototype.wvfind_run = function (rlst, wtks, callback) {
    var lst = [], a, b;
    for (var i = 0; i < rlst.length; i++) {
        var e = rlst[i];
        lst.push(e.chr + ',' + e.start + ',' + e.stop + ',' + 1);
        if (i == 0) {
            a = e.start;
        }
        if (i == rlst.length - 1) {
            b = e.stop;
        }
    }
    var param = 'dbName=' + this.genome.name + '&runmode=' + RM_genome + '&regionLst=' + lst.join(',') +
        '&startCoord=' + a + '&stopCoord=' + b;
    var bbj = this;
    this.ajax(param + '&' + trackParam(wtks), function (data) {
        bbj.wvfind_run_cb(data, rlst, wtks, callback);
    });
};

Browser.prototype.wvfind_run_cb = function (data, rlst, wtks, callback) {
// data is returned by cgi
    if (!data || !data.tkdatalst || data.tkdatalst.length == 0) {
        print2console('Server error!', 2);
        callback();
        return;
    }
    var bb = new Browser();
    var btk = {weaver: {}};
    var targetmaxlen = 0;
    for (var i = 0; i < rlst.length; i++) {
        targetmaxlen = Math.max(targetmaxlen, rlst[i].stop - rlst[i].start);
    }
    var geneIter = {}; // iteration object to retrieve query gene info over stitches
    var maxstitch = 0; // to give to callback
    for (var i = 0; i < data.tkdatalst.length; i++) {
        var wtk = data.tkdatalst[i];
        if (wtk.ft != FT_weaver_c) {
            print2console('ft is not weaver', 2);
            continue;
        }
        var t = null;
        for (var j = 0; j < wtks.length; j++) {
            if (wtks[j].name == wtk.name) {
                t = wtks[j];
                break;
            }
        }
        if (!t) {
            fatalError('wtk is gone');
        }
        if (wtk.data.length != rlst.length) {
            print2console('Error: inconsistant returned data for ' + t.cotton, 2);
            continue;
        }
        // find default gene track from query genome
        var qgtk = null;
        for (var n in genome[t.cotton].decorInfo) {
            var g = genome[t.cotton].decorInfo[n];
            if (g.isgene) {
                qgtk = g;
                break;
            }
        }
        for (var j = 0; j < wtk.data.length; j++) {
            var targetr = rlst[j];
            var len = (targetr.stop - targetr.start);
            bb.dspBoundary = {
                vstartr: 0, vstarts: 0, vstartc: targetr.start,
                vstopr: 0, vstops: len, vstopc: targetr.stop
            };
            bb.regionLst = [[targetr.chr, 0, this.genome.scaffold.len[targetr.chr], targetr.start, targetr.stop, len, '', 1]];
            bb.entire = {length: len, spnum: len, summarySize: 1, atbplevel: false};
            btk.data = [[]];
            for (var k = 0; k < wtk.data[j].length; k++) {
                var e = wtk.data[j][k]; // target coord
                var g = e.genomealign; // query coord
                btk.data[0].push({
                    start: e.start, stop: e.stop, id: j,
                    hsp: {
                        querychr: g.chr,
                        querystart: g.start,
                        querystop: g.stop,
                        strand: g.strand,
                        targetrid: 0,
                        targetstart: e.start,
                        targetstop: e.stop
                    }
                });
            }
            bb.weaver_stitch(btk, Math.min(len * 5, targetmaxlen * 1.5));
            if (!btk.weaver.stitch || btk.weaver.stitch.length == 0) {
                continue;
            }
            btk.weaver.stitch.sort(wvfind_sorthit);
            targetr.hit[t.cotton] = btk.weaver.stitch;
            for (var k = 0; k < btk.weaver.stitch.length; k++) {
                var s = btk.weaver.stitch[k];
                var total = 0;
                for (var m = 0; m < s.lst.length; m++) {
                    total += s.lst[m].targetstop - s.lst[m].targetstart;
                }
                maxstitch = Math.max(maxstitch, total);
                s.percentage = Math.min(100, Math.ceil(100 * total / (targetr.stop - targetr.start)));
            }
            if (targetr.isgene) {
                if (!geneIter[t.cotton]) {
                    geneIter[t.cotton] = {};
                }
                var thisqgtk = null;
                if (targetr.genetrack in genome[t.cotton].decorInfo) {
                    thisqgtk = genome[t.cotton].decorInfo[targetr.genetrack];
                } else {
                    thisqgtk = qgtk;
                }
                if (thisqgtk) {
                    if (!geneIter[t.cotton][thisqgtk.name]) {
                        geneIter[t.cotton][thisqgtk.name] = [];
                    }
                    geneIter[t.cotton][thisqgtk.name].push(j);
                } else {
                    print2console('gene track missing from ' + t.cotton, 2);
                }
            }
        }
    }
    this.wvfind_itergene(geneIter, rlst, callback);
};

Browser.prototype.wvfind_itergene = function (geneiter, rlst, callback) {
    for (var qgn in geneiter) {
        // query genome
        for (var gtkn in geneiter[qgn]) {
            // is gene track name of query genome
            var tk = genome[qgn].getTkregistryobj(gtkn);
            if (!tk) {
                print2console(qgn + ' gene track ' + gtkn + ' went missing', 2);
                delete geneiter[gn][gtkn];
                continue;
            }
            var idlst = geneiter[qgn][gtkn];
            var lst = [], a, b;
            for (var i = 0; i < idlst.length; i++) {
                var stp = rlst[idlst[i]].hit[qgn][0];
                lst.push(stp.chr + ',' + stp.start + ',' + stp.stop + ',' + 1);
                if (i == 0) {
                    a = stp.start;
                }
                if (i == idlst.length - 1) {
                    b = stp.stop;
                }
            }
            delete geneiter[qgn][gtkn];
            var bbj = this;
            var tk2 = duplicateTkobj(tk);
            tk2.mode = M_full;
            this.ajax('dbName=' + qgn + '&runmode=' + RM_genome + '&regionLst=' + lst.join(',') +
                '&startCoord=' + a + '&stopCoord=' + b + '&' + trackParam([tk2]),
                function (data) {
                    bbj.wvfind_itergene_cb(data, geneiter, qgn, idlst, rlst, callback);
                });
            return;
        }
    }
    callback(1);
};

Browser.prototype.wvfind_itergene_cb = function (data, geneiter, qgn, idlst, rlst, callback) {
    if (!data || !data.tkdatalst || data.tkdatalst.length == 0) {
        print2console('server error!', 2);
    } else if (data.tkdatalst[0].data.length != idlst.length) {
        print2console('expecting data over ' + idlst.length + ' regions but got ' + data.tkdatalst[0].data.length, 2);
    } else {
        for (var i = 0; i < idlst.length; i++) {
            var stp = rlst[idlst[i]].hit[qgn][0];
            // get longest query gene
            var qglst = data.tkdatalst[0].data[i];
            if (qglst.length == 0) {
                continue;
            }
            var qgene = qglst[0];
            var maxlen = Math.min(stp.stop, qgene.stop) - Math.max(stp.start, qgene.start);
            for (var j = 1; j < qglst.length; j++) {
                var b = qglst[j];
                var bl = Math.min(stp.stop, b.stop) - Math.max(stp.start, b.start);
                if (bl > maxlen) {
                    maxlen = bl;
                    qgene = b;
                }
            }
            stp.querygene = qgene;
        }
    }
    this.wvfind_itergene(geneiter, rlst, callback);
};

function wvfind_app_cb(maxbp) {
    apps.wvfind.submitbutt.disabled = false;
    apps.wvfind.submitbutt.innerHTML = 'Find orthologs';
    if (!maxbp) {
        apps.wvfind.error.style.display = 'block';
        return;
    }
    apps.wvfind.error.style.display = 'none';
    var queries = [];
    var bbj = apps.wvfind.bbj;
    for (var n in bbj.weaver.q) {
        for (var i = 0; i < bbj.tklst.length; i++) {
            var t = bbj.tklst[i];
            if (t.ft == FT_weaver_c && t.cotton == n) {
                queries.push([n, t.qtc.bedcolor]);
                break;
            }
        }
    }
    apps.wvfind.queries = queries;
    wvfind_showresult(apps.wvfind);
    apps.wvfind.textbutt.style.display = 'inline';
//apps.wvfind.trackbutt.style.display= 'inline';
    if (bbj.genome.name in apps.wvfind.goldengenomes) {
        var all = true;
        for (var i = 0; i < apps.wvfind.queries.length; i++) {
            if (!(apps.wvfind.queries[i][0] in apps.wvfind.goldengenomes)) {
                all = false;
            }
        }
        if (all) {
            apps.wvfind.goldenbutt.style.display = 'inline';
        }
    }
}

function wvfind_showresult(arg) {
    if (!arg.queries || !arg.rlst) return;
    var bbj = arg.bbj;
    var bbjclb = bbj.regionLst.length > 0;
    stripChild(arg.table, 0);
    var tr = arg.table.insertRow(0);
    var td = tr.insertCell(0);
    td.align = 'center';
    td.innerHTML = bbj.genome.name + (bbjclb ? ' <span style="font-size:70%">click to view in browser</span>' : '');
    for (var i = 0; i < arg.queries.length; i++) {
        td = tr.insertCell(-1);
        td.align = 'center';
        td.style.color = arg.queries[i][1];
        td.innerHTML = arg.queries[i][0];
    }
    var lst = arg.rlst;
    var width = 300;
    var maxtarget = 0;
    for (var i = 0; i < lst.length; i++) {
        maxtarget = Math.max(lst[i].stop - lst[i].start, maxtarget);
    }
    var sf = 150 / maxtarget;
    for (var i = 0; i < lst.length; i++) {
        var e = lst[i];
        tr = arg.table.insertRow(-1);
        tr.className = 'clb4';
        td = tr.insertCell(0);
        td.vAlign = 'top';
        td.align = 'right';
        if (e.isgene) {
            var s = dom_addtext(td, e.name, weavertkcolor_target, bbjclb ? 'clb' : null);
            if (bbjclb) {
                s.onclick = jump2coord_closure(bbj, e.chr, e.start, e.stop);
            }
        } else {
            var s = dom_addtext(td, e.chr + ':' + e.start + '-' + e.stop + ' <span style="font-size:70%">' + bp2neatstr(e.stop - e.start) + '</span>', weavertkcolor_target, 'clb');
            if (bbjclb) {
                s.onclick = jump2coord_closure(bbj, e.chr, e.start, e.stop);
            }
        }
        if (arg.checkbox) {
            var chb = dom_create('input', td, 'transform:scale(1.5);');
            chb.type = 'checkbox';
            e.checkbox = chb;
        }
        dom_create('div', td, 'width:' + parseInt(100 * (e.stop - e.start) / maxtarget) + '%;height:2px;background-color:' + weavertkcolor_target);
        if (e.isgene) {
            dom_create('div', td, 'font-size:70%;').innerHTML = e.chr + ':' + e.start + '-' + e.stop + ', ' + bp2neatstr(e.stop - e.start);
        }
        for (var j = 0; j < arg.queries.length; j++) {
            td = tr.insertCell(-1);
            td.vAlign = 'top';
            td.style.paddingTop = 5;
            var hits = e.hit[arg.queries[j][0]];
            if (!hits || hits.length == 0) {
                td.innerHTML = 'no hit';
                continue;
            }
            var stc = hits[0];
            if (arg.checkbox) {
                if (stc.percentage > 40) {
                    e.checkbox.checked = true;
                }
            }
            var par = {
                start: e.start, stop: e.stop,
                targetcolor: weavertkcolor_target,
                querycolor: arg.queries[j][1],
                stitch: stc,
                width: width,
                holder: td,
            };
            if (e.isgene) {
                par.targetstruct = e.struct;
                par.strand = e.strand;
            }
            draw_stitch(par);
            var d = dom_create('div', td);
            if (stc.querygene) {
                dom_addtext(d,
                    stc.querygene.name2 ? stc.querygene.name2 : stc.querygene.name,
                    arg.queries[j][1]);
                dom_addtext(d, '&nbsp;&nbsp;' + stc.chr + ':' + stc.start + '-' + stc.stop + ', ' + bp2neatstr(stc.stop - stc.start) + ' ' + stc.percentage + '% aligned').style.fontSize = '70%';
            } else {
                dom_addtext(d, stc.chr + ':' + stc.start + '-' + stc.stop + ' <span style="font-size:70%">' + bp2neatstr(stc.stop - stc.start) + ' ' + stc.percentage + '% aligned</span>', arg.queries[j][1]);
            }
            if (hits.length > 1) {
                var d2 = dom_create('table', d, 'display:none;zoom:.8;');
                for (var k = 1; k < hits.length; k++) {
                    var ss = hits[k];
                    var tr2 = d2.insertRow(-1);
                    tr2.insertCell(0).innerHTML = ss.chr + ':' + ss.start + '-' + ss.stop;
                    tr2.insertCell(1).innerHTML = bp2neatstr(ss.stop - ss.start);
                    tr2.insertCell(2).innerHTML = ss.percentage + '%';
                }
                dom_addtext(d, '&nbsp;&nbsp;' + (hits.length - 1) + ' more hit' + (hits.length - 1 > 1 ? 's' : ''), null, 'clb').onclick = toggle_prevnode;
            }
        }
    }
}

function wvfind_sorthit(a, b) {
    var la = 0;
    for (var i = 0; i < a.lst.length; i++) {
        la += a.lst[i].targetstop - a.lst[i].targetstart;
    }
    var lb = 0;
    for (var i = 0; i < b.lst.length; i++) {
        lb += b.lst[i].targetstop - b.lst[i].targetstart;
    }
    return lb - la;
}

function draw_stitch(p) {
    var b1h = p.b1h ? p.b1h : (p.targetstruct ? 11 : 5),
        b2h = p.b2h ? p.b2h : (p.stitch.querygene ? 11 : 5),
        alnh = p.alnheight ? p.alnheight : 22;
    var c = dom_create('canvas', p.holder);
    c.width = p.width;
    c.height = b1h + b2h + alnh + (p.allstitches ? (p.allstitches.length - 1) * (b2h + 2) : 0);
    var sf = p.width / Math.max(p.stop - p.start, p.stitch.stop - p.stitch.start);
    var ctx = c.getContext('2d');
    var w = sf * (p.stop - p.start);
    if (p.targetstruct) {
        plotGene(ctx, p.targetcolor, 'white',
            {start: p.start, stop: p.stop, strand: p.strand, struct: p.targetstruct},
            0, 0, w, b1h,
            p.start, p.stop,
            false);
    } else {
        ctx.fillStyle = p.targetcolor;
        ctx.fillRect(0, 0, w, b1h);
    }
    var stcw = sf * (p.stitch.stop - p.stitch.start);
    ctx.fillStyle = p.querycolor;
    if (p.stitch.querygene) {
        ctx.fillRect(0, b1h + alnh + parseInt(b2h / 2), stcw, 1);
        plotGene(ctx, p.querycolor, 'white',
            p.stitch.querygene,
            0, b1h + alnh, stcw, b2h,
            p.stitch.start, p.stitch.stop,
            false);
    } else {
        ctx.fillRect(0, b1h + alnh, stcw, b2h)
    }
    ctx.fillStyle = '#858585';
    for (var i = 0; i < p.stitch.lst.length; i++) {
        var e = p.stitch.lst[i];
        var a1 = (e.targetstart - p.start) * sf,
            a2 = Math.max(a1 + 1, (e.targetstop - p.start) * sf),
            b1 = (e.querystart - p.stitch.start) * sf,
            b2 = Math.max(b1 + 1, (e.querystop - p.stitch.start) * sf);
        ctx.beginPath();
        ctx.moveTo(a1, b1h + 1);
        ctx.lineTo(a2, b1h + 1);
        var h2 = b1h + alnh - 1;
        if (e.strand == '+') {
            ctx.lineTo(b2, h2);
            ctx.lineTo(b1, h2);
        } else {
            ctx.lineTo(b1, h2);
            ctx.lineTo(b2, h2);
        }
        ctx.closePath();
        ctx.fill();
    }
    /*
     if(p.allstitches) {
     ctx.fillStyle=p.querycolor;
     for(var i=1; i<p.allstitches.length; i++) {
     var e=p.allstitches[i];
     ctx.fillRect(0,b2h+alnh+(i-1)*(b1h+b2h),sf*(e.stop-e.start),b2h)
     }
     }
     */
}

function wvfind_export() {
    var doc = window.open().document;
    var table = doc.createElement('table');
    doc.body.appendChild(table);
    table.cellPadding = 5;
    table.border = 1;
    var tr = table.insertRow(0);
    var td = tr.insertCell(0);
    td.innerHTML = apps.wvfind.bbj.genome.name;
    for (var i = 0; i < apps.wvfind.queries.length; i++) {
        td = tr.insertCell(1);
        td.innerHTML = apps.wvfind.queries[i][0];
    }
    for (var i = 0; i < apps.wvfind.rlst.length; i++) {
        var e = apps.wvfind.rlst[i];
        tr = table.insertRow(-1);
        td = tr.insertCell(0);
        td.innerHTML = (e.isgene ? (e.name2 ? e.name2 : e.name) + ' ' : '') + e.chr + ':' + e.start + '-' + e.stop;
        for (var j = 0; j < apps.wvfind.queries.length; j++) {
            var qn = apps.wvfind.queries[j][0];
            td = tr.insertCell(-1);
            if (qn in e.hit) {
                var e2 = e.hit[qn][0];
                td.innerHTML = (e2.querygene ? (e2.querygene.name2 ? e2.querygene.name2 : e2.querygene.name) + ' ' : '') + e2.chr + ':' + e2.start + '-' + e2.stop;
            }
        }
    }
}
function wvfind_2golden() {
    var J = {};
    for (var n in apps.wvfind.goldengenomes) {
        J[n] = {};
    }
    J[apps.wvfind.bbj.genome.name].wvfind = {rlst: apps.wvfind.rlst, queries: apps.wvfind.queries};
    apps.wvfind.goldenbutt.disabled = true;
    ajaxPost('json\n' + JSON.stringify(J), function (key) {
        wvfind_2golden_cb(key);
    });
}
function wvfind_2golden_cb(key) {
    apps.wvfind.goldenbutt.disabled = false;
    if (!key) {
        print2console('Server error, please try again.', 2);
        return;
    }
    window.open(window.location.origin + window.location.pathname + 'roadmap/?pin=' + window.location.origin + window.location.pathname + 't/' + key, '_blank');
}

function wvfind_track_genomemenu(event) {
    menu_blank();
    menu_addoption(null, 'Add ' + apps.wvfind.bbj.genome.name + ' track', wvfind_choosetk_closure(apps.wvfind.bbj.genome.name), menu.c32);
    for (var i = 0; i < apps.wvfind.queries.length; i++) {
        var n = apps.wvfind.queries[i][0];
        menu_addoption(null, 'Add ' + n + ' track', wvfind_choosetk_closure(n), menu.c32);
    }
    menu_show_beneathdom(0, event.target);
}
function wvfind_choosetk_closure(gname) {
    return function () {
        wvfind_choosetk(gname);
    };
}
function wvfind_choosetk(gname) {
    menu_blank();
    dom_create('div', menu.c32, 'margin:15px;').innerHTML = gname + ' tracks';
    var d = dom_create('div', menu.c32, 'margin:15px;');
    for (var i = 0; i < apps.wvfind.bbj.tklst.length; i++) {
        var tk = apps.wvfind.bbj.tklst[i];
        if (tk.ft == FT_weaver_c) continue;
        if ((!tk.cotton && apps.wvfind.bbj.genome.name == gname) || (tk.cotton && tk.cotton == gname)) {
            dom_addtkentry(2, d, false, tk, tk.label, wvfind_addtk_sukn);
        }
    }
}
function wvfind_addtk_sukn(event) {
    event.target.className = 'tkentry_inactive';
    var tk = event.target.tkobj;
    var targetbbj = tk.cotton ? apps.wvfind.bbj.weaver.q[tk.cotton] : apps.wvfind.bbj;
    var gn = tk.cotton ? tk.cotton : apps.wvfind.bbj.genome.name;
    if (gn in apps.wvfind.tracks && tk.name in apps.wvfind.tracks[gn]) {
        return;
    }
    targetbbj.wvfind_addtk(tk, apps.wvfind);
}
Browser.prototype.wvfind_addtk = function (tk, wvobj) {
    var tk2 = null;
    switch (tk.ft) {
        case FT_bedgraph_c:
        case FT_bedgraph_n:
        case FT_bigwighmtk_c:
        case FT_bigwighmtk_n:
        case FT_qdecor_n:
        case FT_cat_n:
        case FT_cat_c:
            tk2 = duplicateTkobj(tk);
            tk2.mode = M_show;
            break;
        case FT_anno_n:
        case FT_anno_c:
        case FT_bed_n:
        case FT_bed_c:
        case FT_bam_n:
        case FT_bam_c:
            tk2 = duplicateTkobj(tk);
            tk2.mode = M_den;
            break;
        default:
            print2console(FT2verbal[tk.ft] + ' track is not supported at the moment', 2);
            return;
    }
    var gn = this.genome.name;
    if (!(gn in wvobj.tracks)) {
        wvobj.tracks[gn] = {};
    }
    wvobj.tracks[gn][tk.name] = tk2;
// collect regions
    var rlst = [];
    for (var i = 0; i < wvobj.rlst.length; i++) {
        var e = wvobj.rlst[0];
        if (gn == wvobj.target[0]) {
            rlst.push([e.chr, e.start, e.stop]);
        } else {
            var hits = e.hit[gn];
            // XXX
            if (hits && hits.length > 0) {
            }
        }
    }
};

/** __wvfind__ ends **/

