/**
 * Created by dpuru on 2/27/15.
 */

/*** __dsp__ ***/

Browser.prototype.displayedRegionParam = function () {
    /* only viewbox region
     optional arg: start coord of first region, stop coord of last region to cope with zoom in
     */
    var t = this.getDspStat();
    var jt = this.juxtaposition.type;
    var param = '&runmode=' + jt;
    if (this.is_gsv()) {
        // TODO remove itemlist parameter
        param += '&itemlist=on&startChr=' + t[0] + '&stopChr=' + t[2];
    } else {
        param += '&juxtaposeTk=' + this.juxtaposition.what + '&startChr=' + t[0] + '&stopChr=' + t[2];
    }
    if (arguments[0] != undefined && arguments[1] != undefined) {
        return param + "&startCoord=" + arguments[0] + "&stopCoord=" + arguments[1];
    } else {
        return param + "&startCoord=" + t[1] + "&stopCoord=" + t[3];
    }
};

Browser.prototype.displayedRegionParamMove = function () {
    var r1 = this.regionLst[0];
    var r2 = this.regionLst[this.regionLst.length - 1];
    var jt = this.juxtaposition.type;
    if (this.is_gsv()) {
        return "itemlist=on&startChr=" + r1[6] +
            "&startCoord=" + r1[3] +
            "&stopChr=" + r2[6] +
            "&stopCoord=" + r2[4] +
            "&sptotalnum=" + (this.entire.spnum - this.regionLst.length + 1);
    }
    return 'runmode=' + jt + '&juxtaposeTk=' + this.juxtaposition.what +
        "&startChr=" + r1[0] +
        "&startCoord=" + r1[3] +
        "&stopChr=" + r2[0] +
        "&stopCoord=" + r2[4] +
        "&sptotalnum=" + (this.entire.spnum - this.regionLst.length + 1);
};


Browser.prototype.displayedRegionParamPrecise = function () {
    /* use in operations that doesn't change dsp
     - add tracks
     - htest
     - ajax correlation
     - get data
     */
    var jt = this.juxtaposition.type;
    if (this.is_gsv()) {
        // only need to pass spnum of each item, but no need to pass item name, start/stop
        // as that's already in database
        var sizelst = []; // spnum in each item
        for (var i = 0; i < this.regionLst.length; i++) {
            sizelst.push(this.regionLst[i][5]);
        }
        var lastr = this.regionLst[this.regionLst.length - 1];
        return "itemlist=on&startChr=" + this.regionLst[0][6] +
            "&startCoord=" + this.regionLst[0][3] +
            "&stopChr=" + lastr[6] +
            "&stopCoord=" + lastr[4] +
            "&sptotalnum=" + (this.entire.atbplevel ? this.entire.length : (this.entire.spnum - i)) +
            "&allrss=" + sizelst.join(',');
    }
// by passing exact information on each region in collation mode (chr, start/stop, spnum)
// it saves a lot of computing on server side, so it's necessary
    var lst = [];
    for (var i = 0; i < this.regionLst.length; i++) {
        var r = this.regionLst[i];
        lst.push(r[0] + ',' + r[1] + ',' + r[2] + ',' + (this.entire.atbplevel ? (r[4] - r[3]) : r[5]));
    }
    return this.runmode_param() +
        "&regionLst=" + lst.join(',') +
        "&startCoord=" + this.regionLst[0][3] +
        "&stopCoord=" + this.regionLst[this.regionLst.length - 1][4];
};

Browser.prototype.displayedRegionParam_narrow = function () {
    /* for re-doing lr data from view range, for circlet view
     TODO check if it's alright
     */
    var lst = [];
    for (var i = this.dspBoundary.vstartr; i <= this.dspBoundary.vstopr; i++) {
        var r = this.regionLst[i];
        lst.push(r[0]);
        lst.push(r[3]);
        lst.push(r[4]);
        lst.push(10); // fictional spnum
    }
    var t = this.getDspStat();
    return '&runmode=' + this.genome.defaultStuff.runmode + '&regionLst=' + lst.join(',') +
        '&startCoord=' + t[1] +
        '&stopCoord=' + t[3];
};


