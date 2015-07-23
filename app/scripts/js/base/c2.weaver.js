/**
 * Created by dpuru on 2/27/15.
 */




/** __weaver__ **/
/*
 one sample:
 show all parts on hg19, clickable buttons

 click a button, assemble new reference
 new reference as target, hg19 as query

 db-free reference, but needs length of all scaffolds
 comparison of many samples
 */

function weaver_custtk_example(g, gn, url) {
    return function () {
        var d = g.custtk.ui_weaver;
        d.input_name.value = gn;
        d.input_url.value = url;
    }
}

Browser.prototype.stitch2hithsp = function (stitch, x) {
// call from target, x pos is compared to hsp's query pos
    var hits = [];
    for (var i = 0; i < stitch.lst.length; i++) {
        var hsp = stitch.lst[i];
        if (x > Math.min(hsp.q1, hsp.q2) && x < Math.max(hsp.q1, hsp.q2)) {
            var sf = hsp.strand == '+' ? (x - hsp.q1) / (hsp.q2 - hsp.q1) :
            (x - hsp.q2) / (hsp.q1 - hsp.q2);
            hits.push([
                hsp.strand == '+' ? (hsp.t1 + sf * (hsp.t2 - hsp.t1)) : (hsp.t2 - sf * (hsp.t2 - hsp.t1)),
                hsp.t1,
                hsp.t2,
                this.regionLst[hsp.targetrid][0] +
                ' ' + parseInt(hsp.strand == '+' ? (hsp.targetstart + sf * (hsp.targetstop - hsp.targetstart)) :
                    (hsp.targetstop - sf * (hsp.targetstop - hsp.targetstart))),
            ]);
        }
    }
    return hits;
};

Browser.prototype.weaver_gotgap = function (rid, descending) {
    if (!this.weaver || !this.weaver.insert) return [];
    var ins = this.weaver.insert[rid];
    if (!ins) return [];
    var lst = [];
    for (var c in ins) lst.push(parseInt(c));
    if (lst.length == 0) return [];
    lst.sort(descending ? numSort2 : numSort);
    return lst;
};

Browser.prototype.targetBypassQuerytk = function (t) {
    if (!this.weaver) return false;
    if (this.weaver.iscotton) {
        // cottonbbj
        return false;
    }
// target bbj
    if (t.cotton && t.ft != FT_weaver_c) return true;
    return false;
};


