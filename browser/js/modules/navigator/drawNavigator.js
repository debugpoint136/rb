/**
 * ===BASE===// navigator // drawNavigator .js
 * @param __Browser.prototype__
 * @param 
 */

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