Browser.prototype.getDspStat = function () {
// return array for saving status, see dbSchema.dia
    var startr = this.regionLst[this.dspBoundary.vstartr];
    var stopr = this.regionLst[this.dspBoundary.vstopr];
    if (this.is_gsv()) return [startr[6], this.dspBoundary.vstartc, stopr[6], this.dspBoundary.vstopc];
    return [startr[0], this.dspBoundary.vstartc, stopr[0], this.dspBoundary.vstopc];
};


Browser.prototype.atLeftBorder = function () {
// see if leftmost point in regionLst is at left border
    var b = this.border;
    var r = this.regionLst[0];
    if (this.is_gsv()) return (r[6] == b.lname) && (r[3] <= b.lpos);
    return (r[0] == b.lname) && (r[3] <= b.lpos);
};

Browser.prototype.atRightBorder = function () {
// see if rightmost point in regionLst is at right border
    var b = this.border;
    var r = this.regionLst[this.regionLst.length - 1];
    if (this.is_gsv()) return (r[6] == b.rname) && (r[4] >= b.rpos);
    return (r[0] == b.rname) && (r[4] >= b.rpos);
};

Browser.prototype.jsonDsp = function (data) {
    if (!data.regionLst) {
        if (this.weaver && this.weaver.iscotton) {
            /* a query genome bbj has its regionLst already made
             is not asking for regionLst from cgi
             */
            return;
        }
        fatalError('jsonDsp: regionLst missing');
    }
    /* update lots of stuff related with dsp:
     - border
     - move
     - entire
     - regionLst
     - dspBoundary
     */
    if (data.border) {
        this.border = {
            lname: data.border[0],
            lpos: data.border[1],
            rname: data.border[2],
            rpos: data.border[3]
        };
        if (this.genome.temporal_ymd) {
            this.border.lpos = 101;
        }
    }

    var in_gsv = this.is_gsv();

    this.entire.atbplevel = ('atbplevel' in data);
    if (!this.move.direction) {
        /** not panning, set regionLst anew **/
        this.regionLst = data.regionLst;
        if (this.entire.atbplevel) {
            /* atbplevel is solely decided by cgi
             entering bplevel must be in non-moving condition (moving cannot result in atbplevel)
             compute .bpwidth
             */
            var totallen = 0;
            for (var i = 0; i < this.regionLst.length; i++) {
                totallen += (this.regionLst[i][4] - this.regionLst[i][3]);
            }
            /* fixed an ooold bug here */
            if (totallen >= this.hmSpan * 3) {
                print2console('atbplevel but totallen>hmSpan*3', 2);
                totallen = this.hmSpan * 3;
            }
            var a = this.hmSpan * 3 / totallen;
            var b = parseInt(a);
            this.entire.bpwidth = b + ((a - b) >= .5 ? 1 : 0);

            /* atbplevel special update:
             regionLst[i][5] to be region plotting width
             entire.spnum to be plotting width of everything...
             r[7] doesn't matter
             */
            for (i = 0; i < this.regionLst.length; i++) {
                var r = this.regionLst[i];
                r[5] = this.entire.bpwidth * (r[4] - r[3]);
            }
        } else {
            for (var i = 0; i < this.regionLst.length; i++) {
                var r = this.regionLst[i];
                // r[5] is given as spnum
                r[7] = (r[4] - r[3]) / r[5];
            }
        }
        this.updateEntire();
        // compute .styleLeft for all movable components
        if (!('viewStart' in data)) {
            print2console(data.regionLst, 0);
            fatalError("jsonDsp: viewStart missing when not moving");
        }
        var ridx = data.viewStart[0],
            coord = data.viewStart[1];
        var x = this.cumoffset(ridx, coord);
        if (x == -1) fatalError('viewStart out of range: ' + ridx + ' ' + coord);
        this.move.styleLeft = parseInt(-x);
        this.updateDspBoundary();
        this.scalebarSlider_fill();
        this.drawNavigator();
        return;
    }

    /* panning
     beware: atbplevel, region data passed from CGI have # of bp as [5], need to multiply by entire.bpwidth
     entire.bpwidth must have already been determined as above, and won't change during moving
     */
    for (var i = 0; i < data.regionLst.length; i++) {
        var r = data.regionLst[i];
        if (this.entire.atbplevel) {
            r[5] *= this.entire.bpwidth;
        } else {
            r[7] = (r[4] - r[3]) / r[5];
        }
    }

// determine whether to merge regions
    this.move.merge = false;
    if (in_gsv) {
        if (this.move.direction == 'l') {
            var n = data.regionLst[data.regionLst.length - 1]; // new
            var o = this.regionLst[0]; // old
            if (n[6] == o[6]) {
                this.move.merge = true;
                this.move.offsetShift = n[5];
            }
        } else {
            var n = data.regionLst[0]; // new
            var o = this.regionLst[this.regionLst.length - 1]; // old
            if (n[6] == o[6]) {
                this.move.merge = true;
                this.move.offsetShift = o[5];
            }
        }
    } else {
        if (this.move.direction == 'l') {
            var n = data.regionLst[data.regionLst.length - 1]; // new
            var o = this.regionLst[0]; // old
            // only look at chr name and region bstart!
            if (n[0] == o[0] && n[1] == o[1]) {
                this.move.merge = true;
                // set move.offsetShift for shifting old bed items
                this.move.offsetShift = n[5];
            }
        } else {
            var n = data.regionLst[0]; // new
            var o = this.regionLst[this.regionLst.length - 1]; // old
            // only look at chr name and region bstop!
            if (n[0] == o[0] && n[2] == o[2]) {
                this.move.merge = true;
                // set move.offsetShift for shifting new bed items
                this.move.offsetShift = o[5];
            }
        }
    }
    /* special attention --
     move.styleLeft has been set to a new value during move,
     where .style.left of all movable components were set to it.
     If expose on right, .styleLeft won't need to be changed,
     but if on left, it has to be changed to accommondate new data.

     1. find current view region start by setting
     dspBoundary.vstartr .vstarts using old regionLst
     2. update regionLst
     if .vstartr==0, and move to left, and merge: need to shift .vstartr .vstarts
     3. build dspBoundary
     */
// update regionLst
    var newlst = data.regionLst;
    if (this.move.direction == 'l') {
        if (this.move.merge) {
            var lastr = newlst[newlst.length - 1];
            this.regionLst[0][3] = lastr[3]; // dstart
            this.regionLst[0][5] += lastr[5]; // # summary points
            this.move.styleLeft -= lastr[5];
            newlst.pop();
        }
        for (var i = 0; i < newlst.length; i++) {
            this.move.styleLeft -= newlst[i][5] - regionSpacing.width;
        }
        this.regionLst = newlst.concat(this.regionLst);
        if (this.weaver) {
            for (var i = 0; i < newlst.length; i++) {
                this.weaver.insert.unshift([]);
            }
        }
    } else {
        if (this.move.merge) {
            var firstr = newlst[0];
            var lastr = this.regionLst[this.regionLst.length - 1];
            lastr[4] = firstr[4]; // dstop
            lastr[5] += firstr[5]; // # summary points
            newlst.shift();
        }
        this.regionLst = this.regionLst.concat(newlst);
        if (this.weaver) {
            for (var i = 0; i < newlst.length; i++) {
                this.weaver.insert.push([]);
            }
        }
    }
    this.move.styleLeft = parseInt(this.move.styleLeft);
    this.updateEntire();
    this.updateDspBoundary();
    this.scalebarSlider_fill();
    this.drawNavigator();
};