Browser.prototype.weaver_detail = function (x, hitpoint, result, tk, holder) {
    stripChild(holder, 0);
    if (tk.weaver.mode == W_rough) {
        var s = result.stitch;
        if (!s) return;
        var d = dom_create('div', holder, 'margin:10px;line-height:1.5;');
        d.innerHTML =
            'Entire ' + tk.cotton + ' region:<br>' +
            s.chr + ':' + s.start + '-' + s.stop + ' (' +
            bp2neatstr(s.stop - s.start) + ')' +
            (s.lst.length > 1 ? '<br>Joined by ' + s.lst.length + ' alignments.' : '') +
            '<div style="opacity:.8;font-size:80%;">Coordinates in the flags are approximate<br>because gaps are not considered.<br>ZOOM IN to view detailed alignment.</div>';
        return;
    }
    var item = result;
// determine chew start
    var a = x - item.hsp.canvasstart;
    var spsize = this.regionLst[hitpoint.rid][7];
    var chewstart = item.hsp.chew_start + parseInt(this.entire.atbplevel ? a / this.entire.bpwidth : a * spsize);
    var chewflank = 10 + Math.min(15, this.entire.atbplevel ? 0 : parseInt(spsize));
    var targetbp = [], querybp = [], aln = [];
    var fv = item.hsp.strand == '+';
    var targetcoord = item.hsp.targetstart,
        querycoord = fv ? item.hsp.querystart : item.hsp.querystop;
    for (var i = item.hsp.chew_start; i < Math.max(item.hsp.chew_start, chewstart - chewflank); i++) {
        if (item.hsp.targetseq[i] != '-') targetcoord++;
        if (item.hsp.queryseq[i] != '-') querycoord += fv ? 1 : -1;
    }
    var chewrealstart = i;
    var targetstart = targetcoord;
    var querystart, querystop,
        tchl = [], qchl = []; // t/q highlight coord
    if (fv) querystart = querycoord;
    else querystop = querycoord;
    for (; i < Math.min(item.hsp.targetseq.length, chewstart + chewflank); i++) {
        var t = item.hsp.targetseq[i],
            q = item.hsp.queryseq[i];
        if (t != '-' && q != '-' && (t.toLowerCase() == q.toLowerCase())) {
            aln.push('|');
        } else {
            aln.push('&nbsp;');
        }
        // only highlight those in summary point
        var highlight = this.entire.atbplevel ? (i == chewstart) : (i >= chewstart - spsize / 2 && i <= chewstart + spsize / 2);
        targetbp.push(highlight ? '<span style="background-color:rgba(255,255,0,.2);">' + t + '</span>' : t);
        querybp.push(highlight ? '<span style="background-color:rgba(255,255,0,.2);">' + q + '</span>' : q);
        if (highlight) {
            tchl.push(targetcoord);
            qchl.push(querycoord);
        }
        if (t != '-') targetcoord++;
        if (q != '-') querycoord += fv ? 1 : -1;
    }
    var chewrealstop = i;
    if (fv) querystop = querycoord;
    else querystart = querycoord;

    var table = dom_create('table', holder, 'margin:10px;color:white;');
// row 1
    var tr = table.insertRow(0);
    var td = tr.insertCell(0);
    td.colSpan = 3;
    td.style.paddingBottom = 10;
// target highlight coord
    var max = min = tchl[0];
    for (var i = 1; i < tchl.length; i++) {
        var a = tchl[i];
        if (a > max) max = a;
        if (a < min) min = a;
    }
    td.innerHTML = this.genome.name + ', ' + this.regionLst[hitpoint.rid][0] + '&nbsp;&nbsp;' +
    '<span style="background-color:rgba(255,255,0,.2);">' +
    (max == min ? max : min + '-' + max) + '</span>';
// row 2
    tr = table.insertRow(-1);
    td = tr.insertCell(0);
    td.style.opacity = .7;
    td.innerHTML = targetstart;
    td = tr.insertCell(1);
    td.style.font = '15px Courier,monospace';
    td.innerHTML = targetbp.join('');
    td = tr.insertCell(2);
    td.style.opacity = .7;
    td.innerHTML = targetcoord;
// row 3
    tr = table.insertRow(-1);
    tr.insertCell(0);
    td = tr.insertCell(1);
    td.style.font = '15px Courier,monospace';
    td.innerHTML = aln.join('');
    tr.insertCell(2);
// row 4
    tr = table.insertRow(-1);
    td = tr.insertCell(0);
    td.style.opacity = .7;
    td.innerHTML = fv ? querystart : querystop;
    td = tr.insertCell(1);
    td.style.font = '15px Courier,monospace';
    td.innerHTML = querybp.join('');
    td = tr.insertCell(2);
    td.style.opacity = .7;
    td.innerHTML = fv ? querystop : querystart;
// row 5
    tr = table.insertRow(-1);
    td = tr.insertCell(0);
    td.colSpan = 3;
    td.style.paddingTop = 10;
// target highlight coord
    var max = min = qchl[0];
    for (var i = 1; i < qchl.length; i++) {
        var a = qchl[i];
        if (a > max) max = a;
        if (a < min) min = a;
    }
    td.innerHTML = tk.cotton + ', ' + item.hsp.querychr + '&nbsp;&nbsp;' +
    '<span style="background-color:rgba(255,255,0,.2);">' +
    (max == min ? max : (fv ? min + '-' + max : max + '-' + min)) + '</span>&nbsp;&nbsp;' +
    '<span style="opacity:.7;">' + (item.hsp.strand == '+' ? 'forward' : 'reverse') + '</span>';
    return [chewrealstart, chewrealstop, table];
};

