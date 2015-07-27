/**
 * ===BASE===// facet // facet_choosedim.js
 * @param __Browser.prototype__
 * @param 
 */

Browser.prototype.facet_choosedim = function (mdidx, term, isrow) {
    if (isrow) {
        this.facet.dim1.mdidx = mdidx;
        this.facet.dim1.term = term;
        this.facet.dim1.dom.innerHTML = mdterm2str(mdidx, term);
        // may need to turm off dim2
        if (mdidx == this.facet.dim2.mdidx && term == this.facet.dim2.term) {
            this.facet.dim2.term = this.facet.dim2.mdidx = null;
            this.facet.dim2.dom.innerHTML = literal_facet_nouse;
        }
    } else {
        this.facet.dim2.mdidx = mdidx;
        this.facet.dim2.term = term;
        this.facet.dim2.dom.innerHTML = mdterm2str(mdidx, term);
    }
    menu_hide();
    apps.hmtk.bbj.generateTrackselectionLayout();
};

