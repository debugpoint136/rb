/**
 * ===BASE===// render // render_browser .js
 * @param __Browser.prototype__
 * @param 
 */

Browser.prototype.render_browser = function (tosvg) {
    /* render browser panel, all tracks and all the stuff must be ready
     not including bev, circlet, ...
     called for:
     - initiating browser panel
     - changedb
     - restoring status
     - change ghm width
     */

    this.drawRuler_browser(tosvg);
    this.drawTrack_browser_all();
    this.drawMcm(tosvg);
    this.mcmPlaceheader();
    this.drawIdeogram_browser(tosvg);
    this.scalebarSlider_fill();
    this.drawNavigator();
};


