/**
 * ===BASE===// baseFunc // tkpanelheight .js
 * @param __Browser.prototype__
 * @param 
 */

Browser.prototype.tkpanelheight = function () {
    return this.hmdiv.clientHeight + this.ideogram.canvas.height + this.decordiv.clientHeight;
};

