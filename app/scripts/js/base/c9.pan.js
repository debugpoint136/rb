/**
 * Created by dpuru on 2/27/15.
 */

/* __pan__ */


Browser.prototype.placeMovable = function (cleft) {
    /* when running gsv with a small number of items
     entire.spnum will be smaller than hmspan
     */
    if (!this.hmdiv) return;
    if (cleft > 0) {
        cleft = 0;
    } else if (cleft < 0 && (cleft < this.hmSpan - this.entire.spnum)) {
        cleft = this.hmSpan - this.entire.spnum;
    }
    this.move.styleLeft = cleft;
    if (this.decordiv) this.decordiv.style.left = cleft;
    if (this.hmdiv) this.hmdiv.style.left = cleft;
    if (this.ideogram && this.ideogram.canvas) this.ideogram.canvas.parentNode.style.left = cleft;
    if (this.rulercanvas) this.rulercanvas.style.left = cleft;
};

function viewboxMD(event) {
    if (event.button != 0) return;
    event.preventDefault();
    var bbj = gflag.browser;
    if (bbj.entire.spnum <= bbj.hmSpan) {
        /* don't move if entire.spnum is smaller than hmspan
         this is the case of running gsv with small # of items
         but need to issue 'clicking' event
         */
        bbj.move.oldpos = bbj.move.styleLeft; // this must be set equal or else click won't work
        track_click(event);
        return;
    }
// initiate move
    pica_hide();

    if (pica.tk.ft == FT_weaver_c && pica.tk.weaver.mode == W_rough) {
        /* if pressing cursor on the query band of rough weavertk,
         will issue zoom in
         */
        var pos = absolutePosition(pica.tk.canvas);
        if (event.clientY + document.body.scrollTop - absolutePosition(pica.tk.canvas)[1] > pica.tk.qtc.height) {
            var x = event.clientX + document.body.scrollLeft - absolutePosition(bbj.hmdiv.parentNode)[0] - bbj.move.styleLeft;
            for (var i = 0; i < pica.tk.weaver.stitch.length; i++) {
                var stc = pica.tk.weaver.stitch[i];
                if (x >= stc.canvasstart && x <= stc.canvasstop) {
                    bbj.init_zoomin(event.clientX, stc);
                    return;
                }
            }
        }
    }

    document.body.addEventListener("mousemove", viewboxM, false);
    document.body.addEventListener("mouseup", viewboxMU, false);
    gflag.movebbj = bbj;
    bbj.move.oldpos = bbj.move.styleLeft;
    bbj.move.oldx =
        bbj.move.mousex = event.clientX;
}

function viewboxM(event) {
    var bbj = gflag.movebbj;
    bbj.shieldOn();
    if (bbj.entire.atbplevel) {
        // escape move distance that is smaller than bpwidth
        var moved = event.clientX - bbj.move.mousex;
        if (Math.abs(moved) >= bbj.entire.bpwidth) {
            var s = parseInt(moved / bbj.entire.bpwidth) * bbj.entire.bpwidth;
            bbj.placeMovable(bbj.move.styleLeft + s);
            bbj.move.mousex = event.clientX;
            if (!bbj.is_gsv()) {
                bbj.updateDspstat();
                if (gflag.syncviewrange) {
                    var lst = gflag.syncviewrange.lst;
                    for (var i = 0; i < lst.length; i++) {
                        lst[i].placeMovable(lst[i].move.styleLeft + s);
                        lst[i].updateDspstat();
                    }
                }
            }
        }
        return;
    }
    var s = event.clientX - bbj.move.mousex;
    bbj.placeMovable(bbj.move.styleLeft + s);
    bbj.move.mousex = event.clientX;
    if (!bbj.is_gsv()) {
        bbj.updateDspstat();
        if (gflag.syncviewrange) {
            var lst = gflag.syncviewrange.lst;
            for (var i = 0; i < lst.length; i++) {
                lst[i].placeMovable(lst[i].move.styleLeft + s);
                lst[i].updateDspstat();
            }
        }
    }
}

