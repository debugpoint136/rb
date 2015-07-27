/**
 * ===BASE===// baseFunc // cleanuphtmlholder .js
 * @param __Browser.prototype__
 * @param 
 */

Browser.prototype.cleanuphtmlholder = function () {
    /* do this before restoring status or changing genome */
// gene set
    if (this.genome.geneset) {
        stripChild(this.genome.geneset.lstdiv, 0);
    }
// hmtk
    for (var n in this.genome.hmtk) {
        var t = this.genome.hmtk[n];
        if (t.public) continue;
        if (isCustom(this.genome.hmtk[n].ft)) {
            delete this.genome.hmtk[n];
        }
    }
    this.tklst = [];
    if (this.hmheaderdiv) {
        stripChild(this.hmheaderdiv, 0);
    }
    stripChild(this.hmdiv, 0);
//stripChild(this.pwc.grp1, 0);
//stripChild(this.pwc.grp2, 0);
    this.pwc.gtn1 = [];
    this.pwc.gtn2 = [];

    this.genome.custtk.names = [];

// decor
    stripChild(this.decordiv, 0);
    if (this.decorheaderdiv) {
        stripChild(this.decorheaderdiv, 0);
    }

// mcm
    if (this.mcm) {
        this.mcm.lst = [];
        stripChild(this.mcm.holder.firstChild.firstChild, 0);
        stripChild(this.mcm.tkholder, 0);
    }

// session
    apps.session.url_holder.style.display = 'none';

// splinters
    this.splinters = {};
    stripChild(this.splinterHolder.firstChild.firstChild, 0);
    this.init_hmSpan();
    this.applyHmspan2holders();

// misc
    this.notes = [];

    /* bev cleanup
     var lst = document.getElementById("bev_dataregistry").firstChild.childNodes;
     for(var i=0; i<lst.length; i++)
     delete bev.data[lst[i].vectorname];
     stripChild(document.getElementById("bev_dataregistry").firstChild, 0);
     for(var cn in bev.genomeCanvasTd)
     stripChild(bev.genomeCanvasTd[cn], 0);
     */
    this.turnoffJuxtapose(false);
};

