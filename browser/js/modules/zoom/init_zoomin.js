/**
 * ===BASE===// zoom // init_zoomin.js
 * @param __Browser.prototype__
 * @param 
 */

Browser.prototype.init_zoomin = function (x, stitch) {
    document.body.addEventListener("mousemove", zoomin_M, false);
    document.body.addEventListener("mouseup", zoomin_MU, false);
    indicator2.style.display = "block";
    indicator2.leftarrow.style.display = "block";
    indicator2.rightarrow.style.display = "block";
    this.shieldOn();
    var pos = absolutePosition(this.hmdiv.parentNode);
    indicator2.style.left = x + document.body.scrollLeft;
    indicator2.style.top = pos[1];
    var th = this.tkpanelheight();
    indicator2.style.height = th;
    indicator2.leftarrow.style.top = th / 2 - indicator2.leftarrow.height / 2;
    indicator2.rightarrow.style.top = indicator2.leftarrow.style.top;
    indicator2.style.width = 0;
    gflag.zoomin = {
        oldx: x,
        x: x + document.body.scrollLeft,
        holderx: pos[0],
        beyondfinest: false,
        bbj: this,
        stitch: stitch,
    };
};
