/**
 * Created by dpuru on 2/27/15.
 */
/*** __navi__ navigator ***/

Browser.prototype.clicknavibutt = function (param) {
    if (this.is_gsv()) {
        if (param && param.d) {
            param.d.innerHTML = 'working...';
        }
        this.gsv_turnoff();
        return;
    }
    var p2 = {};
    if (param.d) {
        p2.d = param.d;
    } else {
        p2.x = param.x;
        p2.y = param.y;
    }
    p2.showchr = this.navigator ? false : true;
    this.showjumpui(p2);
    menu.relocate.coord.focus();
};

Browser.prototype.drawNavigator = function () {
    var _n = this.navigator;
    if (!_n || !_n.canvas) return;
    _n.blockwidth = [];
    _n.blocks = []; // don't use during gsv
    var c = _n.canvas;
    c.height = _n.chrbarheight + 2 * _n.hlspacing + 2 + _n.rulerheight;
    var ctx = c.getContext('2d');
    ctx.clearRect(0, 0, c.width, c.height);
    if (this.is_gsv()) {
        var _s = this.genesetview;
        var lst = _s.lst;
        var totalbp = 0;
        for (var i = 0; i < lst.length; i++) {
            totalbp += lst[i].stop - lst[i].start;
        }
        _n.totalbp = totalbp;
        _s.lstsf = totalbp / c.width;
        if (this.juxtaposition.type == RM_protein) {
            /* draw box for protein, which is collection of exon, partly duplicates
             gene exons are to be in good order
             */
            var pastgene = _s.exon2gene[lst[0].name];
            var a = true;
            var x1 = 0;
            var x2 = (lst[0].stop - lst[0].start) / _s.lstsf;
            for (var i = 1; i < lst.length; i++) {
                var w = (lst[i].stop - lst[i].start) / _s.lstsf;
                _n.blockwidth.push(w);
                var thisgene = _s.exon2gene[lst[i].name];
                if (thisgene == pastgene) {
                    x2 += w;
                } else {
                    ctx.fillStyle = a ? _s.minichr_filla : _s.minichr_fillb;
                    a = !a;
                    ctx.fillRect(x1, _n.hlspacing + 1, x2 - x1, _n.chrbarheight);
                    var ww = ctx.measureText(pastgene).width;
                    if (ww < x2 - x1) {
                        ctx.fillStyle = _s.minichr_text;
                        ctx.fillText(pastgene, x1 + (x2 - x1 - ww) / 2, _n.hlspacing + 12);
                    }
                    pastgene = thisgene;
                    x1 = x2;
                    x2 = x1 + w;
                }
            }
            ctx.fillStyle = a ? _s.minichr_filla : _s.minichr_fillb;
            ctx.fillRect(x1, _n.hlspacing + 1, x2 - x1, _n.chrbarheight);
            var ww = ctx.measureText(pastgene).width;
            if (ww < x2 - x1) {
                ctx.fillStyle = _s.minichr_text;
                ctx.fillText(pastgene, x1 + (x2 - x1 - ww) / 2, _n.hlspacing + 12);
            }
        } else {
            /* regular gsv
             see if all gsv items are in same chr, if so, draw the chr ideogram and mark items out as boxes
             var same_chr=true;
             if(same_chr) {
             return;
             }
             */
            // not in same chr, draw all the gsv items
            var lst = _s.lst;
            var x = 0;
            for (var i = 0; i < lst.length; i++) {
                var tlen = lst[i].stop - lst[i].start;
                ctx.fillStyle = (i % 2 == 0) ? _s.minichr_filla : _s.minichr_fillb;
                var w = tlen / _s.lstsf;
                _n.blockwidth.push(w);
                ctx.fillRect(x, _n.hlspacing + 1, w, _n.chrbarheight);
                var w2 = ctx.measureText(lst[i].name).width;
                if (w2 <= w) {
                    ctx.fillStyle = _s.minichr_text;
                    ctx.fillText(lst[i].name, x + (w - w2) / 2, _n.hlspacing + 12);
                }
                x += w;
            }
        }
        // highlight
        var vstartr_coord, vstopr_coord;
        var x = 0;
        var r = this.regionLst[this.dspBoundary.vstartr];
        for (i = 0; i < lst.length; i++) {
            if (lst[i].name == r[6]) {
                vstartr_coord = lst[i].start;
                break;
            }
            x += _n.blockwidth[i];
        }
        // here must use r[7] but not this.entire.summarySize, why??
        x += (r[3] + this.dspBoundary.vstarts * (this.entire.atbplevel ? 1 : r[7]) - vstartr_coord) / _s.lstsf;
        var x2 = 0;
        r = this.regionLst[this.dspBoundary.vstopr];
        for (i = 0; i < lst.length; i++) {
            if (lst[i].name == r[6]) {
                vstopr_coord = lst[i].start;
                break;
            }
            x2 += _n.blockwidth[i];
        }
        x2 += (r[3] + this.dspBoundary.vstops * (this.entire.atbplevel ? 1 : r[7]) - vstopr_coord) / _s.lstsf;
        // blue box
        ctx.strokeStyle = 'blue';
        ctx.strokeRect(x == 0 ? 0 : x - .5, .5, x2 - x, _n.chrbarheight + 1 + 2 * _n.hlspacing);
        return;
    }
    var chrlst = [this.regionLst[this.dspBoundary.vstartr][0]];
    for (var i = this.dspBoundary.vstartr + 1; i <= this.dspBoundary.vstopr; i++) {
        if (!thinginlist(this.regionLst[i][0], chrlst))
            chrlst.push(this.regionLst[i][0]);
    }
    var totalbp = 0;
    for (i = 0; i < chrlst.length; i++) {
        totalbp += this.genome.scaffold.len[chrlst[i]];
    }
    _n.totalbp = totalbp;
    var x = 0;
    var lastchrxoffset = 0, firstchrwidth = 0, lastchrwidth = 0;
    var imagewidth = c.width;
    for (i = 0; i < chrlst.length; i++) {
        var chrlen = this.genome.scaffold.len[chrlst[i]];
        var w = chrlen * (imagewidth - chrlst.length - 1) / totalbp;
        _n.blockwidth.push(w);
        _n.blocks.push([chrlst[i], 0, chrlen]);
        if (i == 0) firstchrwidth = w;
        if (i == chrlst.length - 1) lastchrwidth = w;
        lastchrxoffset = x + 1;
        drawIdeogramSegment_simple(
            this.genome.getcytoband4region2plot(chrlst[i], 0, this.genome.scaffold.len[chrlst[i]], w),
            ctx, x, _n.hlspacing + 1, w, ideoHeight, false);
        x += w + 1;
    }
// blue box
    var r = this.regionLst[this.dspBoundary.vstartr];
    var coord = r[3] + this.dspBoundary.vstarts * (this.entire.atbplevel ? 1 : this.entire.summarySize);
    var hlstart = parseInt(coord * firstchrwidth / this.genome.scaffold.len[r[0]]);
    r = this.regionLst[this.dspBoundary.vstopr];
    coord = r[3] + this.dspBoundary.vstops * (this.entire.atbplevel ? 1 : this.entire.summarySize);
    var hlstop = Math.max(hlstart + 1, parseInt(lastchrxoffset + coord * lastchrwidth / this.genome.scaffold.len[r[0]]));
    ctx.strokeStyle = 'blue';
    ctx.strokeRect(Math.max(0, hlstart - .5), .5, hlstop - hlstart, _n.chrbarheight + 2 * _n.hlspacing + 1);
// ruler
    if (_n.show_ruler && chrlst.length == 1 && _n.rulerheight > 0) {
        var chrlen = this.genome.scaffold.len[chrlst[0]];
        ctx.fillStyle = colorCentral.foreground_faint_5;
        drawRuler_basepair(ctx, chrlen, imagewidth, 0, _n.chrbarheight + 2 * _n.hlspacing + 4);
    }
};