Browser.prototype.updateDspBoundary = function () {
    /* call after zoom level might have been changed
     updates .dspBoundary and .entire
     requires:
     move.styleLeft
     regionLst, where [5] region plot width must be ready
     */
    var d = this.dspBoundary;
    var t = this.sx2rcoord(-this.move.styleLeft);
// must not fail!
    if (!t) fatalError('null vstart for ' + this.horcrux);
    d.vstartr = t.rid;
    d.vstarts = t.sid;
    d.vstartc = parseInt(t.coord);
    t = this.sx2rcoord(this.hmSpan - this.move.styleLeft);
    if (!t) {
        d.vstopr = this.regionLst.length - 1;
        var r = this.regionLst[d.vstopr];
        d.vstops = r[5];
        d.vstopc = r[4];
    } else {
        d.vstopr = t.rid;
        d.vstops = t.sid;
        d.vstopc = parseInt(t.coord);
    }
    this.updateDspstat();
};


Browser.prototype.updateEntire = function () {
    /* only called in jsonDsp
     entire.atbplevel must be determined
     !! only updates entire, do not meddle with region attributes !!
     r[5] and r[7] is not to be affected by weaver.insert
     r[5] is determined by cgi
     r[7] is calculated when new region is added
     */
    this.entire.length = 0;
    var actualsp = 0;
    for (var i = 0; i < this.regionLst.length; i++) {
        var r = this.regionLst[i];
        this.entire.length += r[4] - r[3];
        actualsp += r[5];
    }
    var i = this.regionLst.length - 1;
    this.entire.spnum = this.cumoffset(i, this.regionLst[i][4]);
    this.entire.summarySize = this.entire.length / actualsp;
};

