/**
 * @param obj
 * @return c <br><br><br>
 */

function absolutePosition(obj) {
    var c = [0, 0];
    if (obj.offsetParent) {
        var o2 = obj;
        do {
            var b = parseInt(o2.style.borderLeftWidth);
            c[0] += o2.offsetLeft + (isNaN(b) ? 0 : b);
            b = parseInt(o2.style.borderTopWidth);
            c[1] += o2.offsetTop + (isNaN(b) ? 0 : b);
        } while (o2 = o2.offsetParent);
    }
    return c;
}