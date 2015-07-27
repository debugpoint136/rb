/**
 * ===BASE===// drawTk // stack_track.js
 * @param __Browser.prototype__
 * @param 
 */

Browser.prototype.stack_track = function (tkobj, yoffset) {
    var ft = tkobj.ft;
    if (tkishidden(tkobj) || isNumerical(tkobj) || ft == FT_cat_n || ft == FT_cat_c || ft == FT_cm_c ||
        ft == FT_matplot || ft == FT_catmat) return;

    if (tkobj.ft == FT_ld_c || tkobj.ft == FT_ld_n) {
        if (tkobj.ld.data.length == 0) return;
    } else {
        if (tkobj.data.length == 0) return;
    }

    if (this.targetBypassQuerytk(tkobj)) return;

    var canvas = tkobj.canvas; // will also set canvas height
    canvas.width = this.entire.spnum;
    var ctx = canvas.getContext('2d');


    /* list of regions to be used for data processing:
     ldtk - view range only!
     rest - lw to rw
     */
    var startRidx, stopRidx,
        startViewCoord, stopViewCoord;

    if (ft == FT_ld_c || ft == FT_ld_n) {
        startRidx = this.dspBoundary.vstartr;
        stopRidx = this.dspBoundary.vstopr;
        startViewCoord = this.dspBoundary.vstartc;
        stopViewCoord = this.dspBoundary.vstopc;

        /* ld data preprocessing
         in case of multi-region (juxtaposition or geneset)
         synthetic lr items would not be in multiregions
         */
        tkobj.ld.hash = {}; // key: snp rs, val: {rid:?, coord:?, topx:?, bottomx:? }
        // 
        /* rid/coord is real info
         topx/bottomx: plotting offset on the linkage graph
         */
        // 1. get all snps
        var count = 0; // total count of snp
        for (i = startRidx; i <= stopRidx; i++) {
            var r = this.regionLst[i];
            var startcoord = i == startRidx ? startViewCoord : r[3];
            var stopcoord = i == stopRidx ? stopViewCoord : r[4];
            for (var j = 0; j < tkobj.ld.data[i].length; j++) {
                var k = tkobj.ld.data[i][j];
                if (k.start < startcoord) continue;
                if (k.stop <= stopcoord) {
                    // valid pair
                    var x1 = this.cumoffset(i, k.start),
                        x2 = this.cumoffset(i, k.stop);
                    if (x1 >= 0 && x2 > x1) {
                        tkobj.ld.hash[k.rs1] = {rid: i, coord: k.start, topx: x1};
                        tkobj.ld.hash[k.rs2] = {rid: i, coord: k.stop, topx: x2};
                    }
                } else {
                    /* look through remaining regions
                     snp pairs that form ld are always on same chr, so no chr info is given for each snp
                     will only use coord to detect region
                     */
                    for (var m = i + 1; m <= stopRidx; m++) {
                        var r2 = this.regionLst[m];
                        if (r2[0] != r[0]) continue;
                        var startcoord2 = m == startRidx ? startViewCoord : r2[3];
                        var stopcoord2 = m == stopRidx ? stopViewCoord : r2[4];
                        if (k.stop >= startcoord2 && k.stop <= stopcoord2) {
                            // valid pair
                            var x1 = this.cumoffset(i, k.start),
                                x2 = this.cumoffset(m, k.stop);
                            if (x1 >= 0 && x2 > x1) {
                                tkobj.ld.hash[k.rs1] = {rid: i, coord: k.start, topx: x1};
                                tkobj.ld.hash[k.rs2] = {rid: m, coord: k.stop, topx: x2};
                            }
                            break;
                        }
                    }
                }
            }
        }
        // 2. count and sort snp
        var lst = [];
        for (var x in tkobj.ld.hash) {
            var k = tkobj.ld.hash[x];
            lst.push([k.rid, k.coord, x]);
        }
        // doesn't matter if lst is empty?
        lst.sort(snpSort);
        /* 3. assign bottom xpos in the link graph
         */
        var w = this.hmSpan / lst.length;
        for (var i = 0; i < lst.length; i++) {
            var rs = lst[i][2];
            tkobj.ld.hash[rs].bottomx = w * (i + .5) - this.move.styleLeft;
        }
        var chr = this.genome.scaffold.current[0];
        /* hypothetical region, scale is consistant with this.entire
         */
        var hy_r = [chr, 0, this.genome.scaffold.len[chr],
            0, // dstart
            -1, // dstop
            this.entire.spnum, // width, region stretches widest
            null,
            -1, // summary size
        ];
        if (this.entire.atbplevel) {
            hy_r[4] = (this.entire.spnum) / this.entire.bpwidth;
            // hy_r[7] not used
        } else {
            hy_r[7] = this.entire.summarySize;
            hy_r[4] = parseInt(this.entire.spnum * hy_r[7]);
        }

        this.decoy_dsp = {
            regionLst: [hy_r],
            dspBoundary: {vstartr: 0, vstarts: this.hmSpan, vstopr: 0, vstops: this.hmSpan * 2},
            bak_regionLst: this.regionLst,
            bak_dspBoundary: this.dspBoundary,
        };
        this.regionLst = this.decoy_dsp.regionLst;
        this.dspBoundary = this.decoy_dsp.dspBoundary;

        /* 4. make lr items that exist in the hypothetical region
         */
        // window bp length
        if (this.entire.atbplevel) {
            w /= this.entire.bpwidth;
        } else {
            w *= hy_r[7];
        }
        var _data = [];
        for (i = startRidx; i <= stopRidx; i++) {
            for (j = 0; j < tkobj.ld.data[i].length; j++) {
                var k = tkobj.ld.data[i][j];
                if ((k.rs1 in tkobj.ld.hash) && (k.rs2 in tkobj.ld.hash)) {
                    var a = tkobj.ld.hash[k.rs1].bottomx;
                    var b = tkobj.ld.hash[k.rs2].bottomx;
                    if (this.entire.atbplevel) {
                        a /= this.entire.bpwidth;
                        b /= this.entire.bpwidth;
                    } else {
                        a *= hy_r[7];
                        b *= hy_r[7];
                    }
                    _data.push({
                        id: k.id,
                        start: parseInt(a - w / 2),
                        stop: parseInt(a + w / 2),
                        name: chr + ':' + parseInt(b - w / 2) + '-' + parseInt(b + w / 2) + ',' + k.scorelst[tkobj.showscoreidx],
                        strand: '>',
                    });
                }
            }
        }
        tkobj.data = [_data];
        // all hypothetical!
        startRidx = stopRidx = 0;
        if (this.entire.atbplevel) {
            startViewCoord = (-this.move.styleLeft) / this.entire.bpwidth;
            stopViewCoord = (this.hmSpan - this.move.styleLeft) / this.entire.bpwidth;
        } else {
            startViewCoord = (-this.move.styleLeft) * hy_r[7];
            stopViewCoord = (this.hmSpan - this.move.styleLeft) * hy_r[7];
        }
        startViewCoord = hy_r[3];
        stopViewCoord = hy_r[4];
        ft = FT_lr_c; // ld is pretending to be lr track
    } else {
        // non-ld
        startRidx = this.dspBoundary.vstartr;
        startViewCoord = this.dspBoundary.vstartc;
        stopRidx = this.dspBoundary.vstopr;
        stopViewCoord = this.dspBoundary.vstopc;
    }

    var Data = []; // stack data of all tracks
    var Data2 = []; // only for arc or trihm

    var isChiapet = (ft == FT_lr_n || ft == FT_lr_c);
    var isSam = (ft == FT_sam_c || ft == FT_sam_n || ft == FT_bam_c || ft == FT_bam_n);
    var drawTriheatmap = tkobj.mode == M_trihm;
    var drawArc = tkobj.mode == M_arc;

    /* both for arc and triangular heatmap:
     if the on-canvas distance between two paired items is greater than hmSpan,
     it will make the canvas too high, and the two items won't both show up
     so limit it
     */

    if (isSam) {
        /* bam/sam read pre-processing
         read alignment stop is not provided, figure out from cigar
         item.start/stop is for stacking only
         item.bam.start/stop is actual alignment
         */
        for (var i = 0; i < startRidx; i++) {
            Data.push(tkobj.data[i]);
        }
        var pairedReads = {}; // key: read name, val: 1
        for (i = startRidx; i <= stopRidx; i++) {
            if (!tkobj.data[i] || tkobj.data[i].length == 0) {
                Data.push([]);
                continue;
            }
            /* adjust read start/stop coord by clipping
             */
            for (var j = 0; j < tkobj.data[i].length; j++) {
                var item = tkobj.data[i][j];
                if (item.existbeforepan) {
                    // when padding, existing data is ready and must escape recomputing
                    continue;
                }
                setBamreadcoord(item);
            }
            tkobj.data[i].sort(gfSort_coord);
            var newarray = [];
            for (j = 0; j < tkobj.data[i].length; j++) {
                var item = tkobj.data[i][j];
                var f = item.bam.flag;
                if (((f >> 2) & 1) == 1) {
                    // it is umapped?
                    continue;
                }
                if (item.hasmate) {
                    // already paired, perhaps before moving
                    newarray.push(item);
                    continue;
                }
                item.strand = (((f >> 4) & 1) == 1) ? '<' : '>';
                if (((f >> 0) & 1) == 1) {
                    // paired
                    if (item.id in pairedReads) continue;
                    if (((f >> 3) & 1) == 1) {
                        // mate is unmapped
                        item.bam.status = 'paired but mate is unmapped';
                    } else {
                        // mate is mapped
                        var mateRidx = -1, // mate region idx
                            mateDidx = -1; // mate data idx (in this region)
                        // search in same region i
                        for (var k = j + 1; k < tkobj.data[i].length; k++) {
                            if (tkobj.data[i][k].id == item.id) {
                                mateRidx = i;
                                mateDidx = k;
                                break;
                            }
                        }
                        if (mateRidx == -1) {
                            // mate is not found in this region, look through the remainder
                            for (var k = i + 1; k <= stopRidx; k++) {
                                if (mateRidx != -1) break;
                                for (var x = 0; x < tkobj.data[k].length; x++) {
                                    if (tkobj.data[k][x].id == item.id) {
                                        mateRidx = k;
                                        mateDidx = x;
                                        break;
                                    }
                                }
                            }
                        }
                        if (mateRidx == -1) {
                            item.bam.status = 'paired but mate is out of view range';
                        } else {
                            item.bam.status = 'paired';
                            item.hasmate = true;
                            pairedReads[item.id] = 1;
                            var mate = tkobj.data[mateRidx][mateDidx];
                            if (mateRidx != i) {
                                if (mateRidx < i) fatalError('mateRidx<i');
                                setBamreadcoord(mate);
                            }
                            var Li = i,
                                Ri = mateRidx,
                                L = item,
                                R = mate;
                            Ls = item.strand,
                                Rs = (((f >> 5) & 1) == 1) ? '<' : '>';
                            if (mateRidx == i && mate.start < item.start) {
                                // swap
                                L = mate;
                                R = item;
                                var tt = Rs;
                                Rs = Ls;
                                Ls = tt;
                            }
                            item.struct = {
                                L: {rid: Li, start: L.start, stop: L.stop, strand: Ls, bam: L.bam},
                                R: {rid: Ri, start: R.start, stop: R.stop, strand: Rs, bam: R.bam}
                            };
                        }
                    }
                } else {
                    // single
                    item.bam.status = 'single';
                }
                newarray.push(item);
            }
            Data.push(newarray);
        }
        for (i = stopRidx + 1; i < this.regionLst.length; i++) {
            Data.push(tkobj.data[i]);
        }
        tkobj.data = Data;
    } else if (isChiapet) {
        /* long-range data pre-processing...
         a new Data object will be made containing:
         - complete pairs in displayed region that are joined
         - singletons
         */
        Data = tkobj.data;
        var newdata = [];
        for (var i = 0; i < startRidx; i++) {
            newdata.push([]);
        }

        /* "item" means the from-item
         "mate" means the to-item
         */
        var usedItems = {}; // key: "mate chr start stop", val: "item chr start stop"

        /* sorting must be enabled, though expensive
         because during panning, new data is appended to the .data
         and it won't draw anything if not sorted...
         */
        for (i = startRidx; i <= stopRidx; i++) {
            Data[i].sort(gfSort_coord);
        }
        for (i = startRidx; i <= stopRidx; i++) {
            var itemchr = this.regionLst[i][0];
            newdata.push([]);
            for (var j = 0; j < Data[i].length; j++) {
                var item = Data[i][j];

                /* skip items outside the view and to the left */
                if (i == startRidx) {
                    if (item.stop <= startViewCoord) continue;
                }
                /* quit searching if outside the view and to the right */
                if (i == stopRidx) {
                    if (item.start >= stopViewCoord) break;
                }

                /* skip items with incorrect name */
                if (item.name.indexOf(',') == -1) continue;
                var tmp = item.name.split(',');

                /* skip item if it has already been paired */
                var tmp3 = itemchr + ':' + item.start + '-' + item.stop;
                if (tmp3 in usedItems && usedItems[tmp3] == tmp[0]) continue;

                var score = tmp[1];

                var tmp2 = this.genome.parseCoordinate(tmp[0], 2);
                if (!tmp2) continue;
                var matechr = tmp2[0];
                var matestart = tmp2[1];
                var matestop = tmp2[3];

                var mateRegionidx = -1;
                if (matechr == itemchr && matestop <= this.regionLst[i][3]) {
                    /* do nothing, item will be unpaired in this rare case
                     when running gsv, the item at left side will have its mate at
                     upstream outside of the region, such item shall be unpaired */
                } else {
                    var distoncanvas = 0; // curb by distance on canvas
                    for (var k = i; k <= stopRidx; k++) {
                        // for each region, see if mate fits in
                        if (distoncanvas >= this.hmSpan) break;
                        if (this.regionLst[k][0] == matechr) {
                            if (Math.max(this.regionLst[k][3], matestart) < Math.min(this.regionLst[k][4], matestop)) {
                                mateRegionidx = k;
                                usedItems[tmp[0]] = tmp3;
                                break;
                            }
                        }
                        // increment dist on canvas
                        if (k == i) {
                            distoncanvas += this.cumoffset(i, this.regionLst[i][4]) - this.cumoffset(i, item.stop);
                        } else {
                            distoncanvas += this.cumoffset(k, this.regionLst[k][4]) - this.cumoffset(k, this.regionLst[k][3]);
                        }
                    }
                }
                var newitem = {};
                if (mateRegionidx == -1) {
                    // mate not found for this item
                    if (!drawArc && !drawTriheatmap) {
                        // save singleton for stack mode, but not arc or triheamap
                        newitem.id = item.id;
                        newitem.start = item.start;
                        newitem.stop = item.stop;
                        newitem.name = item.name;
                        newitem.strand = item.strand;
                        newitem.hasmate = false;
                        newdata[i].push(newitem);
                    }
                } else {
                    var L, R;
                    if (i < mateRegionidx) {
                        // item and its mate in separate region
                        L = {rid: i, start: item.start, stop: item.stop};
                        R = {rid: mateRegionidx, start: matestart, stop: matestop};
                    } else {
                        // in same region
                        if (item.start > matestart) {
                            R = {rid: i, start: item.start, stop: item.stop};
                            L = {rid: i, start: matestart, stop: matestop};
                        } else {
                            L = {rid: i, start: item.start, stop: item.stop};
                            R = {rid: i, start: matestart, stop: matestop};
                        }
                    }
                    // i can never be bigger than mateRegionidx...
                    newitem.id = item.id;
                    newitem.start = L.start;
                    newitem.stop = R.stop;
                    newitem.name = parseFloat(score);
                    newitem.struct = {L: L, R: R};
                    newitem.hasmate = true;
                    newdata[i].push(newitem);
                }
            }
        }
        if (drawArc || drawTriheatmap) {
            Data2 = newdata;
        } else {
            Data2 = null;
            Data = newdata;
        }
        tkobj.data_chiapet = newdata; // attach for clicking on canvas
    } else {
        Data = tkobj.data;
        Data2 = null;
    }

    /* convert item coord into box start/width 
     only do for items within lws and rws
     those fit in will have valid .boxstart/boxwidth computed,
     else they will be left undefined
     serve as a way to quickly tell if to process this item later

     in case of paired read or long-range interaction,
     start coord will be start of query,
     stop coord will be stop of mate,
     must detect if query/mate are in *separate* regions
     */
    var longrangemaxspan = 0; // for both arcs and triheatmap, to determine/curb canvas height
    if (isSam) {
        /* sam reads, use Data
         */
        for (var i = startRidx; i <= stopRidx; i++) {
            if (!Data[i]) continue;
            var r = this.regionLst[i];
            var fvd = (r[8] && r[8].item.hsp.strand == '-') ? false : true;
            for (var j = 0; j < Data[i].length; j++) {
                var item = Data[i][j];
                item.stack = undefined; // by default
                if (item.hasmate) {
                    // two reads might be in *separate* regions
                    var materid = item.struct.R.rid;
                    if (materid == i) {
                        var a = Math.max(r[3], Math.min(item.struct.L.start, item.struct.R.start)),
                            b = Math.min(r[4], Math.max(item.struct.L.stop, item.struct.R.stop));
                        if (fvd) {
                            item.boxstart = this.cumoffset(i, a);
                            item.boxwidth = this.cumoffset(i, b) - item.boxstart;
                        } else {
                            item.boxstart = this.cumoffset(i, b);
                            item.boxwidth = this.cumoffset(i, a) - item.boxstart;
                        }
                    } else {
                        // materid is sure to be bigger than i
                        item.boxstart = this.cumoffset(i,
                            fvd ? Math.max(item.start, r[3]) : Math.min(item.stop, r[4]));
                        var r2 = this.regionLst[materid];
                        var fvd2 = (r2[8] && r2[8].item.hsp.strand == '-') ? false : true;
                        item.boxwidth = this.cumoffset(materid,
                                (fvd2 ? Math.min(item.struct.R.stop, r2[4]) :
                                    Math.max(item.struct.R.start, r2[3]))
                            ) - item.boxstart;
                    }
                } else {
                    item.boxstart = this.cumoffset(i,
                        fvd ? Math.max(item.start, r[3]) : Math.min(item.stop, r[4]));
                    item.boxwidth = Math.max(1,
                        this.cumoffset(i, fvd ? Math.min(item.stop, r[4]) : Math.max(item.start, r[3]))
                        - item.boxstart);
                }
            }
        }
    } else if (drawArc || drawTriheatmap) {
        /* long-range data,
         do it for Data2, set longrangemaxspan here */
        for (var i = startRidx; i <= stopRidx; i++) {
            var r = this.regionLst[i];
            var rstart = r[3]; // region start coord
            var rstop = r[4]; // region stop coord
            for (var j = 0; j < Data2[i].length; j++) {
                var item = Data2[i][j];
                item.stack = undefined; // stack is not used in arc or trihm
                if (item.hasmate) {
                    /** item's mate might be in *separate* regions **/
                    item.boxstart = this.cumoffset(i, Math.max(item.start, r[3]));
                    var materid = item.struct.R.rid;
                    for (var k = i; k <= stopRidx; k++) {
                        var rr = this.regionLst[k];
                        if (k == materid) {
                            var istop = Math.min(item.stop, rr[4]);
                            item.boxwidth = this.cumoffset(k, Math.min(item.stop, rr[4])) - item.boxstart;
                            /* dirty filter, to restrict track height */
                            if (item.boxwidth > this.hmSpan) {
                                item.boxstart = item.boxwidth = undefined;
                            }
                            break;
                        }
                    }
                    // however, item stop coord might be beyond this region, so just skip it?
                    if (item.boxwidth != undefined) {
                        longrangemaxspan = Math.max(longrangemaxspan, item.boxwidth);
                    }
                } else {
                    /* unpaired item
                     TODO plot a mark on canvas
                     */
                    item.boxstart = item.boxwidth = undefined;
                }
            }
        }
    } else if (tkobj.ft == FT_weaver_c && tkobj.weaver.mode == W_rough) {
        // do not compute boxstart
        this.weaver_stitch(tkobj);
    } else {
        /* stack-style or barplot
         */
        for (var i = startRidx; i <= stopRidx; i++) {
            var r = this.regionLst[i];
            var fvd = (r[8] && r[8].item.hsp.strand == '-') ? false : true;
            for (var j = 0; j < Data[i].length; j++) {
                var item = Data[i][j];
                item.stack = undefined; // by default
                item.boxstart = this.cumoffset(i,
                    fvd ? Math.max(item.start, r[3]) : Math.min(item.stop, r[4]));
                if (isChiapet && item.hasmate) {
                    // assume start point must be in this region? check using item start
                    /** mate might be in *separate* regions **/
                    var materid = item.struct.R.rid;
                    var rr = this.regionLst[materid];
                    a = Math.min(item.stop, rr[4]);
                    // TODO fvd?
                    item.boxwidth = this.cumoffset(materid, Math.min(item.stop, rr[4])) - item.boxstart;
                } else {
                    item.boxwidth = Math.max(1, this.cumoffset(i,
                            (fvd ? Math.min(item.stop, r[4]) : Math.max(item.start, r[3])))
                        - item.boxstart);
                }
            }
        }
    }

// TODO tkobj.qtc.stackheight come on...
    var isThin = tkobj.mode == M_thin;
    var stackHeight = tkobj.qtc.stackheight ? tkobj.qtc.stackheight : (isThin ? thinStackHeight : fullStackHeight);

    var viewstart_px = -this.move.styleLeft;
    var viewstop_px = viewstart_px + this.hmSpan;
    var maxstack = 0;

    /* set track canvas height */
    if (drawArc || drawTriheatmap) {
        if (tkobj.ft == FT_ld_c || tkobj.ft == FT_ld_n) {
            canvas.height = parseInt(longrangemaxspan * Math.tan(Math.PI * tkobj.qtc.anglescale / 4) / 2) + 2 + yoffset + tkobj.ld.ticksize + tkobj.ld.topheight;
        } else if (drawArc && longrangemaxspan > 0) {
            canvas.height = Math.max(10, longrangemaxspan * ((1 / Math.SQRT2) - 0.5) + 2 + yoffset);
        } else if (drawTriheatmap && longrangemaxspan > 0) {
            canvas.height = Math.min(this.hmSpan / 2, parseInt(longrangemaxspan * Math.tan(Math.PI * tkobj.qtc.anglescale / 4) / 2) + 2 + yoffset);
        } else {
            canvas.height = 10;
        }
    } else if (tkobj.ft == FT_weaver_c && tkobj.weaver.mode == W_rough) {
        // rough weaver, no stacking
        canvas.height = tkobj.qtc.height + fullStackHeight;
        // may adjust to ..
    } else if (tkobj.mode == M_bar || tkobj.ft == FT_weaver_c) {
        /* duplicative
         barplot or weaver, do stacking only by item coord, but not boxstart/stop, and not including name
         */
        var stack = [], // coord
            stackcanvas = []; // on canvas x
        for (i = startRidx; i <= stopRidx; i++) {
            if (Data[i] == undefined) {
                continue;
            }
            var r = this.regionLst[i];
            var fvd = (r[8] && r[8].item.hsp.strand == '-') ? false : true;
            if (fvd) {
                Data[i].sort(gfSort_coord);
            } else {
                Data[i].sort(gfSort_coord_rev);
            }
            //var max_x=0;
            for (var j = 0; j < Data[i].length; j++) {
                var item = Data[i][j];
                if (item.boxstart == undefined || item.boxwidth == undefined) continue;
                item.namestart = undefined;
                var sid = 0;

                if (j > 0) {
                    if (fvd) {
                        while (stack[sid] > item.start) sid++;
                    } else {
                        while (stack[sid] < item.start) sid++;
                    }
                }
                if (stack[sid] == undefined) {
                    stack[sid] = stackcanvas[sid] = -1;
                }

                var _iN = item.name2 ? item.name2 : item.name;
                var ivr = Math.max(viewstart_px, item.boxstart) < Math.min(viewstop_px, item.boxstart + item.boxwidth);
                if (_iN && ivr) {
                    // only deals with name if box overlaps with view range
                    item.namewidth = ctx.measureText(_iN).width;
                    if (item.struct || item.namewidth >= item.boxwidth) {
                        // try to put name outside
                        if (item.namewidth <= item.boxstart - stackcanvas[sid] - 2) {
                            item.namestart = item.boxstart - item.namewidth - 1;
                        }
                    } else {
                        item.namestart = item.boxstart + (item.boxwidth - item.namewidth) / 2;
                    }
                }

                stack[sid] = item.stop;
                stackcanvas[sid] = item.boxstart + item.boxwidth;
                item.stack = sid;
                /* not used, to decide if an item overlaps with another
                 item.__overlap= item.start<max_x;
                 max_x=Math.max(max_x,item.stop);
                 */
                if (ivr && maxstack < sid) {
                    maxstack = sid;
                }
            }
            // must clear stack as coord will be different in another region
            stack = [-1];
        }
        if (tkobj.ft == FT_weaver_c) {
            canvas.height = (stackHeight + 1) * (maxstack + 1) + yoffset + weavertkpad * 2 +
                (tkobj.weaver.mode == W_fine ? weavertk_hspdist_strpad + weavertk_hspdist_strh : 0);
        } else {
            canvas.height = densitydecorpaddingtop + tkobj.qtc.height + 1 + (fullStackHeight + 1) * (maxstack + 1);
        }
    } else {
        /***
         tk stack

         in thin mode, allow items sit right next to each other in one stack
         in full mode:
         1px spacing between items in same stack
         determine whether to draw name
         if draw, decide namestart

         for each region between left/right wing:
         for each bed item:
         define stack start/width by full/thin, if item has name, name width, ...
         try stacking item
         if successfully stacked:
         set stack id
         else:
         left stack id unspecified
         don't cap number of items plotted in JS, that's capped in C
         TODO bam reads must be capped in C, so that excessive data won't be passed to client
         ***/
        /* to properly set canvas height,
         need to count max stack # within [dspBoundary.vstarts, dspBoundary.vstops]
         but need to know pixel position of .vstarts and .vstops
         */
        // need to set font here to measure text width
        if (tkobj.qtc) {
            ctx.font = (tkobj.qtc.fontbold ? 'bold' : '') + ' ' +
                (tkobj.qtc.fontsize ? tkobj.qtc.fontsize : '8pt') + ' ' +
                (tkobj.qtc.fontfamily ? tkobj.qtc.fontfamily : 'sans-serif');
        }
        var stack = [-1000];
        for (i = startRidx; i <= stopRidx; i++) {
            if (Data[i] == undefined) {
                continue;
            }
            /* to enable sorting using score, need to tell gfSort the score index being used
             do not risk of appending that to gflag, it won't guard against paralelle rendering
             need to append scoreidx to each item
             */
            if (tkobj.showscoreidx != undefined) {
                for (var j = 0; j < Data[i].length; j++) {
                    Data[i][j].__showscoreidx = tkobj.showscoreidx;
                }
            }
            Data[i].sort(gfSort);
            if (tkobj.showscoreidx != undefined) {
                for (var j = 0; j < Data[i].length; j++) {
                    delete Data[i][j].__showscoreidx;
                }
            }
            for (var j = 0; j < Data[i].length; j++) {
                var item = Data[i][j];
                if (item.boxstart == undefined) {
                    // filtered by score !
                    continue;
                }
                item.stack = undefined; // by default
                // make stack start/width for stacking
                var k = 0; // stack id iterator
                item.stackstart = item.boxstart;
                item.stackwidth = item.boxwidth;
                item.namestart = undefined;
                if (isThin) { // thin
                    while (stack[k] > item.stackstart) {
                        k++;
                        if (k == stack.length) stack.push(-1000);
                    }
                } else { // full
                    var _iN = item.name2 ? item.name2 : item.name;
                    if (_iN && (Math.max(0 - this.move.styleLeft, item.boxstart) < Math.min(this.hmSpan - this.move.styleLeft, item.boxstart + item.boxwidth))) {
                        // only deals with name if box overlaps with view range
                        item.namewidth = ctx.measureText(_iN).width;
                        if (item.struct || item.namewidth >= item.boxwidth) {
                            // try to put name outside
                            if (item.boxstart <= 0 - this.move.styleLeft) {
                                // left end out
                                if (item.boxstart + item.boxwidth + item.namewidth > this.hmSpan - this.move.styleLeft) {
                                    // name forced into box
                                    item.namestart = 10 - this.move.styleLeft;
                                } else {
                                    // name on the right
                                    item.namestart = item.boxstart + item.boxwidth + 1;
                                    item.stackwidth = item.boxwidth + item.namewidth + 1;
                                }
                            } else {
                                if (item.boxstart + this.move.styleLeft < item.namewidth) {
                                    // not enough space on left
                                    if (item.boxstart + item.boxwidth + item.namewidth > this.hmSpan - this.move.styleLeft) {
                                        // name forced into box
                                        item.namestart = item.boxstart + 10;
                                    } else {
                                        // on right
                                        item.namestart = item.boxstart + item.boxwidth + 1;
                                        item.stackwidth = item.boxwidth + item.namewidth + 1;
                                    }
                                } else {
                                    // on left
                                    item.namestart = item.boxstart - item.namewidth - 1;
                                    item.stackstart = item.namestart;
                                    item.stackwidth = item.boxwidth + item.namewidth + 1;
                                }
                            }
                        } else {
                            // name fits into box
                            item.stackstart = item.boxstart;
                            item.stackwidth = item.boxwidth;
                            item.namestart = item.boxstart + (item.boxwidth - item.namewidth) / 2;
                        }
                    }
                    // need items in same stack to have one pixel spacing,
                    while (stack[k] + 1 > item.stackstart) {
                        k++;
                        //if(k == stackNumberLimit) break;
                        // big negative value help process items with 0 or negative box start
                        if (k == stack.length) stack.push(-10000);
                    }
                }
                // this item is stacked
                stack[k] = item.stackstart + item.stackwidth + 1;
                item.stack = k;
                if ((Math.max(viewstart_px, item.boxstart) < Math.min(viewstop_px, item.boxstart + item.boxwidth)) && maxstack < k) {
                    maxstack = k;
                }
            }
        }
        canvas.height = Math.max(10, (stackHeight + 1) * (maxstack + 1) + yoffset);
    }
    if (tkobj.ft == FT_ld_c || tkobj.ft == FT_ld_n) {
        this.regionLst = this.decoy_dsp.bak_regionLst;
        this.dspBoundary = this.decoy_dsp.bak_dspBoundary;
    }
};


