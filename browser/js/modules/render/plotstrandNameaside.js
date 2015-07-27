/**
 * ===BASE===// render // plotstrandNameaside.js
 * @param 
 */

function plotstrandNameaside(ctx, x1, x2, y, h, strand, color, namestart, namestop, tosvg) {
    /* x1/x2: x start/stop of strand box
     namestart/stop: x start/stop of existing name, use 0 if there's no name,
     else strand will avoid name
     */
    var s = [];
    var a = x1 + 2, w = x2 - x1 - 4;
    if (namestart) {
        if (a < namestart) {
            if (x2 > namestop) {
                // draw strand surrounding name
                w = namestart - 4 - a;
                var ss = decoritem_strokeStrandarrow(ctx,
                    strand,
                    a, w, y, h,
                    color, tosvg);
                if (tosvg) s = s.concat(ss);
                a = namestop + 4;
                w = x2 - a - 2;
                ss = decoritem_strokeStrandarrow(ctx,
                    strand,
                    a, w, y, h,
                    color, tosvg);
                if (tosvg) s = s.concat(ss);
                return s;
            }
            // on left of name
            w = Math.min(x2, namestart - 2) - a - 2;
        } else {
            // on right of name
            a = Math.max(x1, namestop + 2) + 2;
            w = x2 - a - 2;
        }
    }
    s = decoritem_strokeStrandarrow(ctx,
        strand,
        a, w, y, h,
        color, tosvg);
    if (tosvg) return s;
}


