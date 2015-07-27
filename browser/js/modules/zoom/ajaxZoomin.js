/**
 * ===BASE===// zoom // ajaxZoomin.js
 * @param __Browser.prototype__
 * @param 
 */

Browser.prototype.ajaxZoomin = function (x1, x2, animate) {
    /* for dragging on ideogram and clicking zoomin button
     x1/x2 are start,stop of selected horizontal position on ideogram, offset to hmdiv left position
     but not only chr1:start-stop
     */
    if (x1 >= x2) {
        this.shieldOff();
        return;
    }
// safeguard not to zoom beyond finest level
    if (this.pixelwidth2bp(x2 - x1) < this.hmSpan / MAXbpwidth_bold) {
        print2console('At finest level, cannot zoom in', 2);
        this.shieldOff();
        return;
    }
    this.weavertoggle((x2 - x1) * this.entire.summarySize);

// seek dsp boundary by user selection
    var rl = this.sx2rcoord(x1 - this.move.styleLeft);
    if (!rl) fatalError('null left point??');
    var rr = this.sx2rcoord(x2 - this.move.styleLeft);
    if (!rr) fatalError('null right point??');
    this.dspBoundary = {
        vstartr: rl.rid,
        vstarts: rl.sid,
        vstartc: rl.coord,
        vstopr: rr.rid,
        vstops: rr.sid,
        vstopc: rr.coord
    };

    if (animate) {
        this.animate_zoom_stat = 1;
        gflag.animate_zoom[this.horcrux] = {
            x1: x1,
            x2: x2,
            zoomin: true,
        };
        start_animate_zoom(this.horcrux);
    }
    var param = this.displayedRegionParam(rl.coord, rr.coord) + '&imgAreaSelect=on';
    this.ajaxX(param);
    if (gflag.syncviewrange) {
        var lst = gflag.syncviewrange.lst;
        for (var i = 0; i < lst.length; i++) {
            var b = lst[i];
            if (animate) {
                b.animate_zoom_stat = 1;
                gflag.animate_zoom[b.horcrux] = {
                    x1: x1,
                    x2: x2,
                    zoomin: true,
                };
                start_animate_zoom(b.horcrux);
            }
            b.ajaxX(param);
        }
    }
};