Browser.prototype.weaver_stitch = function (tk, stitchlimit) {
    /* stitch hsp up
     distance constrain, if hsp are within a short distance of each other, merge into a big one
     */
    stitchlimit = stitchlimit ? stitchlimit : 200 * this.entire.summarySize;
    var tmp = []; // {chr:, lst:[]}
    for (var rid = this.dspBoundary.vstartr; rid <= this.dspBoundary.vstopr; rid++) {
        for (var aid = 0; aid < tk.data[rid].length; aid++) {
            var h0 = tk.data[rid][aid].hsp;
            /* if hsp crosses view range border, will trim it
             but should not modify original hsp, make duplicate
             */
            var h = {};
            for (var n in h0) {
                h[n] = h0[n];
            }
            if (rid == this.dspBoundary.vstartr) {
                if (h.targetstop <= this.dspBoundary.vstartc) continue;
                if (h.targetstart < this.dspBoundary.vstartc) {
                    var perc = (this.dspBoundary.vstartc - h.targetstart) / (h.targetstop - h.targetstart);
                    h.targetstart = this.dspBoundary.vstartc;
                    if (h.strand == '+') {
                        h.querystart += parseInt((h.querystop - h.querystart) * perc);
                    } else {
                        h.querystop -= parseInt((h.querystop - h.querystart) * perc);
                    }
                }
            }
            if (rid == this.dspBoundary.vstopr) {
                if (h.targetstart >= this.dspBoundary.vstopc) continue;
                if (h.targetstop > this.dspBoundary.vstopc) {
                    var perc = (h.targetstop - this.dspBoundary.vstopc) / (h.targetstop - h.targetstart);
                    h.targetstop = this.dspBoundary.vstopc;
                    if (h.strand == '+') {
                        h.querystop -= parseInt((h.querystop - h.querystart) * perc);
                    } else {
                        h.querystart += parseInt((h.querystop - h.querystart) * perc);
                    }
                }
            }
            // save
            h.t1 = this.cumoffset(h.targetrid, Math.max(this.regionLst[h.targetrid][3], h.targetstart));
            h.t2 = this.cumoffset(h.targetrid, Math.min(this.regionLst[h.targetrid][4], h.targetstop));
            var nf = true;
            for (var i = 0; i < tmp.length; i++) {
                if (tmp[i].chr == h.querychr) {
                    tmp[i].lst.push(h);
                    nf = false;
                    break;
                }
            }
            if (nf) {
                tmp.push({chr: h.querychr, lst: [h]});
            }
        }
    }
    var newlst = [];
    for (var j = 0; j < tmp.length; j++) {
        tmp[j].lst.sort(hspSort);
        var fragment = null;
        for (var i = 0; i < tmp[j].lst.length; i++) {
            var hsp = tmp[j].lst[i];
            if (!fragment) {
                fragment = {
                    chr: tmp[j].chr,
                    start: hsp.querystart,
                    stop: hsp.querystop,
                    lst: [hsp],
                    t1: hsp.t1,
                    t2: hsp.t2,
                };
            } else {
                if (Math.max(fragment.start, hsp.querystart) - Math.min(fragment.stop, hsp.querystop) < stitchlimit) {
                    // join
                    fragment.lst.push(hsp);
                    fragment.start = Math.min(fragment.start, hsp.querystart);
                    fragment.stop = Math.max(fragment.stop, hsp.querystop);
                    fragment.t1 = Math.min(hsp.t1, fragment.t1);
                    fragment.t2 = Math.max(hsp.t2, fragment.t2);
                } else {
                    newlst.push(fragment);
                    fragment = {
                        chr: tmp[j].chr,
                        start: hsp.querystart,
                        stop: hsp.querystop,
                        lst: [hsp],
                        t1: hsp.t1,
                        t2: hsp.t2,
                    };
                }
            }
        }
        if (fragment) {
            newlst.push(fragment);
        }
    }
    tk.weaver.stitch = newlst;
};


