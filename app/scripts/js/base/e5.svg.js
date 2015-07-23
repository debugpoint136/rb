/**
 * Created by dpuru on 2/27/15.
 */
/*** __svg__ ***/
function svgpanelhide() {
    pagecloak.style.display = 'none';
    panelFadeout(apps.svg.main);
}
function svgpanelshow() {
// called from menu option
    cloakPage();
    panelFadein(apps.svg.main, 100 + document.body.scrollLeft, 100 + document.body.scrollTop);
    apps.svg.bbj = gflag.menu.bbj;
    apps.svg.urlspan.innerHTML = '';
    menu_hide();
}

function svgColor(type, colorstr) {
    var color = colorstr.toLowerCase();
    if (color.substr(0, 4) == 'rgba') {
        var t = color.split(/[\(\)]/)[1].split(',');
        if (t.length == 3) {
            return type + ':rgb(' + t.join(',') + ');';
        }
        if (t.length == 4) {
            return type + ':rgb(' + t[0] + ',' + t[1] + ',' + t[2] + ');' + type + '-opacity:' + t[3] + ';';
        }
        return type + ':black;';
    }
    return type + ':' + colorstr + ';';
}

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


function makesvg_browserpanel_pushbutt(event) {
    /* called by pushing "generate graph" buttons
     called with trunk browser, but not splinter
     */
    event.target.disabled = true;
    apps.svg.urlspan.innerHTML = 'working...';

    var showtklabel = apps.svg.showtklabel.checked;

    /* dimension of entire graph
     for safety reason, tk label height is included for all tracks to estimate height
     */
    var bbj = apps.svg.bbj;
    var viewabletkcount = 0;
    for (var i = 0; i < bbj.tklst.length; i++) {
        if (!tkishidden(bbj.tklst[i])) viewabletkcount++;
    }
    var gwidth = bbj.hmSpan +
        (showtklabel ? bbj.leftColumnWidth : 0) +
        (tkAttrColumnWidth) * bbj.mcm.lst.length;
    for (var k in bbj.splinters) {
        gwidth += bbj.splinters[k].hmSpan;
    }
    var gheight = bbj.main.clientHeight + 1 * viewabletkcount;
    for (var k in bbj.splinters) {
        var s = bbj.splinters[k];
        gheight = Math.max(gheight, s.main.clientHeight + 1 * viewabletkcount);
    }

    /* graph size is now determined */

    var content = ['<svg xmlns="http://www.w3.org/2000/svg" version="1.1" width="' + gwidth + '" height="' + gheight + '">'];

    /* draw splinters first!
     trunk will put blankets later
     */
    var offset = bbj.hmSpan + (showtklabel ? bbj.leftColumnWidth : 0) + 2;
    for (var k in bbj.splinters) {
        var s = bbj.splinters[k];
        var h = s.makesvg_specific({gx: offset, showtklabel: false});
        // border around splinter
        h += 2; // h is inaccurate..
        s.svg.gy = 0;
        s.svgadd({
            type: svgt_rect_notscrollable,
            x: -1,
            y: 0,
            w: s.hmSpan,
            h: h,
            stroke: colorCentral.foreground_faint_3
        });
        content = content.concat(s.svg.content);
        delete s.svg;
        offset += s.hmSpan + 3;
    }
    bbj.makesvg_specific({gx: 0, showtklabel: showtklabel, svgheight: gheight});
    content = content.concat(bbj.svg.content);
    delete bbj.svg;
    content.push('</svg>');
    ajaxPost('svg\n' + content.join(''), function (text) {
        svgshowlink(text);
    });
}
function svgshowlink(key) {
    apps.svg.submitbutt.disabled = false;
    if (!key) {
        print2console('Sorry please try again.', 2);
        return;
    }
    apps.svg.urlspan.innerHTML = '<a href=t/' + key + ' target=_blank>Link to the svg file</a>';
}


