/**
 * ===BASE===// dsp // sethmspan_refresh.js
 * @param __Browser.prototype__
 * @param 
 */

Browser.prototype.sethmspan_refresh = function (val) {
    this.hmSpan = val;
    this.applyHmspan2holders();
    this.cloak();
    this.ajaxX(this.displayedRegionParam() + '&imgAreaSelect=on');
};