Browser.prototype.weaver_stitch2cotton = function (tk) {
    var querybbj = this.weaver.q[tk.cotton];
    if (this.weaverpending) {
        var p = this.weaverpending[tk.cotton];
        if (p) {
            querybbj.init_bbj_param = {hubjsoncontent: p};
            delete this.weaverpending[tk.cotton];
        }
    }
    var regionlst = [];
    var insertlst = [];
    for (var j = 0; j < tk.weaver.stitch.length; j++) {
        var stp = tk.weaver.stitch[j];
        var firsthsp = stp.lst[0];
        var newregion = [
            stp.chr,
            stp.start,
            stp.stop,
            stp.start,
            stp.stop,
            Math.ceil(stp.canvasstop - stp.canvasstart), // region screen width
            '',
            (stp.stop - stp.start) / (stp.canvasstop - stp.canvasstart),
            {
                canvasxoffset: stp.canvasstart,
                item: {
                    hsp: {
                        targetrid: firsthsp.targetrid,
                        targetstart: firsthsp.targetstart,
                        strand: '+'
                    }
                },
                stitch: stp,
            }
        ];
        regionlst.push(newregion);
        insertlst.push({});
    }
    querybbj.regionLst = regionlst;
    querybbj.weaver.insert = insertlst;
    this.weaver_cotton_spin(querybbj);
};


Browser.prototype.weaver_hsp2cotton = function (tk) {
// call from target bbj
    var qgn = tk.cotton;
    var querybbj = this.weaver.q[qgn];
    if (this.weaverpending) {
        var p = this.weaverpending[qgn];
        if (p) {
            querybbj.init_bbj_param = {hubjsoncontent: p};
            delete this.weaverpending[qgn];
        }
    }
    var regionlst = [];
    var insertlst = [];
    for (var j = 0; j < tk.data.length; j++) {
        for (var k = 0; k < tk.data[j].length; k++) {
            var item = tk.data[j][k];
            var x1 = item.boxstart,
                x2 = item.boxstart + item.boxwidth;
            if (x2 <= x1 + 5) continue;
            if (Math.max(x1, -this.move.styleLeft) >= Math.min(x2, this.hmSpan - this.move.styleLeft)) continue;
            // acceptable hsp, create a new region for it in query genome
            var r7 = this.regionLst[item.hsp.targetrid][7];
            var newregion = [
                item.hsp.querychr,
                item.hsp.querystart,
                item.hsp.querystop,
                item.hsp.querystart,
                item.hsp.querystop,
                /* region screen width
                 but this is inprecise since no gaps on query is considered
                 */
                this.entire.atbplevel ?
                    parseInt(this.entire.bpwidth * (item.hsp.querystop - item.hsp.querystart)) :
                    parseInt((item.hsp.querystop - item.hsp.querystart) / r7),
                '',
                r7,
                {
                    item: item,
                }];
            regionlst.push(newregion);
            var insert = {};
            for (var c in item.hsp.gap) {
                insert[c] = item.hsp.gap[c];
            }
            insertlst.push(insert);
        }
    }
// fit regionlst into querybbj
    querybbj.regionLst = regionlst;
    querybbj.weaver.insert = insertlst;
};

Browser.prototype.weaver_cotton_dspboundary = function () {
// cottonbbj dspBoundary, use with care!
    var r0 = this.regionLst[0],
        r9 = this.regionLst[this.regionLst.length - 1];
    this.dspBoundary = {
        vstartr: 0,
        vstarts: 0,
        vstartc: r0[8].item.hsp.strand == '+' ? r0[3] : r0[4],
        vstopr: this.regionLst.length - 1,
        vstops: r9[5],
        vstopc: r9[8].item.hsp.strand == '+' ? r9[4] : r9[3]
    };
    if (r0[8].canvasxoffset < -this.move.styleLeft) {
        // vstart in hsp
        var x = this.sx2rcoord(-this.move.styleLeft);
        if (x) {
            this.dspBoundary.vstartc = parseInt(x.coord);
            this.dspBoundary.vstarts = x.sid;
        }
    }
    if (r9[8].canvasxoffset + r9[5] > this.hmSpan - this.move.styleLeft) {
        // vstop in hsp
        var x = this.sx2rcoord(this.hmSpan - this.move.styleLeft);
        if (x) {
            this.dspBoundary.vstopc = parseInt(x.coord);
            this.dspBoundary.vstops = x.sid;
        }
    }
};

