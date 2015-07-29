/**
 * ===BASE===// cloak // shieldOn .js
 * @param __Browser.prototype__
 * @param 
 */

Browser.prototype.shieldOn = function () {
    if (!this.main || !this.shield) return;
    var d = this.main;
    var s = this.shield;
    s.style.display = 'block';
    s.style.width = d.offsetWidth;
    s.style.height = d.offsetHeight;
};

