/**
 * ===BASE===// pan // viewboxMU.js
 * @param 
 */

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

