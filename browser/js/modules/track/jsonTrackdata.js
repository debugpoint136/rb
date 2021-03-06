/**
 * ===BASE===// track // jsonTrackdata.js
 * @param __Browser.prototype__
 * @param 
 */

Browser.prototype.jsonTrackdata = function (data) {
    /* parse track data from json object
     will create display object if the track is new
     handles *panning*
     preprocessing of weaver hsp
     do not render
     */
    var lst = data.tkdatalst;
    if (lst.length == 0) return [];

    var tknames = [];
    var hasnewtk = false;
    var weavertk = [];
    for (var i = 0; i < lst.length; i++) {
        if (!lst[i].data) continue;
        var obj = this.findTrack(lst[i].name);
        if (!obj) {
            obj = this.makeTrackDisplayobj(lst[i].name, lst[i].ft);
            this.tklst.push(obj);
            tknames.push([lst[i].name, true]);
            hasnewtk = true;
        } else {
            tknames.push([lst[i].name, false]);
        }

        /* a few attributes of display object need to be recovered from the json data object
         e.g. decor track mode, long range track filtering scores
         TODO tidy up logic, obj should carry these attributes already, unless that's something changed by cgi
         */
        if (!isHmtk(obj.ft)) {
            // decor track's stuff
            if ('mode' in lst[i]) obj.mode = lst[i].mode;
            if (obj.ft == FT_lr_c) {
                if ('pfilterscore' in lst[i]) obj.qtc.pfilterscore = lst[i].pfilterscore;
                if ('nfilterscore' in lst[i]) obj.qtc.nfilterscore = lst[i].nfilterscore;
            }
        }
        // work out the data
        var dj = lst[i].data; // data from json
        if (isNumerical(obj) || isHmtk(obj.ft) || obj.ft == FT_catmat || obj.ft == FT_qcats) {
            // numerical or cat
            var smooth = (obj.qtc && obj.qtc.smooth);
            if (!this.move.direction) {
                if (smooth) {
                    obj.data_raw = dj;
                    if (!obj.data) {
                        smooth_tkdata(obj);
                    }
                } else {
                    obj.data = dj;
                }
            } else {
                var v = smooth ? obj.data_raw : obj.data;
                if (this.move.direction == 'l') {
                    if (this.move.merge) {
                        v[0] = dj[dj.length - 1].concat(v[0]);
                        dj.pop();
                    }
                    v = dj.concat(v);
                } else {
                    if (this.move.merge) {
                        var idx = v.length - 1;
                        v[idx] = v[idx].concat(dj[0]);
                        dj.shift();
                    }
                    v = v.concat(dj);
                }
                if (smooth) {
                    obj.data_raw = v;
                } else {
                    obj.data = v;
                }
            }
            obj.skipped = undefined;
        } else if (obj.mode == M_thin || obj.mode == M_full || obj.mode == M_arc || obj.mode == M_trihm || obj.mode == M_bar) {
            // stack data
            var is_ld = obj.ft == FT_ld_c || obj.ft == FT_ld_n;
            if (!this.move.direction) {
                if (is_ld) {
                    obj.ld.data = dj;
                } else {
                    obj.data = dj;
                }
                if (lst[i].skipped == undefined) {
                    obj.skipped = 0;
                } else {
                    obj.skipped = lst[i].skipped;
                }
            } else {
                if (is_ld) {
                    // no need to do .boxstart offset shift
                    if (this.move.direction == 'l') {
                        if (this.move.merge) {
                            mergeStackdecor(obj.ld.data[0], dj[dj.length - 1], obj.ft, this.move.direction);
                            dj.pop();
                        }
                        obj.ld.data = dj.concat(obj.ld.data);
                    } else {
                        if (this.move.merge) {
                            mergeStackdecor(obj.ld.data[obj.ld.data.length - 1], dj[0], obj.ft, this.move.direction);
                            dj.shift();
                        }
                        obj.ld.data = obj.ld.data.concat(dj);
                    }
                } else {
                    if (this.move.direction == 'l') {
                        if (this.move.merge) {
                            mergeStackdecor(obj.data[0], dj[dj.length - 1], obj.ft, this.move.direction, this.move.offsetShift);
                            dj.pop();
                        }
                        obj.data = dj.concat(obj.data);
                    } else {
                        if (this.move.merge) {
                            mergeStackdecor(obj.data[obj.data.length - 1], dj[0], obj.ft, this.move.direction, this.move.offsetShift);
                            dj.shift();
                        }
                        obj.data = obj.data.concat(dj);
                    }
                    if (lst[i].skipped != undefined) {
                        if (obj.skipped == undefined) obj.skipped = 0;
                        obj.skipped += lst[i].skipped;
                    }
                }
            }
        } else {
            fatalError('jsonTrackdata: unknown display mode');
        }
        if (obj.ft == FT_weaver_c) {
            weavertk.push(obj);
        }
    }
// done making obj.data
    if (weavertk.length > 0) {
        /* weaving
         sort out alignment data from weaver tk
         */
        if (!this.move.direction) {
            // clear data, TODO don't clear when adding new weaver
            this.weaver.insert = [];
            for (var i = 0; i < this.regionLst.length; i++) {
                this.weaver.insert.push({});
            }
        }
        var bpl = this.entire.atbplevel;
        for (var wid = 0; wid < weavertk.length; wid++) {
            var wtk = weavertk[wid];
            var querygenome = wtk.cotton;
            if (!querygenome) fatalError('.cotton missing from weaver tk');
            if (!(querygenome in this.weaver.q)) fatalError(querygenome + ' missing from browser.weaver');
            this.weaver.q[querygenome].weaver.track = wtk;

            for (var rid = 0; rid < this.regionLst.length; rid++) {
                var thisregion = this.regionLst[rid];
                for (var aid = 0; aid < wtk.data[rid].length; aid++) {
                    // one alignment
                    var item = wtk.data[rid][aid];
                    if (item.hsp) {
                        // moving, old item has got hsp
                        continue;
                    }
                    var aln = item.genomealign;
                    if (!aln) {
                        print2console('.genomealign missing: ' + wtk.label + ' ' + rid + ' ' + aid, 2);
                        continue;
                    }
                    /* hsp based on this alignment */
                    var samestrand = aln.strand == '+'; // +/+ alignment
                    var hsp = {
                        querystart: aln.start,
                        querystop: aln.stop,
                        querychr: aln.chr,
                        strand: aln.strand,
                        queryseq: aln.queryseq,
                        targetseq: aln.targetseq,
                        targetrid: rid,
                        gap: {},
                        insert: {},
                    };
                    delete item.genomealign;
                    item.hsp = hsp;

                    if (wtk.weaver.mode == W_rough) {
                        // may detect cases without sequence
                        hsp.targetstart = item.start;
                        hsp.targetstop = item.stop;
                        continue;
                    }

                    var chewid = 0; // common idx to chew on target/query alignment
                    var targetstart = item.start;
                    // chew up alignment in front of region
                    while (targetstart < thisregion[3]) {
                        if (hsp.targetseq[chewid] != '-') {
                            targetstart++;
                        }
                        if (hsp.queryseq[chewid] != '-') {
                            if (samestrand) {
                                hsp.querystart++;
                            } else {
                                hsp.querystop--;
                            }
                        }
                        chewid++;
                    }
                    hsp.chew_start = chewid;
                    hsp.targetstart = targetstart;
                    if (samestrand) {
                        // hsp stop awaits to be determined
                        hsp.querystop = hsp.querystart;
                    } else {
                        // hsp start awaits
                        hsp.querystart = hsp.querystop;
                    }
                    // chew up alignment in view range (according to target), detect gap on target/query
                    hsp.targetstop = Math.min(item.stop, thisregion[4]);
                    var targetcoord = targetstart,
                        targetgapcount = 0,
                        querygapcount = 0;
                    while (targetcoord < hsp.targetstop) {
                        if (hsp.targetseq[chewid] == '-') {
                            targetgapcount++;
                        } else {
                            if (targetgapcount > 0) {
                                // gap opens on target, treat as insertion to query for this hsp
                                // only gapwidth>1px will be considered
                                if (targetcoord in this.weaver.insert[rid]) {
                                    this.weaver.insert[rid][targetcoord] = Math.max(this.weaver.insert[rid][targetcoord], targetgapcount);
                                } else {
                                    this.weaver.insert[rid][targetcoord] = targetgapcount;
                                }
                                // register insert in hsp
                                hsp.insert[targetcoord] = targetgapcount;
                                targetgapcount = 0;
                            }
                            targetcoord++;
                        }
                        if (hsp.queryseq[chewid] == '-') {
                            querygapcount++;
                        } else {
                            if (querygapcount > 0) {
                                // treat as deletion from query, private to this query
                                if (samestrand) {
                                    hsp.gap[hsp.querystop] = querygapcount;
                                } else {
                                    hsp.gap[hsp.querystart] = querygapcount;
                                }
                                querygapcount = 0;
                            }
                            if (samestrand) {
                                hsp.querystop++;
                            } else {
                                hsp.querystart--;
                            }
                        }
                        chewid++;
                    }
                    hsp.chew_stop = chewid;
                }
            }
            // done making hsp for this wtk
        }
        if (this.weaver.mode == W_fine) {
            // not changing summarysize but the entire onscreen span
            // don't do this for stitch
            var i = this.regionLst.length - 1;
            this.entire.spnum = this.cumoffset(i, this.regionLst[i][4]);
            if (this.move.direction != 'r') {
                // unless moving right, need to recalculate styleLeft, preserve existing vstart
                var d = this.dspBoundary;
                var x = this.cumoffset(d.vstartr, d.vstartc);
                if (!x) fatalError('lost vstartr after weaving');
                this.placeMovable(-parseInt(x));
            }
            this.updateDspBoundary();
        }
    }
    if (hasnewtk) {
        this.trackdom2holder();
    }
    return tknames;
};


/*** __track__ ends ***/