Browser.prototype.weaver_cotton_spin = function (bbj) {
// arg is cottonbbj
    if (bbj.tklst.length == 0 && !bbj.init_bbj_param) return;

    if (bbj.regionLst.length == 0) {
        // clear data for cotton tracks?
        for (var j = 0; j < bbj.tklst.length; j++) {
            bbj.tklst[j].data = [];
        }
        bbj.drawTrack_browser_all();
        return;
    }
    bbj.weaver_cotton_dspboundary();

    this.cloak();
    if (bbj.init_bbj_param) {
        // loading cotton tracks for first time
        bbj.ajax_loadbbjdata(bbj.init_bbj_param);
    } else {
        var param = [], a, b;
        for (var j = 0; j < bbj.regionLst.length; j++) {
            var r = bbj.regionLst[j];
            param.push(r[0] + ',' + r[3] + ',' + r[4] + ',' +
            (this.entire.atbplevel ? (r[4] - r[3]) : r[5]));
            if (j == 0) a = r[3];
            if (j == bbj.regionLst.length - 1) b = r[4];
        }
        for (var i = 0; i < bbj.tklst.length; i++) {
            var tc = bbj.tklst[i].canvas;
            var ctx = tc.getContext('2d');
            ctx.font = '8pt Sans-serif';
            var y = tc.height / 2;
            var t = 'Loading data...';
            var w = ctx.measureText(t).width;
            var h = 14;
            var x = this.hmSpan / 2 - this.move.styleLeft - w / 2 - 20;
            ctx.fillStyle = colorCentral.background;
            ctx.fillRect(x, y - h / 2, w + 40, h);
            ctx.strokeStyle = colorCentral.foreground;
            ctx.strokeRect(x, y - h / 2, w + 40, h);
            ctx.fillStyle = colorCentral.foreground;
            ctx.fillText(t, x + 20, y + 4);
        }
        bbj.ajaxX('&runmode=' + RM_genome +
        '&regionLst=' + param.join(',') +
        '&startCoord=' + a + '&stopCoord=' + b);
    }
};


Browser.prototype.weavertoggle = function (width) {
    if (!this.weaver) return;
    if (this.weaver.iscotton) return; // cottonbbj does not deal with it
    var lst = this.tklst;
    if (width < this.hmSpan * W_togglethreshold) {
        this.weaver.mode = W_fine;
        for (var i = 0; i < lst.length; i++) {
            var t = lst[i];
            if (t.ft == FT_weaver_c) {
                /*
                 if(this.genome.iscustom || ((t.cotton in genome) && genome[t.cotton].iscustom)) {
                 // either target or query genome is custom
                 t.weaver.mode=W_rough;
                 t.qtc.stackheight=fullStackHeight;
                 } else {
                 }
                 */
                t.weaver.mode = W_fine;
                t.qtc.stackheight = weavertkstackheight;
            }
        }
        for (var n in this.weaver.q) {
            this.weaver.q[n].weaver.mode = W_fine;
        }
        return;
    }
// large view range, rough mode
    this.weaver.mode = W_rough;
    for (var i = 0; i < lst.length; i++) {
        var t = lst[i];
        if (t.ft == FT_weaver_c) {
            t.weaver.mode = W_rough;
            t.qtc.stackheight = fullStackHeight;
        }
    }
    this.weaver.insert = [];
    for (var n in this.weaver.q) {
        this.weaver.q[n].weaver.mode = W_rough;
    }
};


