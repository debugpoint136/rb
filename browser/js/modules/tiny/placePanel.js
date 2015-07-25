/**
 * x/y can be missing for panel that is already shown
 * will adjust if it goes beyond the window
 * @param panel
 * @param x
 * @param y
 */

function placePanel(panel, x, y) {
    /* x/y can be missing for panel that is already shown
     will adjust if it goes beyond the window
     */
    var x0;
    if (x == undefined) {
        x0 = parseInt(panel.style.left);
    } else {
        panel.style.left = x0 = x;
    }
    var w = document.body.clientWidth + document.body.scrollLeft;
    if (x0 + panel.clientWidth >= w) {
        panel.style.left = Math.max(0, w - panel.clientWidth);
    }
    var y0;
    if (y == undefined) {
        y0 = parseInt(panel.style.top);
    } else {
        panel.style.top = y0 = y;
    }
    var h = document.body.clientHeight + document.body.scrollTop;
    if (y0 + panel.clientHeight > h)
        panel.style.top = Math.max(0, h - panel.clientHeight);
}