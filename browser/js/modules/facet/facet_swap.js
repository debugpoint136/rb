/**
 * ===BASE===// facet // facet_swap.js
 * @param __Browser.prototype__
 * @param 
 */

Browser.prototype.facet_swap = function () {
    var f = this.facet;
    if (f.dim2.mdidx == null) return;
    var a = f.dim2.mdidx,
        b = f.dim2.term,
        c = f.dim2.dom.innerHTML;
    f.dim2.mdidx = f.dim1.mdidx;
    f.dim2.term = f.dim1.term;
    f.dim2.dom.innerHTML = f.dim1.dom.innerHTML;
    f.dim1.mdidx = a;
    f.dim1.term = b;
    f.dim1.dom.innerHTML = c;
    this.generateTrackselectionLayout();
};

