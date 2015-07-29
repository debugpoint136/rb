/**
 * ===BASE===// render // init_hmSpan .js
 * @param __Browser.prototype__
 * @param 
 */

Browser.prototype.init_hmSpan = function () {
    var tobe = document.body.clientWidth - this.leftColumnWidth - 140;
    if (tobe < 800)
        this.hmSpan = 800;
    else
        this.hmSpan = parseInt(tobe / 10) * 10; // well, just to cope with letter display
};

