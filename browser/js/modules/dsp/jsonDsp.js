/**
 * ===BASE===// dsp // jsonDsp.js
 * @param __Browser.prototype__
 * @param 
 */

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