function menuJuxtapose() {
    var bbj = gflag.menu.bbj;
    var tk = gflag.menu.tklst[0];
    if (tk.ft != FT_bed_n && tk.ft != FT_bed_c && tk.ft != FT_anno_n && tk.ft != FT_anno_c) {
        print2console('tk ft not supported', 2);
        return;
    }
    var c = 0;
    for (var i = 0; i < tk.data.length; i++) {
        c += tk.data[i].length;
    }
    if (c >= 150) {
        print2console('Cannot run juxtaposition, too many items in the view range. Try zoom in.', 2);
        menu_hide();
        return;
    }
    if (isCustom(tk.ft)) {
        bbj.juxtaposition.type = RM_jux_c;
        bbj.juxtaposition.what = tk.url;
        bbj.juxtaposition.note = 'custom bed track';
    } else {
        bbj.juxtaposition.type = RM_jux_n;
        bbj.juxtaposition.what = tk.name;
        bbj.juxtaposition.note = tk.label;
    }
    bbj.cloak();
    print2console("juxtaposing " + bbj.juxtaposition.note + "...", 0);
    var param = bbj.displayedRegionParam() + "&changeGF=on";
    bbj.ajaxX(param);
    menu_hide();
    var synclst = null;
    if (gflag.syncviewrange) {
        synclst = gflag.syncviewrange.lst;
    }
    if (synclst) {
        var j = bbj.juxtaposition;
        for (var i = 0; i < synclst.length; i++) {
            synclst[i].juxtaposition = {type: j.type, what: j.what, note: j.note};
            synclst[i].ajaxX(param);
        }
    }
}


Browser.prototype.gsv_turnoff = function () {
    this.turnoffJuxtapose(true);
    if (gflag.syncviewrange) {
        for (var i = 0; i < gflag.syncviewrange.lst.length; i++) {
            gflag.syncviewrange.lst[i].turnoffJuxtapose(true);
        }
    }
};

function menuTurnoffJuxtapose() {
    gflag.menu.bbj.turnoffJuxtapose(true);
    if (gflag.syncviewrange) {
        for (var i = 0; i < gflag.syncviewrange.lst.length; i++) {
            gflag.syncviewrange.lst[i].turnoffJuxtapose(true);
        }
    }
}

Browser.prototype.turnoffJuxtapose = function (doajax) {
    /* argument is boolean, if true, will run ajax and show data over default region
     no syncing here
     */
    menu_hide();
    var oldjt = this.juxtaposition.type;
    if (oldjt == this.genome.defaultStuff.runmode) return;
    this.runmode_set2default();
    if (oldjt == RM_jux_n || oldjt == RM_jux_c) {
        if (doajax) {
            this.cloak();
            this.ajaxX(this.displayedRegionParam() + "&changeGF=on");
        }
    } else if (oldjt == RM_gsv_c || oldjt == RM_gsv_kegg || oldjt == RM_protein) {
        /* in case of gsv, border must be changed back!
         TODO border be bbj attribute
         */
        var s = this.genome.scaffold.current;
        this.border = {lname: s[0], lpos: 0, rname: s[s.length - 1], rpos: this.genome.scaffold.len[s[s.length - 1]]};
        if (this.genesetview.savelst) {
            // golden has this
            delete this.genesetview.savelst;
        }
        if (doajax) {
            this.cloak();
            var c = this.defaultposition();
            this.ajaxX(this.runmode_param() + '&imgAreaSelect=on&startChr=' + c[0] + '&startCoord=' + c[1] + '&stopChr=' + c[2] + '&stopCoord=' + c[3]);
        }
    } else {
        fatalError('turnoffJuxtapose: unknown juxtaposition.type ' + oldjt);
    }
};

