/**
 * ===BASE===// facet // generateTrackselectionLayout.js
 * @param __Browser.prototype__
 * @param 
 */

Browser.prototype.generateTrackselectionLayout = function () {
    if (!this.facet) return;
    if (this.facet.dim1.mdidx == null) {
        // uninitiated
        var count = gflag.mdlst.length;
        if (count == 0) {
            // no md??
            this.facet.dim1.mdidx =
                this.facet.dim1.term =
                    this.facet.dim2.mdidx =
                        this.facet.dim2.term = null;
            return;
        }
        if (count == 1) {
            this.facet.dim1.mdidx = 0;
        } else if (count == 2) {
            this.facet.dim1.mdidx = gflag.mdlst[0].tag == literal_imd ? 1 : 0;
        } else {
            for (var i = 0; i < count; i++) {
                if (gflag.mdlst[i].tag != literal_imd) {
                    if (this.facet.dim1.mdidx == null) {
                        this.facet.dim1.mdidx = i;
                    } else {
                        this.facet.dim2.mdidx = i;
                        break;
                    }
                }
            }
        }
        // use 1 root term
        for (var n in gflag.mdlst[this.facet.dim1.mdidx].root) {
            this.facet.dim1.term = n;
            break;
        }
        // dim 2
        if (this.facet.dim2.mdidx != null) {
            for (var n in gflag.mdlst[this.facet.dim2.mdidx].root) {
                this.facet.dim2.term = n;
                break;
            }
        }
    }
    this.facet.dim1.dom.innerHTML = mdterm2str(this.facet.dim1.mdidx, this.facet.dim1.term);
    this.facet.rowlst = [];
    this.facet.collst = [];
    if (this.facet.dim2.mdidx == null) {
        // only one criterion applies, make a text tree
        this.facet.swapbutt.style.display = 'none';
        this.facet.dim2.dom.innerHTML = literal_facet_nouse;
        this.facet.div2.style.display = 'none';
        this.facet.div1.style.display = 'block';
        stripChild(this.facet.div1, 0);
        var ul = dom_create('ul', this.facet.div1);
        var idx = this.facet.dim1.mdidx;
        for (var cterm in gflag.mdlst[idx].p2c[this.facet.dim1.term]) {
            this.trackselectionoption_onecriteria(cterm, idx, ul);
        }
        return;
    }
// two criteria
    this.facet.swapbutt.style.display = 'inline';
    this.facet.dim2.dom.innerHTML = mdterm2str(this.facet.dim2.mdidx, this.facet.dim2.term);
    this.facet.div2.style.display = "block";
    this.facet.div1.style.display = "none";
    for (var cterm in gflag.mdlst[this.facet.dim1.mdidx].p2c[this.facet.dim1.term]) {
        this.facet.rowlst.push([cterm, this.facet.dim1.mdidx, '&#8862;']);
    }
    for (var cterm in gflag.mdlst[this.facet.dim2.mdidx].p2c[this.facet.dim2.term]) {
        this.facet.collst.push([cterm, 0, '&#8862;']);
    }
    this.generateTrackselectionGrid();
};

