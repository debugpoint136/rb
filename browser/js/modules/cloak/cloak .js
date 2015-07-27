/**
 * ===BASE===// cloak // cloak .js
 * @param __Browser.prototype__
 * @param 
 */

Browser.prototype.cloak = function () {
    if (!this.main) return;
    loading_cloak(this.main);
};

