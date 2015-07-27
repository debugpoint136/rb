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

