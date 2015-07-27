/**
 * ===BASE===// matplot // matplot_drawtk.js
 * @param __Browser.prototype__
 * @param 
 */

Browser.prototype.matplot_drawtk = function (mtk, tk, tosvg) {
    /* draw a tk as a line
     * tk should already be in mtk.tklst
     * mtk scale should be defined and should not change!
     args:
     mtk: matplot tk
     tk: the tk of the path
     */
    var q = tk.qtc;
    var d = this.tkplot_line({
        ctx: mtk.canvas.getContext('2d'),
        tk: tk,
        max: mtk.maxv,
        min: mtk.minv,
        color: 'rgb(' + q.pr + ',' + q.pg + ',' + q.pb + ')',
        linewidth: 2,
        x: 0,
        y: densitydecorpaddingtop,
        w: (this.entire.atbplevel ? this.entire.bpwidth : 1),
        h: mtk.qtc.height,
        pointup: true, tosvg: tosvg
    });
    if (tosvg) return d;
};


/*** __matplot__ ends **/