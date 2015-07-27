/**
 * ===BASE===// pan // viewboxMD.js
 * @param 
 */

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

