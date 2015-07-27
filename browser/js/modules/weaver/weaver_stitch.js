/**
 * ===BASE===// weaver // weaver_stitch.js
 * @param __Browser.prototype__
 * @param 
 */

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


