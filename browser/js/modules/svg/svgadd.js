/**
 * ===BASE===// svg // svgadd.js
 * @param __Browser.prototype__
 * @param 
 */

Browser.prototype.svgadd = function (e) {
    /* note: range limit for scrollables [0, hmSpan]
     but not this one!! [X, hmSpan+x]
     */
    var L = this.move.styleLeft,
        X = this.svg.gx,
        Y = this.svg.gy;
    switch (e.type) {
        case svgt_no:
            return;
        case svgt_line:
        case svgt_line_notscrollable:
            var M = e.type == svgt_line;
            if (M) {
                if (e.x1 + L > this.hmSpan || e.x2 + L < 0) return;
                e.x1 = Math.max(0 - L, e.x1);
                e.x2 = Math.min(this.hmSpan - L, e.x2);
            }
            this.svg.content.push('<line ' +
            'x1="' + (X + e.x1 + (M ? L : 0)) + '" y1="' + (Y + e.y1) + '" x2="' + (X + e.x2 + (M ? L : 0)) + '" y2="' + (Y + e.y2) + '" style="' +
            svgColor('stroke', e.color ? e.color : colorCentral.foreground) +
            (e.w ? 'stroke-width:' + e.w + ';' : '') + '"/>');
            return;
        case svgt_text:
        case svgt_text_notscrollable:
            var M = e.type == svgt_text;
            var x = e.x + L;
            if (M) {
                if (e.x + L < 0 || e.x + L > this.hmSpan) return;
            }
            this.svg.content.push('<text font-family="arial" ' +
            'x="' + (X + e.x + (M ? L : 0)) + '" y="' + (Y + e.y) + '" ' +
            (e.transform ? 'transform="' + e.transform + '" ' : '') +
            'style="' +
            'font-size:' + (e.size ? e.size : '8pt') + ';' +
            svgColor('fill', e.color ? e.color : colorCentral.foreground) +
            (e.bold ? 'font-weight:bold;' : '') +
            '">' + e.text + '</text>');
            return;
        case svgt_rect:
        case svgt_rect_notscrollable:
            var M = e.type == svgt_rect;
            if (M) {
                if (e.x + e.w + L < 0) return;
                if (e.x + L > this.hmSpan) return;
                if (e.x + L < 0) {
                    e.w += e.x + L;
                    e.x = 0 - L;
                }
                if (e.x + e.w + L > this.hmSpan) {
                    e.w -= e.x + e.w + L - this.hmSpan;
                }
            }
            this.svg.content.push('<rect x="' + (X + e.x + (M ? L : 0)) + '" y="' + (Y + e.y) + '" ' +
            'width="' + e.w + '" height="' + e.h + '" style="' +
            svgColor('fill', e.fill ? e.fill : 'none') +
            (e.stroke ? svgColor('stroke', e.stroke) : '') +
            '"/>');
            return;
        case svgt_arc:
            if (e.x1 + L > this.hmSpan) return;
            if (e.x2 + L < 0) return;
            if (e.x1 + L < 0) {
                // need to compute new x1/y1
                return;
            }
            if (e.x2 + L > this.hmSpan) {
                // need to compute new x2/y2
                return;
            }
            this.svg.content.push('<path d="M' + (X + e.x1 + L) + ' ' + (Y + e.y1) +
            ' A ' + e.radius + ' ' + e.radius + ' 1 0 0 ' + (X + e.x2 + L) + ' ' + (Y + e.y2) + '"' +
            ' style="fill: none; ' + svgColor('stroke', e.color) + ' stroke-width:1;"/>');
            return;
        case svgt_trihm:
            /*       p3
             p4      p2
             p1
             */
            if (e.x4 + L > this.hmSpan) return;
            if (e.x2 + L < 0) return;
            if (e.x4 + L < 0) {
                // need to compute new x4/y4
                return;
            }
            if (e.x2 + L > this.hmSpan) {
                // need to compute new x2/y2
                return;
            }
            this.svg.content.push('<path d="M' + (X + e.x1 + L) + ' ' + (Y + Math.max(0, e.y1)) +
            ' L' + (X + e.x2 + L) + ' ' + (Y + Math.max(0, e.y2)) +
            ' L' + (X + e.x3 + L) + ' ' + (Y + Math.max(0, e.y3)) +
            ' L' + (X + e.x4 + L) + ' ' + (Y + Math.max(0, e.y4)) +
            ' Z" ' +
            'style="' + svgColor('fill', e.color) + '"/>');
            break;
        case svgt_polygon:
            var lst = [];
            for (var i = 0; i < e.points.length; i++) {
                var p = e.points[i];
                lst.push((X + p[0] + L) + ',' + (Y + p[1]));
            }
            this.svg.content.push('<polygon points="' + lst.join(' ') + '" style="' +
            svgColor('fill', e.fill) +
            '"/>');
            return;
        default:
            fatalError('unknown svg tag type ' + e.type);
    }
};


