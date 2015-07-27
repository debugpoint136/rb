/**
 * ===BASE===// cloak // loading_cloak.js
 * @param 
 */

function loading_cloak(dom) {
// images/loading.gif size: 128x128
    var pos = absolutePosition(dom);
    waitcloak.style.display = 'block';
    waitcloak.style.left = pos[0];
    waitcloak.style.top = pos[1];
    var w = dom.clientWidth;
    var h = dom.clientHeight;
    waitcloak.style.width = w;
    waitcloak.style.height = h;
// roller
    waitcloak.firstChild.style.marginTop = h > 128 ? (h - 128) / 2 : 0;
    waitcloak.firstChild.style.marginLeft = w > 128 ? (w - 128) / 2 : 0;
}
