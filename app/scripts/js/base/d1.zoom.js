/**
 * Created by dpuru on 2/27/15.
 */


/* __zoom__ */

function zoomin_MD(event) {
    event.preventDefault();
    gflag.browser.init_zoomin(event.clientX);
}

Browser.prototype.init_zoomin = function (x, stitch) {
    document.body.addEventListener("mousemove", zoomin_M, false);
    document.body.addEventListener("mouseup", zoomin_MU, false);
    indicator2.style.display = "block";
    indicator2.leftarrow.style.display = "block";
    indicator2.rightarrow.style.display = "block";
    this.shieldOn();
    var pos = absolutePosition(this.hmdiv.parentNode);
    indicator2.style.left = x + document.body.scrollLeft;
    indicator2.style.top = pos[1];
    var th = this.tkpanelheight();
    indicator2.style.height = th;
    indicator2.leftarrow.style.top = th / 2 - indicator2.leftarrow.height / 2;
    indicator2.rightarrow.style.top = indicator2.leftarrow.style.top;
    indicator2.style.width = 0;
    gflag.zoomin = {
        oldx: x,
        x: x + document.body.scrollLeft,
        holderx: pos[0],
        beyondfinest: false,
        bbj: this,
        stitch: stitch,
    };
};
function zoomin_M(event) {
// mouse move, only process horizontal move
    var z = gflag.zoomin;
    var currx = event.clientX + document.body.scrollLeft;
    var bpw = 0;
    if (currx > z.x) {
        if (currx < z.holderx + (z.stitch ? z.stitch.canvasstop + z.bbj.move.styleLeft : z.bbj.hmSpan)) {
            var pxw = currx - z.x;
            indicator2.style.width = pxw;
            bpw = z.bbj.pixelwidth2bp(pxw);
            if (bpw < z.bbj.hmSpan / MAXbpwidth_bold) {
                indicator2.veil.style.backgroundColor = 'red';
                z.beyondfinest = true;
            } else {
                indicator2.veil.style.backgroundColor = 'blue';
                z.beyondfinest = false;
            }
        }
    } else {
        if (currx > z.holderx + (z.stitch ? z.stitch.canvasstart + z.bbj.move.styleLeft : 0)) {
            var pxw = z.x - currx;
            indicator2.style.width = pxw;
            indicator2.style.left = currx;
            bpw = z.bbj.pixelwidth2bp(pxw);
            if (bpw < z.bbj.hmSpan / MAXbpwidth_bold) {
                indicator2.veil.style.backgroundColor = 'red';
                z.beyondfinest = true;
            } else {
                indicator2.veil.style.backgroundColor = 'blue';
                z.beyondfinest = false;
            }
        }
    }
    indicator2.veil.firstChild.firstChild.firstChild.innerHTML = '';
    if (bpw != 0) {
        var str = parseInt(bpw) + ' bp';
        if (parseInt(indicator2.style.width) > (str.length * 15)) {
            indicator2.veil.firstChild.firstChild.firstChild.innerHTML = str;
        }
    }
}
function zoomin_MU(event) {
    indicator2.style.display = "none";
    indicator2.leftarrow.style.display = "none";
    indicator2.rightarrow.style.display = "none";
    document.body.removeEventListener("mousemove", zoomin_M, false);
    document.body.removeEventListener("mouseup", zoomin_MU, false);
    if (bbjisbusy()) return;
    var z = gflag.zoomin;
    z.bbj.shieldOff();
    if (event.clientX == z.oldx) return;
    if (z.beyondfinest) return;
    indicator2.veil.firstChild.firstChild.firstChild.innerHTML = '';
    var x1 = parseInt(indicator2.style.left) - z.holderx;
    var x2 = x1 + parseInt(indicator2.style.width);
    if (z.stitch) {
        x1 -= z.bbj.move.styleLeft;
        x2 -= z.bbj.move.styleLeft;
        var chr2pos = {};
        for (var i = 0; i < z.stitch.lst.length; i++) {
            var h = z.stitch.lst[i];
            var w = h.targetstop - h.targetstart;
            var a = b = -1;
            if (h.strand == '+') {
                if (Math.max(h.q1, x1) < Math.min(h.q2, x2)) {
                    a = h.targetstart + parseInt((Math.max(x1, h.q1) - h.q1) * w / (h.q2 - h.q1));
                    b = h.targetstop - parseInt((h.q2 - Math.min(x2, h.q2)) * w / (h.q2 - h.q1));
                }
            } else {
                if (Math.max(h.q2, x1) < Math.min(h.q1, x2)) {
                    a = h.targetstart + parseInt((h.q1 - Math.min(x2, h.q1)) * w / (h.q1 - h.q2));
                    b = h.targetstop - parseInt((Math.max(x1, h.q2) - h.q2) * w / (h.q1 - h.q2));
                }
            }
            if (a != -1) {
                var c = z.bbj.regionLst[h.targetrid][0];
                if (c in chr2pos) {
                    chr2pos[c][0] = Math.min(a, chr2pos[c][0]);
                    chr2pos[c][1] = Math.max(b, chr2pos[c][1]);
                } else {
                    chr2pos[c] = [a, b];
                }
            }
        }
        var maxlen = 0, maxchr;
        for (var n in chr2pos) {
            var a = chr2pos[n][1] - chr2pos[n][0];
            if (a > maxlen) {
                maxchr = n;
                maxlen = a;
            }
        }
        z.bbj.weavertoggle(maxlen);
        z.bbj.cgiJump2coord(maxchr + ':' + chr2pos[maxchr][0] + '-' + chr2pos[maxchr][1]);
        return;
    }
    z.bbj.ajaxZoomin(x1, x2, true);
}