function drawRuler_basepair(ctx, bplen, plotwidth, x, y) {
    /* draw horizontal basepair ruler
     canvas height is fixed to 20px
     color must already been set
     */
    var sf = plotwidth / bplen;
    var ulst = ['', '0', '00', 'K', '0K', '00K', 'M', '0M', '00M'];
    var k = -1;
    for (var i = ulst.length - 1; i >= 0; i--) {
        if (Math.pow(10, i) * 2 < bplen) {
            k = i;
            break;
        }
    }
    if (k == -1) {
        print2console('cannot draw ideogram ruler', 2);
        return;
    }
    var ulen = Math.pow(10, k); // unit bp length
    var unum = parseInt(bplen / ulen);
    var uplot = ulen * sf; // unit plot width
    ctx.fillRect(0, y, uplot * unum, 1);
    ctx.fillRect(0, y, 1, 5);
    ctx.fillText(0, 0, y + 15);
    var x = 0;
    var lasttextpos = 0;
    for (i = 1; i <= unum; i++) {
        ctx.fillRect(x + uplot / 4, y, 1, 4); // 1st quarter
        ctx.fillRect(x + uplot / 2, y, 1, 4); // half
        ctx.fillRect(x + uplot * 3 / 4, y, 1, 4); // 3rd quarter
        ctx.fillRect(x + uplot, y, 1, 5);
        var w = i.toString() + ulst[k];
        var ww = ctx.measureText(w).width;
        x += uplot;
        if (x > lasttextpos + ww + 3) {
            ctx.fillText(w, i == unum ? x - ww + 1 : x - ww / 2, 15 + y);
            lasttextpos = x;
        }
    }
}


