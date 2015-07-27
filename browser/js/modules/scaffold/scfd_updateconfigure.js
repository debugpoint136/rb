/**
 * ===BASE===// scaffold // scfd_updateconfigure.js
 * @param 
 */

function scfd_updateconfigure() {
    var newlst = [];
    var bbj = gflag.menu.bbj;
    var trlst = bbj.genome.scaffold.overview.holder.firstChild.childNodes;
    for (var i = 0; i < trlst.length; i++) {
        if (trlst[i].style.backgroundColor == 'transparent')
            newlst.push(trlst[i].chr);
    }
    newlst = newlst.concat(bbj.genome.scaffold.toadd);
    bbj.genome.scaffold.toadd = [];
    if (stringLstIsIdentical(newlst, bbj.genome.scaffold.current)) {
        scfd_cancelconfigure();
        return;
    }
    // now determine dsp
    var dspParam = '';
    if (bbj.dspBoundary.vstartr == bbj.dspBoundary.vstopr && thinginlist(bbj.regionLst[bbj.dspBoundary.vstartr][0], newlst)) {
        // very well, currently only showing single region and that region is still in use
        dspParam = '&' + bbj.displayedRegionParam();
    } else {
        var preservedRegions = [];
        var oldlookregion = [];
        for (i = bbj.dspBoundary.vstartr; i <= bbj.dspBoundary.vstopr; i++)
            oldlookregion.push(bbj.regionLst[i][0]);
        for (i = 0; i < newlst.length; i++) {
            if (thinginlist(newlst[i], oldlookregion))
                preservedRegions.push(newlst[i]);
        }
        var dspSeq = null;
        if (preservedRegions.length > 0) {
            dspSeq = preservedRegions[0];
        } else {
            dspSeq = newlst[0];
        }
        // just use first sequence but need to make sure not to display too long region
        var totalLength = 0;
        for (i = 0; i < newlst.length; i++)
            totalLength += bbj.genome.scaffold.len[newlst[i]];
        var allowed = parseInt(totalLength / 3);
        if (allowed <= 80) {
            print2console("Sorry cannot carry out this operation, please try again by including more scaffold sequences", 2);
            return;
        }
        allowed = allowed > bbj.genome.scaffold.len[dspSeq] ? bbj.genome.scaffold.len[dspSeq] : allowed;
        dspParam = '&runmode=' + RM_genome + '&startChr=' + dspSeq + '&startCoord=0&stopChr=' + dspSeq + '&stopCoord=' + (allowed > 10000 ? 10000 : allowed);
    }
    bbj.genome.scaffold.current = newlst;
    bbj.genome.scfdoverview_makepanel();
    scfd_cancelconfigure();
    // make some new param strings
    var tmp = [];
    for (i = 0; i < newlst.length; i++) {
        tmp.push(newlst[i]);
        tmp.push(bbj.genome.scaffold.len[newlst[i]]);
    }
    bbj.ajaxX('scaffoldUpdate=on&scaffoldNames=' + tmp.join(',') + ',&scaffoldCount=' + newlst.length + dspParam);
}