Browser.prototype.weaver_stitch_decor = function (tk, targetlst, qpoint, qx1, qx2, qstr) {
    glasspane.style.display = 'block';
    glasspane.width = this.hmSpan;
    glasspane.height = tk.canvas.height - fullStackHeight;
    glasspane.style.left = absolutePosition(this.hmdiv.parentNode)[0];
    glasspane.style.top = absolutePosition(tk.canvas)[1];
    var ctx = glasspane.getContext('2d');
    ctx.font = '10pt Arial';

    ctx.fillStyle = weavertkcolor_target;
    for (var i = 0; i < targetlst.length; i++) {
        var targetpoint = targetlst[i][0],
            t1 = targetlst[i][1],
            t2 = targetlst[i][2],
            tstr = targetlst[i][3];
        ctx.fillStyle = weavertkcolor_target;
        if (t1 > 0 && t2 > t1) {
            ctx.fillRect(t1 + this.move.styleLeft, 3, t2 - t1, 2);
        }
        var w = ctx.measureText(tstr).width;
        var y0 = 5, y1 = 8;
        var m = targetpoint + this.move.styleLeft;
        if (this.hmSpan - m > w + 10) {
            ctx.beginPath();
            ctx.moveTo(m, y0);
            ctx.lineTo(m + 4, y1);
            ctx.lineTo(m + w, y1);
            ctx.lineTo(m + w, y1 + 14);
            ctx.lineTo(m - 10, y1 + 14);
            ctx.lineTo(m - 10, y1);
            ctx.lineTo(m - 4, y1);
            ctx.closePath();
            ctx.fill();
            ctx.fillStyle = 'white';
            ctx.fillText(tstr, m - 3, y1 + 11);
        } else {
            ctx.beginPath();
            ctx.moveTo(m, y0);
            ctx.lineTo(m + 4, y1);
            ctx.lineTo(m + 10, y1);
            ctx.lineTo(m + 10, y1 + 14);
            ctx.lineTo(m - w, y1 + 14);
            ctx.lineTo(m - w, y1);
            ctx.lineTo(m - 4, y1);
            ctx.closePath();
            ctx.fill();
            ctx.fillStyle = 'white';
            ctx.fillText(tstr, m - w + 4, y1 + 11);
        }
    }
// stroke query
    ctx.fillStyle = tk.qtc.bedcolor;
    if (qx1 > 0 && qx2 > 0) {
        ctx.fillRect(qx1 + this.move.styleLeft, glasspane.height - 4, qx2 - qx1, 2);
    }
    w = ctx.measureText(qstr).width;
    y0 = glasspane.height - 4;
    y1 = y0 - 3;
    var m = qpoint + this.move.styleLeft;
    if (this.hmSpan - m > w + 10) {
        ctx.beginPath();
        ctx.moveTo(m, y0);
        ctx.lineTo(m + 4, y1);
        ctx.lineTo(m + w, y1);
        ctx.lineTo(m + w, y1 - 14);
        ctx.lineTo(m - 10, y1 - 14);
        ctx.lineTo(m - 10, y1);
        ctx.lineTo(m - 4, y1);
        ctx.closePath();
        ctx.fill();
        ctx.fillStyle = 'white';
        ctx.fillText(qstr, m - 3, y1 - 3);
    } else {
        ctx.beginPath();
        ctx.moveTo(m, y0);
        ctx.lineTo(m + 4, y1);
        ctx.lineTo(m + 10, y1);
        ctx.lineTo(m + 10, y1 - 14);
        ctx.lineTo(m - w, y1 - 14);
        ctx.lineTo(m - w, y1);
        ctx.lineTo(m - 4, y1);
        ctx.closePath();
        ctx.fill();
        ctx.fillStyle = 'white';
        ctx.fillText(qstr, m - w + 4, y1 - 3);
    }
};

