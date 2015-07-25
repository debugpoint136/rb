/**
 * if to app shortcut button in ftb, need to add body scrolling offset
 * args:
 * fromdom/todom: from/to dom object, used to get coord on page
 * toIsFixed: whether todom is position:fixed attribute, if so, need to add body scrolling offset

 * @param fromdom
 * @param todom
 * @param toIsFixed
 */

function indicator4fly(fromdom, todom, toIsFixed) {
    /* if to app shortcut button in ftb, need to add body scrolling offset
     args:
     fromdom/todom: from/to dom object, used to get coord on page
     toIsFixed: whether todom is position:fixed attribute, if so, need to add body scrolling offset

     TODO not supports fromdom position:fixed
     */
    var pos1 = absolutePosition(fromdom);
    var pos2 = absolutePosition(todom);
    if (toIsFixed) {
        pos2[0] += document.body.scrollLeft;
        pos2[1] += document.body.scrollTop;
    }
    var w1 = fromdom.clientWidth;
    var h1 = fromdom.clientHeight;
    var w2 = todom.clientWidth;
    var h2 = todom.clientHeight;
// animate 20 frames
    indicator4.style.display = 'block';
    indicator4.style.width = w1;
    indicator4.style.height = h1;
    indicator4.style.left = pos1[0];
    indicator4.style.top = pos1[1];
    indicator4.count = 0;
    indicator4.xincrement = (pos2[0] - pos1[0]) / 20;
    indicator4.yincrement = (pos2[1] - pos1[1]) / 20;
    indicator4.wshrink = (w2 - w1) / 20;
    indicator4.hshrink = (h2 - h1) / 20;
    indicator4actuallyfly();
}