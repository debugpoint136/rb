/**
 * ===BASE===// facet // facetclickedcell_remake.js
 * @param __Browser.prototype__
 * @param 
 */

Browser.prototype.facetclickedcell_remake = function () {
    /* remake single facet cell after updating
     tell which cell and context by gflag.tsp.invoke
     */
    var bbj = this.trunk ? this.trunk : this;
    var div = gflag.tsp.invoke.cell;
    var s1 = {};
    this.mdgettrack(div.term1, bbj.facet.dim1.mdidx, s1);
    var intersection = {};
    if (div.term2 != undefined) {
        // two term
        var s2 = {};
        this.mdgettrack(div.term2, bbj.facet.dim2.mdidx, s2);
        for (var tk in s1) {
            if (tk in s2) intersection[tk] = 1;
        }
    } else {
        intersection = s1;
    }
    var num = bbj.tracksetTwonumbers(intersection);
    div.innerHTML = ((num[1] == 0) ? '<span>0</span>' : '<span class=r>' + num[1] + '</span>') +
    '<span>/</span>' +
    '<span class=g>' + num[0] + '</span>';
    simulateEvent(div, 'click');
};


