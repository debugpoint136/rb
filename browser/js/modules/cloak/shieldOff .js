/**
 * ===BASE===// cloak // shieldOff .js
 * @param __Browser.prototype__
 * @param 
 */

Browser.prototype.shieldOff = function () {
    if (!this.shield) return;
    this.shield.style.display = 'none';
};

