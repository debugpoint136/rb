/**
 * ===BASE===// render // trackHeightChanged .js
 * @param __Browser.prototype__
 * @param 
 */

Browser.prototype.trackHeightChanged = function () {
    /* call this whenever track height is changed, any one of them
     */
    if (!this.hmdiv) return;
    this.hmdiv.parentNode.style.height = this.hmdiv.clientHeight;
//if(this.mcm) this.mcmPlaceheader();
    if (this.decordiv) {
        this.decordiv.parentNode.style.height = this.decordiv.clientHeight;
    }
    if (this.onupdatey) {
        this.onupdatey(this);
    }
};


/*** __render__ ends ***/