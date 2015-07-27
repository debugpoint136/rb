/**
 * ===BASE===// scalebar // drawScalebarSlider.js
 * @param __Browser.prototype__
 * @param 
 */

Browser.prototype.drawScalebarSlider = function () {
    var ctx = this.scalebar.slider.getContext('2d');
    ctx.fillRect(0, 3, 1, this.scalebar.slider.height - 5);
    ctx.fillRect(0, 8, this.scalebar.slider.width, 1);
};
