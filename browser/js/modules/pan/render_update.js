/**
 * ===BASE===// pan // render_update.js
 * @param __Browser.prototype__
 * @param 
 */

Browser.prototype.render_update = function () {
// at the end of panning and no ajax fired
    this.updateDspBoundary();
    this.drawTrack_browser_all();
    this.drawIdeogram_browser();
    this.drawNavigator();
    /* 5/13/14 do not issue drawing for cottonbbj here
     since that will be issued following drawing the weavertk
     */
};