function viewboxMU() {
    /*
     move left: scroll to right, newly exposed regions on left
     move right: scroll to left, newly exposed regions on right

     if at leisure, must not forget to label all bam reads
     so that they can escape clipping processing
     */
    var bbj = gflag.movebbj;
    if (bbj.move.mousex == bbj.move.oldx) {
        document.body.removeEventListener("mousemove", viewboxM, false);
        document.body.removeEventListener("mouseup", viewboxMU, false);
        bbj.shieldOff();
        return;
    }
    bbj.move.direction = null;
    var sylst = null;
    if (gflag.syncviewrange) sylst = gflag.syncviewrange.lst;
    for (var i = 0; i < bbj.tklst.length; i++) {
        var t = bbj.tklst[i];
        if (t.ft == FT_bam_n || t.ft == FT_bam_c) {
            for (var j = 0; j < t.data.length; j++) {
                for (var k = 0; k < t.data[j].length; k++) {
                    t.data[j][k].existbeforepan = true;
                }
            }
        }
    }
    if (bbj.atLeftBorder() && bbj.atRightBorder()) {
        // at leisure
        bbj.render_update();
        if (sylst) {
            for (var i = 0; i < sylst.length; i++) {
                sylst[i].render_update();
            }
        }
        if (bbj.onupdatex) {
            bbj.onupdatex(bbj);
        }
    } else if (bbj.move.styleLeft > bbj.move.oldpos) {
        /*** drag canvas to right ***/
        /* see if number of summary points beyond move.styleLeft is below hmSpan */
        if (-bbj.move.styleLeft <= bbj.hmSpan) {
            if (bbj.atLeftBorder()) {
                // at leisure
                bbj.render_update();
                if (sylst) {
                    for (var i = 0; i < sylst.length; i++) {
                        sylst[i].render_update();
                    }
                }
                if (bbj.onupdatex) {
                    bbj.onupdatex(bbj);
                }
            } else {
                // request data
                bbj.move.direction = 'l';
                var moveSize = bbj.move.styleLeft - bbj.move.oldpos;
                var moveDist;
                if (bbj.entire.atbplevel) {
                    moveDist = parseInt(moveSize / bbj.entire.bpwidth);
                } else {
                    moveDist = parseInt(moveSize * bbj.entire.summarySize);
                }
                var param = bbj.displayedRegionParamMove() + '&summarySize=' + moveSize + '&distance=' + moveDist + '&move=' + bbj.move.direction + (bbj.entire.atbplevel ? '&atbplevel=on' : '') + bbj.mayShowDsp();
                bbj.cloak();
                bbj.ajaxX(param);
                if (sylst) {
                    for (var i = 0; i < sylst.length; i++) {
                        var b = sylst[i];
                        b.move.direction = 'l';
                        b.ajaxX(param);
                    }
                }
            }
        } else {
            // at leisure, there's still spare space on left, no ajax
            bbj.render_update();
            if (sylst) {
                for (var i = 0; i < sylst.length; i++) {
                    sylst[i].render_update();
                }
            }
            if (bbj.onupdatex) {
                bbj.onupdatex(bbj);
            }
        }
    } else if (bbj.move.styleLeft < bbj.move.oldpos) {
        /*** drag canvas to left ***/
        /* see if number of summary points beyond hmSpan-move.styleLeft is below hmSpan */
        if (bbj.entire.spnum - (bbj.hmSpan - bbj.move.styleLeft) <= bbj.hmSpan) {
            if (bbj.atRightBorder()) {
                // at leisure
                bbj.render_update();
                if (sylst) {
                    for (var i = 0; i < sylst.length; i++) {
                        sylst[i].render_update();
                    }
                }
                if (bbj.onupdatex) {
                    bbj.onupdatex(bbj);
                }
            } else {
                // request data
                bbj.move.direction = 'r';
                var moveSize = bbj.move.oldpos - bbj.move.styleLeft;
                var moveDist;
                if (bbj.entire.atbplevel)
                    moveDist = parseInt(moveSize / bbj.entire.bpwidth);
                else
                    moveDist = parseInt(moveSize * bbj.entire.summarySize);
                var param = bbj.displayedRegionParamMove() + '&summarySize=' + moveSize + '&distance=' + moveDist + '&move=' + bbj.move.direction + (bbj.entire.atbplevel ? '&atbplevel=on' : '') + bbj.mayShowDsp();
                bbj.cloak();
                bbj.ajaxX(param);
                if (sylst) {
                    for (var i = 0; i < sylst.length; i++) {
                        var b = sylst[i];
                        b.move.direction = 'r';
                        b.ajaxX(param);
                    }
                }
            }
        } else {
            // at leisure, no ajax
            bbj.render_update();
            if (sylst) {
                for (var i = 0; i < sylst.length; i++) {
                    sylst[i].render_update();
                }
            }
            if (bbj.onupdatex) {
                bbj.onupdatex(bbj);
            }
        }
    }
    document.body.removeEventListener("mousemove", viewboxM, false);
    document.body.removeEventListener("mouseup", viewboxMU, false);
    bbj.shieldOff();
}

Browser.prototype.render_update = function () {
// at the end of panning and no ajax fired
    this.updateDspBoundary();
    this.drawTrack_browser_all();
    this.drawIdeogram_browser();
    this.drawNavigator();
    /* 5/13/14 do not issue drawing for cottonbbj here
     since that will be issued following drawing the weavertk
     */
};

Browser.prototype.mayShowDsp = function () {
    /* at thin/full mode, must not do dsp filtering
     */
    var show = false;
    for (var i = 0; i < this.tklst.length; i++) {
        var t = this.tklst[i];
        if ((t.ft == FT_lr_c || t.ft == FT_lr_n) && (t.mode == M_trihm || t.mode == M_arc)) {
            show = true;
            break;
        }
    }
    if (!show) return '';
    var lst = [];
    for (i = this.dspBoundary.vstartr; i <= this.dspBoundary.vstopr; i++) {
        var r = this.regionLst[i];
        lst.push(r[0]);
        lst.push(r[3]);
        lst.push(r[4]);
    }
    return '&existingDsp=' + lst.join(',');
};

Browser.prototype.arrowPan = function (direction, fold) {
// pan over cached region by clicking arrow button
    var sp2pan = parseInt(fold * this.hmSpan);
    if (direction == 'l') {
        sp2pan = Math.min(-this.move.styleLeft, sp2pan);
    } else {
        sp2pan = Math.min(sp2pan, this.entire.spnum + this.move.styleLeft - this.hmSpan);
    }
    if (sp2pan <= 0) return;
    this.move.direction = direction;
// don't call simulate viewboxMD(event) as cursor x will disrupt
    gflag.movebbj = this;
    this.move.oldpos = this.move.styleLeft;
    this.move.oldx = this.move.mousex = 500;
    gflag.arrowpan = {bbj: this, span: sp2pan, dir: direction};
    arrowPan_do();
    invisible_shield(document.body);
};

function arrowPan_do() {
    var a = gflag.arrowpan;
    if (a.span <= 0) {
        viewboxMU();
        invisibleBlanket.style.display = 'none';
        return;
    }
    a.bbj.move.styleLeft += a.dir == 'l' ? 3 : -3;
    a.bbj.move.mousex = 600;
    a.bbj.placeMovable(a.bbj.move.styleLeft);
    a.span -= 3;
    setTimeout(arrowPan_do, 1);
}

/* __pan__ ends */