function start_animate_zoom(hrx) {
    var z = gflag.animate_zoom[hrx];
    var bbj = horcrux[hrx];
    bbj.shieldOn();
    z.xzoom = 1;
    z.xleft = bbj.move.styleLeft;
// total # of frame in the little film
    z.count = Math.min(Math.ceil(bbj.hmSpan / (z.x2 - z.x1)), 10) * 10;
// change scale in each frame
    if (z.zoomin) {
        z.foldchange = bbj.hmSpan / (z.x2 - z.x1) - 1;
    } else {
        z.foldchange = (z.x2 - z.x1) / bbj.hmSpan - 1;
    }
    z.foldchange /= z.count;
// x offset adjustment
    var c0 = (z.x2 + z.x1) / 2 - bbj.move.styleLeft;
    var c1 = bbj.entire.spnum / 2;
    z.x_shift = (c1 - c0) * z.foldchange + ((bbj.hmSpan - z.x1 - z.x2) / 2) / z.count;
// TODO .style.left
    run_animate_zoom(hrx);
}

function run_animate_zoom(hrx) {
    var z = gflag.animate_zoom[hrx];
    var bbj = horcrux[hrx];
    if (z.count <= 0) {
        may_drawbrowser_afterzoom(hrx);
        return;
    }
    bbj.zoom_dom_movable(z.xzoom, z.xleft);
    z.xzoom += z.foldchange;
    z.xleft += z.x_shift;
    z.count--;
    setTimeout('run_animate_zoom(' + hrx + ')', 5);
}

Browser.prototype.zoom_dom_movable = function (v, x) {
// for animated zoom
    var r = this.rulercanvas;
    if (r != null) {
        r.style.webkitTransform =
            r.style.mozTransform =
                r.style.transform = 'scale(' + v + ',1)';
        r.style.left = x;
    }
    /* do not change ideogram, not fixed yet
     var d1=this.ideogram.canvas.parentNode.parentNode;
     d1.style.webkitTransform=
     d1.style.mozTransform=
     d1.style.transform=
     */
    var d2 = this.hmdiv;
    var d3 = this.decordiv;
    d2.style.webkitTransform =
        d2.style.mozTransform =
            d2.style.transform =
                d3.style.webkitTransform =
                    d3.style.mozTransform =
                        d3.style.transform = 'scale(' + v + ',1)';
    d2.style.left = d3.style.left = x;
};

