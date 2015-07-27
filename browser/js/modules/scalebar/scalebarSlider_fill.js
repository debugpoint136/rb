/**
 * ===BASE===// scalebar // scalebarSlider_fill.js
 * @param __Browser.prototype__
 * @param 
 */

Browser.prototype.scalebarSlider_fill = function () {
    if (!this.scalebar || !this.scalebar.slider) return;
    var bp = this.pixelwidth2bp(this.scalebar.slider.width);
    this.scalebar.says.innerHTML = bp > 10 ? parseInt(bp) : bp.toFixed(1);
    this.scalebar.says.style.left = parseInt(this.scalebar.slider.style.left) - this.scalebar.says.clientWidth - 3;
};
/*** __scalebar__ ends ***/
