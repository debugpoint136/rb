/**
 * ===BASE===// render // drawATCGlegend .js
 * @param __Browser.prototype__
 * @param 
 */

Browser.prototype.drawATCGlegend = function (waiting) {
    var c = this.basepairlegendcanvas;
    c.width = this.leftColumnWidth;
    var ctx = c.getContext('2d');
    ctx.clearRect(0, 0, c.width, c.height);
    if (waiting) {
        ctx.fillStyle = colorCentral.foreground_faint_5;
        ctx.font = "8pt Sans-serif";
        ctx.fillText('Loading sequence...', 0, 10);
        return;
    }
    ctx.fillStyle = ntbcolor.a;
    ctx.fillRect(0, 0, 15, c.height);
    ctx.fillStyle = ntbcolor.t;
    ctx.fillRect(16, 0, 15, c.height);
    ctx.fillStyle = ntbcolor.c;
    ctx.fillRect(32, 0, 15, c.height);
    ctx.fillStyle = ntbcolor.g;
    ctx.fillRect(48, 0, 15, c.height);
    ctx.fillStyle = ntbcolor.n;
    ctx.fillRect(64, 0, 15, c.height);
    ctx.fillStyle = "white";
    ctx.font = "bold 10pt Sans-serif";
    ctx.fillText("A", 3, 10);
    ctx.fillText("T", 19, 10);
    ctx.fillText("C", 35, 10);
    ctx.fillText("G", 51, 10);
    ctx.fillText("N", 67, 10);
};


