/**
 * ===BASE===// dsp // updateDspstat.js
 * @param __Browser.prototype__
 * @param 
 */

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

