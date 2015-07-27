/**
 * ===BASE===// scalebar // scalebararrowStroke.js
 * @param __Browser.prototype__
 * @param 
 */

Browser.prototype.scalebararrowStroke = function () {
    var x = 6;
    var ctx = this.scalebar.arrow.getContext('2d');
    ctx.clearRect(0, 0, 20, 16);
    ctx.beginPath();
    ctx.moveTo(x, 2);
    ctx.lineTo(x, 15);
    ctx.lineTo(1, 12);
    ctx.moveTo(x, 15);
    ctx.lineTo(x * 2 - 1, 12);
    ctx.stroke();
};
