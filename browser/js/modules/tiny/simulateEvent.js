/**
 * action: click, change, mouseover
 * @param dom
 * @param action
 */

function simulateEvent(dom, action) {
// action: click, change, mouseover,
    var e = document.createEvent('MouseEvents');
    e.initMouseEvent(action, true, true, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
    dom.dispatchEvent(e);
}