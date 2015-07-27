/**
 * ===BASE===// dsp // turnoffJuxtapose.js
 * @param __Browser.prototype__
 * @param 
 */

Browser.prototype.turnoffJuxtapose = function (doajax) {
    /* argument is boolean, if true, will run ajax and show data over default region
     no syncing here
     */
    menu_hide();
    var oldjt = this.juxtaposition.type;
    if (oldjt == this.genome.defaultStuff.runmode) return;
    this.runmode_set2default();
    if (oldjt == RM_jux_n || oldjt == RM_jux_c) {
        if (doajax) {
            this.cloak();
            this.ajaxX(this.displayedRegionParam() + "&changeGF=on");
        }
    } else if (oldjt == RM_gsv_c || oldjt == RM_gsv_kegg || oldjt == RM_protein) {
        /* in case of gsv, border must be changed back!
         TODO border be bbj attribute
         */
        var s = this.genome.scaffold.current;
        this.border = {lname: s[0], lpos: 0, rname: s[s.length - 1], rpos: this.genome.scaffold.len[s[s.length - 1]]};
        if (this.genesetview.savelst) {
            // golden has this
            delete this.genesetview.savelst;
        }
        if (doajax) {
            this.cloak();
            var c = this.defaultposition();
            this.ajaxX(this.runmode_param() + '&imgAreaSelect=on&startChr=' + c[0] + '&startCoord=' + c[1] + '&stopChr=' + c[2] + '&stopCoord=' + c[3]);
        }
    } else {
        fatalError('turnoffJuxtapose: unknown juxtaposition.type ' + oldjt);
    }
};

