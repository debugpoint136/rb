/**
 * __Browser.prototype__
 * @param tkobj
 * @param tosvg
 */

Browser.prototype.drawMcm_onetrack = function (tkobj, tosvg) {
    if (!this.mcm || !this.mcm.lst) return [];
    var svgdata = [];
    var c = tkobj.atC;
    var h = tk_height(tkobj);
    if (!c.alethiometer) {
        c.height = h;
        c.width = this.mcm.lst.length * tkAttrColumnWidth;
    }
    var ctx = c.getContext('2d');
    var clen = colorCentral.longlst.length - 1;
    for (var j = 0; j < this.mcm.lst.length; j++) {
        ctx.fillStyle = tkobj.attrcolor[j];
        ctx.fillRect(j * tkAttrColumnWidth, 0, tkAttrColumnWidth - 1, h);
        if (tosvg) svgdata.push({
            type: svgt_rect_notscrollable,
            x: j * tkAttrColumnWidth,
            w: tkAttrColumnWidth - 1,
            h: h,
            fill: ctx.fillStyle
        });
    }
    c.attr = tkobj.attrlst;
    if (tosvg) return svgdata;
};