Browser.prototype.makesvg_specific = function (param) {
    /* to be called on a browser object, either trunk or splinter
     */
    this.svg = {
        // global offset
        gx: param.gx,
        gy: (param.gy ? param.gy : 0),
        content: [],
    };
    if (param.showtklabel) {
        this.svg.gx += this.leftColumnWidth;
    }
    if (this.rulercanvas) {
        var data = this.drawRuler_browser(true);
        for (var i = 0; i < data.length; i++) {
            data[i].color = colorCentral.foreground;
            this.svgadd(data[i]);
        }
        this.svg.gy += this.rulercanvas.height;
    }

    /* all the tracks
     */
    var oldgy = this.svg.gy;
    for (var i = 0; i < this.tklst.length; i++) {
        var tk = this.tklst[i];
        if (tkishidden(tk)) continue;
        var tkh = tk_height(tk) + parseInt(tk.canvas.style.paddingBottom);
        var oldy = this.svg.gy;
        if (tk.where == 2) this.svg.gy += this.ideogram.canvas.height;
        // line on top
        this.svgadd({
            type: svgt_line_notscrollable,
            x1: 0, y1: 0, x2: this.hmSpan, y2: 0,
            color: colorCentral.foregroundDim, w: .5
        });
        // blank entire track (in case of protruding splinter tk)
        this.svgadd({type: svgt_rect_notscrollable, x: 0, y: 0, w: this.hmSpan, h: tkh, fill: 'white'});

        // clear canvas
        tk.canvas.width = tk.canvas.width;

        if (!tk.cotton || tk.ft == FT_weaver_c) {
            var data = this.drawTrack_browser(tk, true);
            for (var j = 0; j < data.length; j++) {
                this.svgadd(data[j]);
            }
        } else {
            var data = this.weaver.q[tk.cotton].drawTrack_browser(tk, true);
            for (var j = 0; j < data.length; j++) {
                this.svgadd(data[j]);
            }
        }
        this.svg.gy = oldy + tkh; // never be qtc.height as this is not numerical
    }
// to record the maximum height in this bbj
    var maxH = this.svg.gy + this.ideogram.canvas.height;
    this.svg.gy = oldgy;

    /* chr ideogram below ghm
     */
    var h = this.ideogram.canvas.height;
// need to set svg.gy to below ghm
    for (var i = 0; i < this.tklst.length; i++) {
        var t = this.tklst[i];
        if (tkishidden(t)) continue;
        if (t.where == 1) {
            this.svg.gy += tk_height(t) + parseInt(t.canvas.style.paddingBottom);
        }
    }
    if (this.entire.atbplevel) {
        // sequence, svgdata is always there
        for (var i = 0; i < this.ideogram.svgdata.length; i++) {
            this.svgadd(this.ideogram.svgdata[i]);
        }
    } else {
        // no sequence
        var data = this.drawIdeogram_browser(true);
        for (var i = 0; i < data.length; i++) {
            this.svgadd(data[i]);
        }
    }
    /* finally plot tk label and mcm, because they need to cover up the chrideogram
     on left/right side, and tk maybe
     */
    if (this.mcm) {
        // only trunk has mcm, splinter does not, need to include width of splinters for x offset
        var x = this.hmSpan;
        for (var k in this.splinters) {
            x += this.splinters[k].hmSpan + 3;
        }
        if (true) {
            // blank to mask the ruler above mcm
            this.svg.gy = 0;
            this.svgadd({
                type: svgt_rect_notscrollable, x: x, y: 0,
                w: this.mcm.lst.length * (tkAttrColumnWidth + 1),
                h: this.rulercanvas.height,
                fill: 'white'
            });
        }
        this.svg.gy = oldgy;
        var y = 0;
        for (var i = 0; i < this.tklst.length; i++) {
            var tk = this.tklst[i];
            if (tkishidden(tk) || tk.where != 1) continue;
            var data = this.drawMcm_onetrack(tk, true);
            for (var j = 0; j < data.length; j++) {
                // adjust x
                data[j].x += x;
                // set y
                data[j].y = y;
                this.svgadd(data[j]);
            }
            y += tk_height(tk);
        }
        /* y is now offset for mcm term label, always underneath mcm
         mcm label is always on bottom
         blank to mask stuff below mcm
         */
        this.svgadd({
            type: svgt_rect_notscrollable, x: x, y: y,
            w: this.mcm.lst.length * (tkAttrColumnWidth + 1),
            h: param.svgheight,
            fill: 'white'
        });
        for (var i = 0; i < this.mcm.lst.length; i++) {
            var t = this.mcm.lst[i];
            var xx = x + (tkAttrColumnWidth + 1) * i;
            var voc = gflag.mdlst[t[1]];
            this.svgadd({
                type: svgt_text_notscrollable,
                transform: "rotate(90 0 0)",
                x: 2 + y - this.svg.gx + this.svg.gy,
                y: 0 - 4 - xx - this.svg.gy - this.svg.gx,
                size: '10pt',
                text: (t[0] in voc.idx2attr ? voc.idx2attr[t[0]] : t[0])
            });
        }
    }
    if (param.showtklabel) {
        // plot tk label
        this.svg.gx = param.gx;
        this.svg.gy = this.rulercanvas.height;
        // blank out the part on left of ghm
        this.svgadd({
            type: svgt_rect_notscrollable,
            x: 0,
            y: 0,
            w: this.leftColumnWidth,
            h: param.svgheight,
            fill: 'white'
        });
        for (var i = 0; i < this.tklst.length; i++) {
            var tk = this.tklst[i];
            if (tkishidden(tk)) continue;
            var oldy = this.svg.gy;
            if (tk.where == 2) this.svg.gy += this.ideogram.canvas.height;
            var d = this.drawTrack_header(tk, true);
            for (var j = 0; j < d.length; j++) {
                this.svgadd(d[j]);
            }
            this.svg.gy = oldy + tk_height(tk);
        }
    }

    return maxH;
};

function makesvg_clear() {
    apps.svg.urlspan.innerHTML = '';
}

/*** __svg__ ends ***/

function get_genome_info(event) {
// from menu option, menu already shown
    var t = event.target;
    while (t.tagName != 'DIV') t = t.parentNode;
    gflag.menu.bbj.ajax('getgenomeinfo=on&dbName=' + t.genome, function (data) {
        show_genome_info(data);
    });
}
function show_genome_info(data) {
    if (!data) {
        menu_hide();
        print2console('Please try again!', 2);
        return;
    }
    var lst = data.info.split('|');
    menu_blank();
    var t = dom_create('table', menu.c32);
    t.style.margin = 10;
    for (var i = 0; i < lst.length; i += 2) {
        var tr = t.insertRow(-1);
        tr.insertCell(0).innerHTML = lst[i];
        tr.insertCell(1).innerHTML = lst[i + 1];
    }
}

function add_new_genome() {
    oneshotDialog(3);
    menu_hide();
}