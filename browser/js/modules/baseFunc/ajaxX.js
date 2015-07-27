/**
 * ===BASE===// baseFunc // ajaxX.js
 * @param __Browser.prototype__
 * @param 
 */

Browser.prototype.ajaxX = function (param, norendering) {
    /* special treatmet for following conditions
     - jumping to a gene but got multiple hits
     - gsv itemlist updating
     - generate a splinter
     */
    gflag.bbj_x_updating[this.horcrux] = 1;
    if (this.main) {
        // cottonbbj mainless
        this.shieldOn();
    }
    var bbj = this;
    this.ajax(param + this.houseParam(), function (data) {
        bbj.ajaxX_cb(data, norendering);
    });
};

