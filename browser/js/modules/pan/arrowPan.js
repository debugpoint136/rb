/**
 * ===BASE===// pan // arrowPan.js
 * @param __Browser.prototype__
 * @param 
 */

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