function may_drawbrowser_afterzoom(hrx) {
    var bbj = horcrux[hrx];
    if (bbj.animate_zoom_stat == 1) {
        bbj.cloak();
        // data from ajax not ready yet
        setTimeout('may_drawbrowser_afterzoom(' + hrx + ')', 100);
        return;
    }
    bbj.zoom_dom_movable(1, bbj.move.styleLeft);
    bbj.drawRuler_browser(false);
    bbj.drawTrack_browser_all();
    bbj.drawIdeogram_browser(false);
    bbj.unveil();
    bbj.shieldOff();
}


function browser_zoomin(event) {
    var t = event.target;
    if (!t.fold) t = t.parentNode;
    gflag.browser.cgiZoomin(t.fold);
}
function browser_zoomout(event) {
    var t = event.target;
    if (!t.fold) t = t.parentNode;
    gflag.browser.clicked_zoomoutbutt = t; // for placing warning msg
    gflag.browser.cgiZoomout(t.fold, false);
}
function browser_pan(event) {
    gflag.browser.arrowPan(event.target.direction, event.target.fold);
}


Browser.prototype.cgiZoomin = function (howmuch) {
    /* push button zoomin
     hmSpan divided by howmuch to get region to zoom into
     */
    var sp = parseInt((this.hmSpan - this.hmSpan / howmuch) / 2);
    if (sp >= this.hmSpan / 2) return;
    this.shieldOn();
    this.ajaxZoomin(sp, this.hmSpan - sp, true);
};

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

Browser.prototype.cgiZoomout = function (howmuch, enforce) {
    /* called by "zoom out" button, so if already meets borders, disable zoom out button
     argument: 0.5 for zoom out by 1.5 fold
     */
    /* this is not in use as the flanking can hit border..
     if(this.atLeftBorder() && this.atRightBorder()) {
     print2console('Cannot zoom out: showing entire range',2);
     return;
     }
     */
// a step of alert as required by our dear reviewer
    if (!enforce) {
        var tcount = 0;
        for (var i = 0; i < this.tklst.length; i++) {
            var tk = this.tklst[i];
            if (tk.ft != FT_matplot && tk.ft != FT_cm_c && tk.ft != FT_matplot && !tkishidden(tk) && !isNumerical(tk) && tk.ft != FT_cat_n && tk.ft != FT_cat_c) {
                for (var j = 0; j < tk.data.length; j++)
                    tcount += tk.data[j].length;
            }
        }
        if (tcount * (howmuch + 1) > trackitemnumAlert * 2) {
            gflag.zoomout.fold = howmuch;
            menu_shutup();
            menu.zoomoutalert.style.display = 'block';
            menu.zoomoutalert.count.innerHTML = tcount;
            menu.zoomoutalert.fold.innerHTML = howmuch;
            menu_show_beneathdom(0, this.clicked_zoomoutbutt);
            return;
        }
    }
    howmuch = parseFloat(howmuch);

    this.weavertoggle(this.hmSpan * this.entire.summarySize * (1 + howmuch));
    this.shieldOn();
    this.animate_zoom_stat = 1;
    var w = this.hmSpan / (1 + howmuch);
    gflag.animate_zoom[this.horcrux] = {
        x1: (this.hmSpan - w) / 2,
        x2: (this.hmSpan + w) / 2,
        zoomin: false,
    };
    start_animate_zoom(this.horcrux);
    var param = this.displayedRegionParam() + "&zoom=" + (howmuch / 2);
    this.ajaxX(param);
// for golden
    if (gflag.syncviewrange) {
        var lst = gflag.syncviewrange.lst;
        for (var i = 0; i < lst.length; i++) {
            var b = lst[i];
            b.animate_zoom_stat = 1;
            var w = b.hmSpan / (1 + howmuch);
            gflag.animate_zoom[b.horcrux] = {
                x1: (b.hmSpan - w) / 2,
                x2: (b.hmSpan + w) / 2,
                zoomin: false,
            };
            start_animate_zoom(b.horcrux);
            b.ajaxX(param);
        }
    }
};

function risky_zoomout() {
// despite warning, user still takes risky move
    gflag.menu.bbj.cgiZoomout(gflag.zoomout.fold, true);
    menu_hide();
}


/*** __zoom__ ends ***/