/**
 * ===BASE===// wvfind // wvfind_run_cb.js
 * @param __Browser.prototype__
 * @param 
 */

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