function weaver_flip() {
    var tk = gflag.menu.tklst[0];
    if (tk.ft != FT_weaver_c) fatalError('but is not weavertk');
    var newtarget = tk.cotton;
    var b = gflag.menu.bbj;
    var oldtarget = b.genome.name;
    menu_hide();
    if (b.weaver.q[newtarget].regionLst.length == 0) {
        print2console('Cannot use ' + newtarget + ' as target: no regions in view range', 2);
        return;
    }
// check this tk
    if (!tk.reciprocal) {
        print2console('missing .reciprocal on calling tk', 2);
        return;
    }
    if (!(b.genome.name in tk.reciprocal)) {
        print2console('missing ' + oldtarget + ' to ' + newtarget + ' genomealign track', 2);
        return;
    }
// check other wtk
    for (var i = 0; i < b.tklst.length; i++) {
        var t2 = b.tklst[i];
        if (t2.ft == FT_weaver_c && t2.name != tk.name) {
            if (!t2.reciprocal) {
                print2console('missing .reciprocal on ' + t2.cotton, 2);
                return;
            }
            if (!(newtarget in t2.reciprocal)) {
                print2console('missing ' + t2.cotton + ' to ' + newtarget + ' genomealign track', 2);
                return;
            }
        }
    }
// swap color
    var a = weavertkcolor_target;
    weavertkcolor_target = tk.qtc.bedcolor;

// assemble hub for flushing
    var hub = [];

// wtk for old target
    var wtk = {
        type: FT2verbal[FT_weaver_c],
        url: tk.reciprocal[oldtarget],
        mode: 'show',
        color: a,
        querygenome: oldtarget,
        reciprocal: {},
        tracks: []
    };
    wtk.reciprocal[newtarget] = tk.url;
// collect url of other weavertk as its reciprocal
    for (var i = 0; i < b.tklst.length; i++) {
        var t2 = b.tklst[i];
        if (t2.ft != FT_weaver_c || t2.name == tk.name) continue;
        wtk.reciprocal[t2.cotton] = t2.url;
    }
    var newtargetnative = [];
    var nativelst = [];
// collect tracks from old target
    for (var i = 0; i < b.tklst.length; i++) {
        var t2 = b.tklst[i];
        if (tkishidden(t2)) continue;
        if (t2.ft != FT_weaver_c && t2.cotton == newtarget) {
            // cottontk, becoming free-standing in new target
            if (isCustom(t2.ft)) {
                hub.push(b.genome.replicatetk(t2));
            } else {
                newtargetnative.push(b.genome.replicatetk(t2));
            }
            continue;
        }
        if (b.targetBypassQuerytk(t2) || t2.ft == FT_weaver_c) continue;
        if (isCustom(t2.ft)) {
            wtk.tracks.push(b.genome.replicatetk(t2));
        } else {
            nativelst.push(b.genome.replicatetk(t2));
        }
    }
    if (nativelst.length > 0) {
        wtk.tracks.push({type: 'native_track', list: nativelst});
    }
    hub.push(wtk);
    if (newtargetnative.length > 0) {
        hub.push({type: 'native_track', list: newtargetnative});
    }

// collect wtk of other genomes
    for (var i = 0; i < b.tklst.length; i++) {
        var t2 = b.tklst[i];
        if (t2.ft != FT_weaver_c || t2.name == tk.name) continue;
        if (!(t2.cotton in tk.reciprocal)) {
            print2console('missing ' + t2.cotton + ' to ' + newtarget + ' genomealign track', 2);
            return;
        }
        var oldurl = t2.url;
        var wtk = {
            type: FT2verbal[FT_weaver_c],
            url: tk.reciprocal[t2.cotton],
            mode: 'show',
            color: t2.qtc.bedcolor,
            querygenome: t2.cotton,
            tracks: []
        };
        wtk.reciprocal = t2.reciprocal;
        var nativelst = [];
        var b2 = b.weaver.q[t2.cotton];
        for (var j = 0; j < b2.tklst.length; j++) {
            var t3 = b2.tklst[j];
            if (isCustom(t3.ft)) {
                wtk.tracks.push(b.genome.replicatetk(t3));
            } else {
                nativelst.push(b.genome.replicatetk(t3));
            }
        }
        if (nativelst.length > 0) {
            wtk.tracks.push({type: 'native_track', list: nativelst});
        }
        hub.push(wtk);
    }

// first clear custtk from other genomes
    for (var i = 0; i < b.tklst.length; i++) {
        var t2 = b.tklst[i];
        if (t2.ft != FT_weaver_c) continue;
        var g = genome[t2.cotton];
        for (var n in g.hmtk) {
            if (isCustom(g.hmtk[n].ft)) {
                delete g.hmtk[n];
            }
        }
    }
    b.cleanuphtmlholder();

    b.init_bbj_param = {
        hubjsoncontent: hub,
    };
// view range
    var b2 = b.weaver.q[newtarget];
    var r = null;
    for (var i = 0; i < b2.regionLst.length; i++) {
        var r2 = b2.regionLst[i];
        var start = r2[3];
        var stop = r2[4];
        if (i == b2.dspBoundary.vstartr) {
            if (r2[8].item.hsp.strand == '+') {
                start = b2.dspBoundary.vstartc;
            } else {
                stop = b2.dspBoundary.vstartc;
            }
        }
        if (i == b2.dspBoundary.vstopr) {
            if (r2[8].item.hsp.strand == '+') {
                stop = b2.dspBoundary.vstopc;
            } else {
                start = b2.dspBoundary.vstopc;
            }
        }
        if (r) {
            if (r[0] != r2[0]) {
                if (stop - start > r[2] - r[1]) {
                    r = [r2[0], start, stop];
                }
            } else {
                r[1] = Math.min(r[1], start);
                r[2] = Math.max(r[2], stop);
            }
        } else {
            r = [r2[0], start, stop];
        }
    }
    b.init_bbj_param.coord_rawstring = r[0] + ':' + r[1] + '-' + r[2];
    b.genome = b2.genome;
    if (showgenomelogo) {
        showgenomelogo(b.genome.name, true);
    }
    /* must reset genome and weaver
     */
    b.weaver.q = {};
    b.regionLst = [];

    b.ajax_loadbbjdata(b.init_bbj_param);
}

