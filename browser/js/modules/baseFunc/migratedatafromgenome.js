/**
 * ===BASE===// baseFunc // migratedatafromgenome .js
 * @param __Browser.prototype__
 * @param 
 */

Browser.prototype.migratedatafromgenome = function () {
    /* migrate data from genome to browser, no ajax
     genome must be already built
     supposed to be called after genome object is built
     */
    if (this.genome.geneset) {
        this.genome.geneset.textarea_submitnew.value = this.genome.defaultStuff.gsvlst;
    }
    if (apps.scp && apps.scp.textarea) {
        apps.scp.textarea.value = this.genome.defaultStuff.gsvlst;
    }
};

