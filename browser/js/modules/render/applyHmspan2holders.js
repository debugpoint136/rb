/**
 * ===BASE===// render // applyHmspan2holders .js
 * @param __Browser.prototype__
 * @param 
 */

Browser.prototype.applyHmspan2holders = function () {
    if (this.navigator != null) {
        // in case of using splinters, need to sum up splinter width
        var s = this.hmSpan;
        for (var tag in this.splinters) {
            s += this.splinters[tag].hmSpan;
        }
        /* look through pending splinters (not working)
         for(var a in horcrux) {
         var b=horcrux[a];
         if(b.trunk && b.trunk.horcrux==this.horcrux) {
         s+=b.hmSpan;
         }
         }
         */
        this.navigator.canvas.width = s - 30;
    }
    if (this.scalebar != null) {
        this.scalebar.holder.style.width = this.hmSpan;
    }
    if (this.rulercanvas != null) {
        this.rulercanvas.parentNode.style.width = this.hmSpan;
    }
    this.hmdiv.parentNode.style.width =
        this.decordiv.parentNode.style.width =
            this.ideogram.canvas.parentNode.parentNode.style.width = this.hmSpan;
};