Browser.prototype.navigatorSeek = function (x) {
// return [chr/item name, coord]
    if (this.is_gsv()) {
        var cx = 0;
        for (var i = 0; i < this.navigator.blockwidth.length; i++) {
            var thisx = this.navigator.blockwidth[i];
            if (cx + thisx >= x) {
                var b = this.genesetview.lst[i];
                return [b.name, b.start + parseInt((b.stop - b.start) * (x - cx) / thisx)];
            }
            cx += thisx;
        }
        return [this.genesetview.lst[i - 1].name, this.genesetview.lst[i - 1].stop];
    }
    var cx = 0;
    for (var i = 0; i < this.navigator.blockwidth.length; i++) {
        var thisx = this.navigator.blockwidth[i];
        if (cx + thisx >= x) {
            var b = this.navigator.blocks[i];
            return [b[0], parseInt((b[2] - b[1]) * (x - cx) / thisx)];
        }
        cx += thisx;
    }
    return [this.navigator.blocks[i - 1][0], this.navigator.blocks[i - 1][2]];
};
function navigator_tooltip(event) {
    var bbj = gflag.browser;
    if (bbj.juxtaposition.type == RM_protein) return;
    var pos = absolutePosition(event.target);
    pica_go(event.clientX, pos[1] + event.target.clientHeight - document.body.scrollTop - 13);
    var x = event.clientX + document.body.scrollLeft - pos[0]; // offset on canvas
    var re = bbj.navigatorSeek(x);
    picasays.innerHTML = re[0] + ', ' + re[1];
}

function navigatorMD(event) {
    /* both on trunk and spliter
     */
    if (event.button != 0) return; // only process left click
    event.preventDefault();
    var pos = absolutePosition(event.target);
    indicator.style.display = "block";
    indicator.style.left = event.clientX + document.body.scrollLeft;
    indicator.style.top = pos[1];
    indicator.style.width = 1;
    indicator.style.height = event.target.clientHeight;
    gflag.navigator = {
        bbj: gflag.browser,
        canvas: event.target,
        x: event.clientX + document.body.scrollLeft,
        xcurb: pos[0]
    };
    document.body.addEventListener("mousemove", navigatorM, false);
    document.body.addEventListener("mouseup", navigatorMU, false);
}
function navigatorM(event) {
    var currx = event.clientX + document.body.scrollLeft;
    var n = gflag.navigator;
    if (currx > n.x) {
        if (currx < n.xcurb + n.canvas.width) {
            indicator.style.width = currx - n.x;
        }
    } else {
        if (currx >= n.xcurb) {
            indicator.style.width = n.x - currx;
            indicator.style.left = currx;
        }
    }
}

function navigatorMU(event) {
    document.body.removeEventListener("mousemove", navigatorM, false);
    document.body.removeEventListener("mouseup", navigatorMU, false);
    indicator.style.display = 'none';
    var n = gflag.navigator;
    var x = parseInt(indicator.style.left) - n.xcurb; // relative to minichr canvas div
    var w = parseInt(indicator.style.width);
    if (w == 0) return;
    var jt = n.bbj.juxtaposition.type;
    var coord1 = n.bbj.navigatorSeek(x);
    var coord2 = n.bbj.navigatorSeek(x + w);
    if (coord1[0] == coord2[0] && coord1[1] == coord2[1]) return;

    if (n.bbj.is_gsv()) {
        /* if selected region is too small to fit in the entire genomeheatmap,
         need to expand it so it won't yield "truncated" hmtks
         */
        var hmbp = n.bbj.hmSpan / MAXbpwidth_bold;
        var wbp = w * n.bbj.genesetview.lstsf; // bp spanned by indicator box
        if (wbp < hmbp) {
            var neww = Math.ceil(hmbp * this.genesetview.lstsf);
            x -= Math.ceil((neww - w) / 2);
            w = neww;
            if (x < 0) {
                x = 0;
            } else if (x + w > this.navigator.canvas.width) {
                x = this.navigator.canvas.width - w;
            }
        }
        n.bbj.cloak();
        var samestring = "itemlist=on&imgAreaSelect=on&statusId=" + n.bbj.statusId +
            "&startChr=" + coord1[0] + "&startCoord=" + coord1[1] +
            "&stopChr=" + coord2[0] + "&stopCoord=" + coord2[1] +
            (n.bbj.entire.atbplevel ? '&atbplevel=on' : '');
        n.bbj.ajaxX(samestring);
        return;
    }
    n.bbj.weavertoggle(n.bbj.navigator.totalbp * w / n.bbj.navigator.canvas.width);
    var param = 'imgAreaSelect=on&' + n.bbj.runmode_param() + '&startChr=' + coord1[0] + '&startCoord=' + coord1[1] + '&stopChr=' + coord2[0] + '&stopCoord=' + coord2[1];
    n.bbj.cloak();
    n.bbj.ajaxX(param);
    if (gflag.syncviewrange) {
        for (var i = 0; i < gflag.syncviewrange.lst.length; i++) {
            gflag.syncviewrange.lst[i].ajaxX(param);
        }
    }
}

