/**
 * ===BASE===// zoom // cgiZoomin.js
 * @param __Browser.prototype__
 * @param 
 */

Browser.prototype.cgiZoomin = function (howmuch) {
    /* push button zoomin
     hmSpan divided by howmuch to get region to zoom into
     */
    var sp = parseInt((this.hmSpan - this.hmSpan / howmuch) / 2);
    if (sp >= this.hmSpan / 2) return;
    this.shieldOn();
    this.ajaxZoomin(sp, this.hmSpan - sp, true);
};