function weaver_showgenometk_closure(gn) {
    return function () {
        weaver_showgenometk(gn);
    };
}

function weaver_showgenometk(gn) {
    menu_shutup();
    menu.grandadd.style.display = 'block';
    var tbj = gflag.menu.bbj;
    var cbj = tbj.weaver.q[gn];
    if (cbj.regionLst.length == 0 || !cbj.regionLst[0][8]) {
        // init cottonbbj region
        if (tbj.weaver.mode == W_rough) {
            tbj.weaver_stitch2cotton(cbj.weaver.track);
        } else {
            tbj.weaver_hsp2cotton(cbj.weaver.track);
            // beware! r[8] xoffset is not set!
            for (var i = 0; i < cbj.regionLst.length; i++) {
                var r = cbj.regionLst[i];
                r[8].canvasxoffset = r[8].item.hsp.canvasstart;
            }
        }
    }
    if (cbj.dspBoundary.vstartr == undefined) {
        cbj.weaver_cotton_dspboundary();
    }
    cbj.grandshowtrack();
}

function stitchblob_insertright(blob, i, stp, w, xspacer) {
    var mark = blob[i][1];
    var markright = 9999;
    for (var j = 0; j < blob.length; j++) {
        if (j != i) {
            if (blob[j][0] > mark) {
                markright = Math.min(markright, blob[j][0]);
            }
        }
    }
    if (markright - mark >= w + xspacer) {
        stp.canvasstart = mark + xspacer;
        stp.canvasstop = stp.canvasstart + w;
        blob[i][1] = stp.canvasstop;
        return;
    }
// add to last
    mark = 0;
    for (var i = 0; i < blob.length; i++) {
        mark = Math.max(blob[i][1], mark);
    }
    stp.canvasstart = mark + xspacer;
    stp.canvasstop = stp.canvasstart + w;
    stitchblob_new(blob, stp);
}

function stitchblob_insertleft(blob, i, stp, w, xspacer) {
    var mark = blob[i][0];
    var markleft = 0;
    for (var j = 0; j < blob.length; j++) {
        if (j != i) {
            if (blob[j][1] < mark) {
                markleft = Math.max(markleft, blob[j][1]);
            }
        }
    }
    if (mark - markleft >= w + xspacer) {
        stp.canvasstop = mark - xspacer;
        stp.canvasstart = stp.canvasstop - w;
        blob[i][0] = stp.canvasstart;
        return true;
    }
    return false;
}

function stitchblob_new(blob, stp) {
    for (var j = 0; j < blob.length; j++) {
        if (Math.max(blob[j][0], stp.canvasstart) - Math.min(blob[j][1], stp.canvasstop) <= 10) {
            blob[j][0] = Math.min(blob[j][0], stp.canvasstart);
            blob[j][1] = Math.max(blob[j][1], stp.canvasstop);
            return;
        }
    }
    blob.push([stp.canvasstart, stp.canvasstop]);
}

function weaver_queryjumpui() {
    gflag.menu.bbj.weaver.q[gflag.menu.tklst[0].cotton].showjumpui({});
}

Browser.prototype.may_portcoord2target = function () {
};
/** __weaver__ ends **/