Browser.prototype.updateDspstat = function () {
// updates information about heatmap view (dsp, tracks)
// need to detect uninitiated bbj
    if (this.regionLst.length == 0) {
        print2console('updateDspstat saw an empty regionLst', 2);
        return;
    }
    var hd = this.header_dspstat;
    var W = this.header_naviholder ? this.header_naviholder.parentNode.clientWidth : this.hmSpan;
    if (hd && hd.allowupdate) {
        if (this.is_gsv()) {
            hd.className = 'header_r';
            if (hd.nocoord) {
                hd.innerHTML = '&#10005; GSV';
            } else {
                var w = W -
                    (this.header_naviholder ? this.header_naviholder.clientWidth : 0) -
                    (this.header_resolution ? this.header_resolution.clientWidth : 0) -
                    (this.header_utilsholder ? this.header_utilsholder.clientWidth : 0) - 200;
                var perc = Math.min(100, parseInt((this.entire.atbplevel ? this.hmSpan / this.entire.bpwidth : this.hmSpan * this.entire.summarySize) * 100 / this.genesetview.totallen));
                hd.innerHTML = w > 250 ? 'Showing ' + (perc < 100 ? perc + '% of' : '') + ' entire set | &#10005;' :
                    (w > 150 ? '&#10005; turn off GSV' : '&#10005; GSV');
            }
        } else {
            hd.className = 'header_b';
            if (hd.nocoord) {
                // only show chr name
                var x = this.getDspStat();
                var t = x[0] == x[2] ? x[0] : (x[0] + '-' + x[2]);
                hd.innerHTML = t.length > 20 ? t.substr(0, 15) + '...' : t;
            } else {
                var r1 = this.regionLst[this.dspBoundary.vstartr];
                var r2 = this.regionLst[this.dspBoundary.vstopr];
                stripChild(hd, 0);
                hd.innerHTML =
                    (gflag.dspstat_showgenomename ? this.genome.name + '&nbsp' : '') +
                    (this.genome.defaultStuff.runmode == RM_genome ?
                        ((r1[0] == r2[0]) ?
                        r1[0] + ':' + this.dspBoundary.vstartc + '-' + this.dspBoundary.vstopc :
                        'from ' + r1[0] + ', ' + this.dspBoundary.vstartc + ' to ' + r2[0] + ', ' + this.dspBoundary.vstopc) :
                        (month2sstr[Math.floor(this.dspBoundary.vstartc / 100)] + ' ' + (this.dspBoundary.vstartc % 100) + ', ' + r1[0] + ' to ' + month2sstr[Math.floor(this.dspBoundary.vstopc / 100)] + ' ' + (this.dspBoundary.vstopc % 100) + ', ' + r2[0]));
            }
        }
    }
    if (this.header_resolution) {
        if (W < 50) {
            this.header_resolution.innerHTML = '';
            return;
        }
        var s;
        var unit;
        switch (this.genome.defaultStuff.runmode) {
            case RM_genome:
                unit = 'bp';
                break;
            case RM_yearmonthday:
                unit = 'day';
                break;
            default:
                fatalError('updateDspstat: unknown .genome.runmode');
        }
        if (this.entire.atbplevel) {
            s = W > 250 ?
            'One ' + unit + ' spans ' + this.entire.bpwidth + ' pixels' :
            this.entire.bpwidth + ' px/' + unit;
        } else {
            var v = this.entire.summarySize > 5 ? Math.floor(this.entire.summarySize) : this.entire.summarySize.toPrecision(2);
            s = W > 250 ?
            'One pixel spans ' + v + ' ' + unit :
            v + ' ' + unit + '/px';
        }
        this.header_resolution.innerHTML = s;
    }
};

Browser.prototype.runmode_set2default = function () {
    this.juxtaposition.type = this.genome.defaultStuff.runmode;
    this.juxtaposition.note =
        this.juxtaposition.what = RM2verbal[this.genome.defaultStuff.runmode];
};

Browser.prototype.runmode_param = function () {
// handyman
    if (this.is_gsv()) {
        // TODO enable it for gsv
        print2console('not supposed to call runmode_param() while in gsv mode', 2);
        return '';
    }
    var rm = this.juxtaposition.type;
    if (rm == RM_yearmonthday)
        return 'runmode=' + rm;
    if (rm == RM_genome)
        return 'runmode=' + rm;
    return 'runmode=' + rm + '&juxtaposeTk=' + this.juxtaposition.what;
};

