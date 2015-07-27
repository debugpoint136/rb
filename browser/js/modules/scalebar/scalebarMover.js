/**
 * ===BASE===// scalebar // scalebarMover.js
 * @param 
 */

function scalebarMover(event) {
// mouse over to show beam
    var bbj = gflag.browser;
    var ctx = bbj.scalebar.arrow.getContext('2d');
    ctx.strokeStyle = '#f00';
    gflag.browser.scalebararrowStroke();
    gflag.browser.show_scalebarbeam();
}