/* c18_canvas, showing only one chr
 */
function c18_m_pica(event) {
    var c = event.target;
    var p = absolutePosition(c);
    picasays.innerHTML = c.chrom + ' ' + parseInt(c.bpperpx * (event.clientX + document.body.scrollLeft - p[0]));
    pica_go(event.clientX, p[1] - document.body.scrollTop + c.height - 10);
}

function c18_md(event) {
    if (event.button != 0) return;
    event.preventDefault();
    var pos = absolutePosition(event.target);
    indicator.style.display = 'block';
    indicator.style.left = event.clientX + document.body.scrollLeft;
    indicator.style.top = pos[1];
    indicator.style.width = 1;
    indicator.style.height = event.target.clientHeight;
    gflag.c18 = {
        canvas: event.target,
        x: event.clientX + document.body.scrollLeft,
        xcurb: pos[0]
    };
    document.body.addEventListener('mousemove', c18_mm, false);
    document.body.addEventListener('mouseup', c18_mu, false);
}
function c18_mm(event) {
    var currx = event.clientX + document.body.scrollLeft;
    var n = gflag.c18;
    if (currx > n.x) {
        if (currx < n.xcurb + n.canvas.width) {
            indicator.style.width = currx - n.x;
        }
    } else {
        if (currx >= n.xcurb) {
            indicator.style.width = n.x - currx;
            indicator.style.left = currx;
        }
    }
}
function c18_mu(event) {
    document.body.removeEventListener('mousemove', c18_mm, false);
    document.body.removeEventListener('mouseup', c18_mu, false);
    indicator.style.display = 'none';
    var n = gflag.c18;
    var x = parseInt(indicator.style.left) - n.xcurb;
    var w = parseInt(indicator.style.width);
    var sf = n.canvas.bpperpx;
    var start = parseInt(sf * x);
    var stop = parseInt(sf * (x + w));
    if (n.canvas.context == 1) {
        var bbj = gflag.menu.bbj;
        var coord = menu.c18_canvas.chrom + ':' + start + '-' + stop;
        gflag.menu.bbj.cgiJump2coord(coord);
        if (gflag.syncviewrange) {
            var lst = gflag.syncviewrange.lst;
            for (var i = 0; i < lst.length; i++) {
                lst[i].cgiJump2coord(coord);
            }
        }
    } else if (n.canvas.context == 2) {
        // circlet view
        var blob = n.canvas.hengeviewblob;
        var k = blob.viewkey;
        var vobj = apps.circlet.hash[k];
        var r = vobj.regions[blob.ridx];
        r.dstart = start;
        r.dstop = stop;
        hengeview_computeRegionRadian(k);
        hengeview_ajaxupdatepanel(k);
        vobj.bbj.genome.drawSinglechr_markInterval(n.canvas, r.chrom, r.dstart, r.dstop, 13, 2);
        menu.c1.innerHTML = r.chrom + ':' + r.dstart + '-' + r.dstop;
    }
}

Genome.prototype.drawSinglechr_markInterval = function (canvas, chrom, start, stop, chromheight, hlspacing) {
    /* chrom bar fills entire canvas, with a blue box marking out a region
     args:
     canvas: <dom>
     chrom: name
     start/stop: highlight position
     chromheight: px of chr bar
     hlspacing:
     */
    var ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    var cL = this.scaffold.len[chrom];
    if (cL == undefined) {
        print2console('c18 cannot draw: unknown chr ' + chrom, 2);
        return;
    }
    if (start < 0 || start >= cL || stop <= start || stop > cL) {
        // do not squawk, it could be splinter is showing data over two chromosomes!!
        return;
    }
    ctx.lineWidth = 1;
    drawIdeogramSegment_simple(
        this.getcytoband4region2plot(chrom, 0, cL, canvas.width - 1),
        ctx, 0, hlspacing, canvas.width - 1, chromheight, false);
    var sf = canvas.width / cL;
    ctx.strokeStyle = 'blue';
    ctx.strokeRect(start * sf, .5, (stop - start) * sf, chromheight + 2 * hlspacing + 1);
};


/*** __navi__ ends ***/


