/**
 * ===BASE===// baseFunc // houseParam .js
 * @param __Browser.prototype__
 * @param 
 */

Browser.prototype.houseParam = function () {
    /* house keeping
     */
    if (this.weaver) {
        return trackParam(this.tklst, this.weaver.iscotton ? false : true) +
            '&dbName=' + this.genome.name +
            this.genome.customgenomeparam();
    }
    return trackParam(this.tklst) + '&dbName=' + this.genome.name + this.genome.customgenomeparam();
};
