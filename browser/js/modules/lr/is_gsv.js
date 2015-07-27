/**
 * ===BASE===// lr // is_gsv.js
 * @param __Browser.prototype__
 * @param 
 */

Browser.prototype.is_gsv = function () {
    var t = this.juxtaposition.type;
    return t == RM_gsv_c || t == RM_gsv_kegg || t == RM_protein;
};
