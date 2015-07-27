/**
 * ===BASE===// scalebar // show_scalebarbeam.js
 * @param __Browser.prototype__
 * @param 
 */

Browser.prototype.show_scalebarbeam = function () {
    var s = scalebarbeam;
    s.style.display = 'block';
    s.style.width = this.scalebar.slider.width;
    var pos = absolutePosition(this.scalebar.slider);
    s.style.left = pos[0];
    s.style.top = pos[1] + this.scalebar.slider.height;
    s.style.height = this.tkpanelheight() + (this.rulercanvas ? this.rulercanvas.height : 0);
};