function browser_ruler_mover(event) {
    var bbj = gflag.browser;
    var h = bbj.sx2rcoord(event.clientX + document.body.scrollLeft - absolutePosition(bbj.hmdiv.parentNode)[0] - bbj.move.styleLeft, true);
    if (!h) return;
    pica_go(event.clientX, absolutePosition(event.target)[1] + event.target.clientHeight - 10 - document.body.scrollTop);
    if (h.gap) {
        picasays.innerHTML = bbj.tellsgap(h);
    } else {
        picasays.innerHTML = h.str + ' <span style="font-size:10px;">drag to zoom in</span>';
    }
}

Browser.prototype.tellsgap = function (hit) {
    return '<div style="padding:5px;font-size:16px;color:white">' + hit.gap + ' bp gap on ' + this.genome.name + '<div class=picadim>' + hit.str + '</div></div>';
};


/*** __dsp__ ends ***/



function menu_bbjconfig_show(event) {
// clicking gear button in bbj header, also show genome info option
    menu_shutup();
    var bbj = gflag.browser;
    menu.bbjconfig.style.display =
        menu.c33.style.display = 'block';
    menu.c33.firstChild.innerHTML = 'About ' + bbj.genome.name;
    menu.c33.genome = bbj.genome.name;
    menu.bbjconfig.leftwidthdiv.style.display = bbj.hmheaderdiv ? 'table-cell' : 'none';
    menu.bbjconfig.setbutt.style.display = 'none';
    menu.bbjconfig.allow_packhide_tkdata.checked = gflag.allow_packhide_tkdata;
    menu_show_beneathdom(0, event.target);
}

function menu_changehmspan(event) {
// called by pushing button, show indicator3 for how hmspan would be adjusted
    var bbj = gflag.menu.bbj;
    var t = indicator6;
    var w;
    if (t.style.display == 'none') {
        var pos = absolutePosition(bbj.hmdiv.parentNode);
        t.style.display = 'block';
        t.style.left = pos[0];
        t.style.top = pos[1];
        t.style.height = bbj.hmdiv.parentNode.clientHeight + bbj.ideogram.canvas.parentNode.parentNode.clientHeight + bbj.decordiv.parentNode.clientHeight;
        w = bbj.hmSpan;
    } else {
        w = parseInt(t.style.width);
    }
    switch (event.target.which) {
        case 1:
            w += 100;
            break;
        case 2:
            if (w <= min_hmspan) {
                print2console('Cannot shrink width any further', 2);
                w = min_hmspan;
            } else {
                w = Math.max(w - 100, min_hmspan);
            }
            break;
        case 3:
            w += 10;
            break;
        case 4:
            if (w <= min_hmspan) {
                print2console('Cannot shrink width any further', 2);
                w = min_hmspan;
            } else {
                w = Math.max(w - 10, min_hmspan);
            }
            break;
    }
    t.style.width = w;
    var b = menu.bbjconfig.setbutt;
    b.style.display = 'table-cell';
    b.disabled = false;
}

function menu_hmspan_set(event) {
    var newhmspan = parseInt(indicator6.style.width);
    var bbj = gflag.menu.bbj;
    if (newhmspan == bbj.hmSpan) {
        print2console('Same as current width', 2);
        return;
    }
    bbj.sethmspan_refresh(newhmspan);
}

Browser.prototype.sethmspan_refresh = function (val) {
    this.hmSpan = val;
    this.applyHmspan2holders();
    this.cloak();
    this.ajaxX(this.displayedRegionParam() + '&imgAreaSelect=on');
};

function menu_changeleftwidth(event) {
    var bbj = gflag.menu.bbj;
    var w = bbj.leftColumnWidth;
    switch (event.target.which) {
        case 1:
            w += 20;
            break;
        case 2:
            w = Math.max(10, w - 20);
            break;
        case 3:
            w += 5;
            break;
        case 4:
            w = Math.max(10, w - 5);
            break;
    }
    bbj.leftColumnWidth = w;
    for (var i = 0; i < bbj.tklst.length; i++) {
        bbj.drawTrack_header(bbj.tklst[i]);
    }
    bbj.drawATCGlegend(false);
//bbj.mcmPlaceheader();
}
