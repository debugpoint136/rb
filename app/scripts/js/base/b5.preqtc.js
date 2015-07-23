/**
 * Created by dpuru on 2/27/15.
 */
function ldtk_color_initiator(event) {
    paletteshow(event.clientX, event.clientY, 17);
    palettegrove_paint(event.target.style.backgroundColor);
}
function ldtk_color_set() {
// TODO ld no support for negative score
    menu.c49.color.style.backgroundColor = palette.output;
    var tk = gflag.menu.tklst[0];
    var c = colorstr2int(palette.output);
    tk.qtc.pr = c[0];
    tk.qtc.pg = c[1];
    tk.qtc.pb = c[2];
    gflag.menu.bbj.updateTrack(tk, false);
}
function ldtk_ticksize(event) {
    var tk = gflag.menu.tklst[0];
    tk.ld.ticksize = Math.max(2, tk.ld.ticksize + event.target.change);
    gflag.menu.bbj.updateTrack(tk, true);
}
function ldtk_topheight(event) {
    var tk = gflag.menu.tklst[0];
    tk.ld.topheight = Math.max(20, tk.ld.topheight + event.target.change);
    gflag.menu.bbj.updateTrack(tk, true);
}


function plotGene(ctx, color, scolor, item, x, y, w, h, startcoord, stopcoord, tosvg) {
    /* plot an item with structure
     note: some items have no structure, e.g. polyA signal
     args:
     color
     scolor: counter color, doodling inside thick boxes
     item (with .struct, .strand)
     x/y/w/h - defines the plot box
     startcoord/stopcoord - the start/stop coordinate of the plot box
     tosvg
     */
    var svgdata = [];
// backbone and strand arrows
    ctx.strokeStyle = color;
    var pos = itemcoord2plotbox(item.start, item.stop, startcoord, stopcoord, w);
    if (pos[0] == -1) return;
    pos[0] += x;
    var y2 = y + h / 2;
    ctx.beginPath();
    ctx.moveTo(pos[0], y2);
    ctx.lineTo(pos[0] + pos[1], y2);
    ctx.stroke();
    if (tosvg) {
        svgdata.push({type: svgt_line, x1: pos[0], y1: y2, x2: pos[0] + pos[1], y2: y2, w: 1, color: color});
    }
    var strand = item.strand ? (item.strand == '.' ? null : (item.strand == '>' || item.strand == '+') ? '>' : '<') : null;
    if (strand) {
        var tmplst = decoritem_strokeStrandarrow(ctx, strand, pos[0], pos[1], y, h, color, tosvg);
        if (tosvg) {
            svgdata = svgdata.concat(tmplst);
        }
    }
    ctx.fillStyle = color;
    if (item.struct && item.struct.thin) {
        for (var i = 0; i < item.struct.thin.length; i++) {
            var t = item.struct.thin[i];
            var pos = itemcoord2plotbox(t[0], t[1], startcoord, stopcoord, w);
            if (pos[0] != -1) {
                var q1 = x + pos[0],
                    q2 = y + instack_padding,
                    q3 = pos[1],
                    q4 = h - instack_padding * 2;
                ctx.fillRect(q1, q2, q3, q4);
                if (tosvg) svgdata.push({type: svgt_rect, x: q1, y: q2, w: q3, h: q4, fill: color});
            }
        }
    }
    if (item.struct && item.struct.thick) {
        for (var i = 0; i < item.struct.thick.length; i++) {
            var t = item.struct.thick[i];
            var pos = itemcoord2plotbox(t[0], t[1], startcoord, stopcoord, w);
            if (pos[0] != -1) {
                ctx.fillRect(x + pos[0], y, pos[1], h);
                if (tosvg) svgdata.push({type: svgt_rect, x: x + pos[0], y: y, w: pos[1], h: h, fill: color});
                if (strand) {
                    var tmplst = decoritem_strokeStrandarrow(ctx, strand, x + pos[0] + 2, pos[1] - 4, y, h, scolor, tosvg);
                    if (tosvg) svgdata = svgdata.concat(tmplst);
                }
            }
        }
    }
    if (tosvg) return svgdata;
}
function itemcoord2plotbox(itemstart, itemstop, boxstart, boxstop, boxpw) {
    /*
     itemstart/itemstop: coord of item
     boxstart/boxstop: coord of box
     boxwidth: plot width of box
     returns [xpos, plotwidth] in pixel
     */
    if (itemstart >= boxstop || itemstop <= boxstart) return [-1, -1];
    var sf = boxpw / (boxstop - boxstart); // px per bp
    var _start = Math.max(itemstart, boxstart);
    return [(_start - boxstart) * sf, Math.ceil((Math.min(itemstop, boxstop) - _start) * sf)];
}

Browser.prototype.plotSamread = function (ctx, rid, start, info, y, h, color, miscolor, tosvg) {
    /* plot a single read, not PE
     start/stop: read alignment start/stop coord on reference, including soft clipping
     info: {cigar:[], mismatch:xx,start,stop} (start/stop for aligned portion)
     y
     h
     color: box fill color
     miscolor: mismatch color
     tosvg:
     */
    var sdata = [];
    var r = this.regionLst[rid];
    var _c_d = 'rgba(' + colorstr2int(color).join(',') + ',0.3)';
    var _c_g = colorCentral.foreground_faint_3; // gray
    var coord = start;
    for (var i = 0; i < info.cigar.length; i++) {
        var op = info.cigar[i][0];
        var cl = info.cigar[i][1];
        if (op == 'M') {
            var s = this.tkcd_box({
                ctx: ctx,
                rid: rid,
                start: Math.max(r[3], coord),
                stop: Math.min(r[4], coord + cl),
                viziblebox: true,
                y: y,
                h: h,
                fill: color,
                tosvg: tosvg,
            });
            if (tosvg) sdata = sdata.concat(s);
        } else if (op == 'I') {
            // insertion
        } else if (op == 'D') {
            // deletion
            var s = this.tkcd_box({
                ctx: ctx,
                rid: rid,
                start: Math.max(r[3], coord),
                stop: Math.min(r[4], coord + cl),
                y: y,
                h: h,
                fill: _c_d,
                tosvg: tosvg,
            });
            if (tosvg) sdata = sdata.concat(s);
        } else if (op == 'S' || op == 'H') {
            var s = this.tkcd_box({
                ctx: ctx,
                rid: rid,
                start: Math.max(r[3], coord),
                stop: Math.min(r[4], coord + cl),
                y: y,
                h: h,
                fill: _c_g,
                tosvg: tosvg,
            });
            if (tosvg) sdata = sdata.concat(s);
        } else if (op == 'N') {
            // skip, intron in rna-seq
            var a = this.cumoffset(rid, Math.max(r[3], coord)),
                b = this.cumoffset(rid, Math.min(r[4], coord + cl));
            if (a >= 0 && b > a) {
                ctx.fillStyle = _c_g;
                ctx.fillRect(a, y + parseInt(h / 2), b - a, 1);
                if (tosvg) sdata.push({
                    type: svgt_line,
                    x1: a, y1: y + parseInt(h / 2),
                    x2: b, y2: y + parseInt(h / 2),
                    w: 1, color: _c_g
                });
            }
        }
        coord += cl;
    }
// mismatch
    if (info.mismatch) {
        // need to see if there's clipping at begining
        coord = Math.max(start, r[3]);
        var op = info.cigar[0][0];
        if (op == 'S') {
            coord += info.cigar[0][1];
        }
        var str = info.mismatch.substr(1); // remove first Z
        var bpw = this.entire.atbplevel ? this.entire.bpwidth : 1;
        var plotlineonly = (h < 8 || bpw < 6);
        if (!plotlineonly) {
            ctx.font = "bold 8pt Sans-serif"
        }
        ctx.fillStyle = miscolor;
        var stroffset = 0;
        var bpoffset = 0;
        var tmpstr = str;
        var skipping = false;
        while (stroffset < str.length - 1) {
            var n = parseInt(tmpstr);
            if (isNaN(n)) {
                // none digit cha
                var c = str[stroffset];
                if (c == 'A' || c == 'C' || c == 'G' || c == 'T') {
                    if (!skipping) {
                        // a mismatch
                        var ch = info.seq.charAt(stroffset);
                        var x = this.cumoffset(rid, coord + bpoffset);
                        if (plotlineonly) {
                            ctx.fillRect(x, y, bpw, h);
                            if (tosvg) sdata.push({type: svgt_rect, x: x, y: y, w: bpw, h: h, fill: ctx.fillStyle});
                        } else {
                            ctx.fillText(info.seq.charAt(bpoffset), x, y + 9);
                            if (tosvg) sdata.push({
                                type: svgt_text, x: x, y: y + 9,
                                text: info.seq.charAt(bpoffset),
                                color: ctx.fillStyle
                            });
                        }
                    }
                    bpoffset++;
                } else {
                    // weird char, do not handle FIXME
                    skipping = true;
                }
                stroffset++;
            } else {
                bpoffset += n;
                stroffset += n.toString().length;
                skipping = false;
            }
            tmpstr = str.substr(stroffset);
        }
    }
    if (tosvg) return sdata;
};


function gfSort(a, b) {
    /* for genomic feature items in decor drawing
     using on-canvas plotting position
     item boxstart/boxwidth could be undefined
     */
    if (a.boxstart == undefined) {
        if (b.boxstart == undefined) {
            return 0;
        } else {
            return -1;
        }
    }
    if (b.boxstart == undefined) return 1;
    if (a.boxstart != b.boxstart) {
        return a.boxstart - b.boxstart;
    } else if (a.boxwidth != b.boxwidth) {
        return b.boxwidth - a.boxwidth;
    }
// a and b are same on start/width, see about score
    if (a.__showscoreidx != undefined) {
        return b.scorelst[a.__showscoreidx] - a.scorelst[a.__showscoreidx];
    }
    return 0;
}

function decoritem_strokeStrandarrow(ctx, strand, x, w, y, h, color, tosvg) {
    /* only for items in full decor track?
     must already set strokeStyle
     args:
     ctx: 2d context, all path must already been closed
     strand: '>' '<'
     x: absolute x start on canvas
     w: width to plot with
     y: absolute y start
     color: string, only to be used in svg output
     tosvg: boolean
     */
    if (w < instack_arrowwidth) return [];
    var thisx = 0;
    var num = 0;
    while (thisx + instack_arrowwidth <= w) {
        thisx += instack_arrowwidth + instack_arrowspacing;
        num++;
    }
    if (num == 0) return [];
    thisx = (w - instack_arrowwidth * num - instack_arrowspacing * (num - 1)) / 2;
    ctx.strokeStyle = color;
    ctx.beginPath();
    var svgdata = [];
    for (var i = 0; i < num; i++) {
        if (strand == '>' || strand == '+') {
            var x1 = x + thisx,
                y1 = y + instack_padding,
                x2 = x + thisx + instack_arrowwidth,
                y2 = y + h / 2,
                y3 = y + h - instack_padding;
            ctx.moveTo(x1, y1);
            ctx.lineTo(x2, y2);
            ctx.lineTo(x1, y3);
            if (tosvg) {
                svgdata.push({type: svgt_line, x1: x1, y1: y1, x2: x2, y2: y2, color: ctx.strokeStyle});
                svgdata.push({type: svgt_line, x1: x2, y1: y2, x2: x1, y2: y3, color: ctx.strokeStyle});
            }
        } else {
            var x1 = x + thisx + instack_arrowwidth,
                y1 = y + instack_padding,
                x2 = x + thisx,
                y2 = y + h / 2,
                y3 = y + h - instack_padding;
            ctx.moveTo(x1, y1);
            ctx.lineTo(x2, y2);
            ctx.lineTo(x1, y3);
            if (tosvg) {
                svgdata.push({type: svgt_line, x1: x1, y1: y1, x2: x2, y2: y2, color: ctx.strokeStyle});
                svgdata.push({type: svgt_line, x1: x2, y1: y2, x2: x1, y2: y3, color: ctx.strokeStyle});
            }
        }
        thisx += instack_arrowwidth + instack_arrowspacing;
    }
// don't do closePath or will mess up
    ctx.stroke();
    if (tosvg) return svgdata;
}

function toggle20(event) {
// native decor, show/hide children tk by clicking on arrow in
    var hook = event.target;
    var bait = event.target.parentNode.parentNode.nextSibling;
    if (bait.style.display == "none") {
        bait.style.display = "table-row";
        hook.style.transform =
            hook.style.mozTransform =
                hook.style.webkitTransform = 'rotate(-90deg)';
    } else {
        bait.style.display = "none";
        hook.style.transform =
            hook.style.mozTransform =
                hook.style.webkitTransform = 'rotate(90deg)';
    }
}


function cpmoveMD(event) {
    /* generic moving panel */
    if (event.button != 0) return;
    var tab = event.target;
    while (tab.getAttribute('holderid') == null) tab = tab.parentNode;
    event.preventDefault();
    gflag.cpmove.dom = document.getElementById(tab.getAttribute('holderid'));
    gflag.cpmove.oldx = event.clientX;
    gflag.cpmove.oldy = event.clientY;
    document.body.addEventListener('mousemove', cpmoveM, false);
    document.body.addEventListener('mouseup', cpmoveMU, false);
}
function cpmoveM(event) {
    var d = gflag.cpmove.dom;
    d.style.left = parseInt(d.style.left) + event.clientX - gflag.cpmove.oldx;
    d.style.top = parseInt(d.style.top) + event.clientY - gflag.cpmove.oldy;
    gflag.cpmove.oldx = event.clientX;
    gflag.cpmove.oldy = event.clientY;
}
function cpmoveMU(event) {
    gflag.cpmove.dom = null;
    document.body.removeEventListener('mousemove', cpmoveM, false);
    document.body.removeEventListener('mouseup', cpmoveMU, false);
}


function placeIndicator3(x, y, w, h) {
// place indicator3 at a place (x,y) with resizing (w,h)
    indicator3.style.left = x;
    indicator3.style.top = y;
    var d = indicator3.firstChild;
    d.style.width = w;
    d.style.height = h;
    var dd = d.firstChild;
    dd.style.width = w;
    dd.style.height = h;
    dd = d.childNodes[1];
    dd.style.width = w;
    dd.style.height = h;
    dd = d.childNodes[2];
    dd.style.width = w;
    dd.style.height = h;
    dd = d.childNodes[3];
    dd.style.width = w;
    dd.style.height = h;
    indicator3.style.display = "block";
}

function tkinfo_show_closure(bbj, tk) {
    return function () {
        bbj.tkinfo_show(tk);
    };
}
Browser.prototype.tkinfo_show = function (arg) {
// registry obj for accessing md
    var tk;
    if (typeof(arg) == 'string') {
        tk = this.genome.getTkregistryobj(arg);
        if (!tk) fatalError('no registry object found');
    } else {
        tk = arg;
    }
    menu_blank();
    var d = dom_create('div', menu.c32, 'margin:10px;width:500px;');
    if (tk.md && tk.md.length > 0) {
        dom_create('div', d, 'font-style:italic;color:' + colorCentral.foreground_faint_5).innerHTML = 'Metadata annotation';
        var d2 = dom_create('div', d, 'margin:10px');
        for (var i = 0; i < tk.md.length; i++) {
            if (!tk.md[i]) continue;
            // i is mdidx
            var voc = gflag.mdlst[i];
            for (var term in tk.md[i]) {
                mdterm_print(d2, term, voc);
            }
        }
    }
// general
    if (tk.details) {
        var d2 = dom_create('div', d, 'margin-bottom:15px;width:480px;');
        tkinfo_print(tk.details, d2);
    }
// processing
    if (tk.details_analysis) {
        var d2 = dom_create('div', d, 'margin-bottom:15px;width:480px;');
        tkinfo_print(tk.details_analysis, d2);
    }
    var reg = this.genome.getTkregistryobj(tk.name);
    if (reg && reg.detail_url) {
        var d9 = dom_create('div', d, 'margin-bottom:15px;width:480px;');
        d9.innerHTML = 'loading...';
        this.ajaxText('loaddatahub=on&url=' + reg.detail_url, function (text) {
            var j = parse_jsontext(text);
            if (!j) {
                d9.innerHTML = 'Cannot read file at ' + reg.detail_url;
                return;
            }
            d9.style.overflowX = 'scroll';
            stripChild(d9, 0);
            var table = dom_create('table', d9, 'zoom:0.8;');
            var c = 0;
            for (var n in j) {
                var tr = table.insertRow(-1);
                if (c % 2 == 0) {
                    tr.style.backgroundColor = colorCentral.foreground_faint_1;
                }
                var td = tr.insertCell(0);
                td.innerHTML = n;
                td = tr.insertCell(1);
                td.innerHTML = j[n];
                c++;
            }
        });
    }
// other version, not in use
// geo
    if (tk.geolst) {
        var d2 = dom_create('div', d);
        d2.innerHTML = 'GEO record: ';
        for (var i = 0; i < tk.geolst.length; i++) {
            d2.innerHTML += '<a href=http://www.ncbi.nlm.nih.gov/geo/query/acc.cgi?acc=' + tk.geolst[i] + ' target=_blank>' + tk.geolst[i] + '</a> ';
        }
    }
    if (tk.ft == FT_cm_c) {
        var t = dom_create('table', d, 'margin-top:10px;');
        var td = t.insertRow(0).insertCell(0);
        td.colSpan = 2;
        td.style.fontStyle = 'italic';
        td.style.color = colorCentral.foreground_faint_5;
        td.innerHTML = 'Member tracks:';
        for (var k in tk.cm.set) {
            // this is registry obj, value is tkname
            var x = this.findTrack(tk.cm.set[k]);
            if (!x) continue;
            var tr = t.insertRow(-1);
            tr.insertCell(0).innerHTML = x.label;
            tr.insertCell(1).innerHTML = '<a href=' + x.url + ' target=_blank>' + (x.url.length > 50 ? x.url.substr(0, 50) + '...' : x.url) + '</a>';
        }
    } else if (tk.ft == FT_matplot) {
        var t = dom_create('table', d, 'margin-top:10px;');
        var td = t.insertRow(0).insertCell(0);
        td.colSpan = 2;
        td.style.fontStyle = 'italic';
        td.style.color = colorCentral.foreground_faint_5;
        td.innerHTML = 'Member tracks:';
        for (var k = 0; k < tk.tracks.length; k++) {
            // this is registry obj, value is tkname
            var x = this.findTrack(tk.tracks[k]);
            if (!x) continue;
            var tr = t.insertRow(-1);
            tr.insertCell(0).innerHTML = x.label;
            td = tr.insertCell(1);
            if (isCustom(x.ft)) {
                td.innerHTML = '<a href=' + x.url + ' target=_blank>' + (x.url.length > 50 ? x.url.substr(0, 50) + '...' : x.url) + '</a>';
            }
        }
    }
    if (tk.url) {
        dom_create('div', d).innerHTML = 'File URL: <a href=' + tk.url + ' target=_blank>' + (tk.url.length > 50 ? tk.url.substr(0, 50) + '...' : tk.url) + '</a>';
    }
};

function generic_tkdetail(event) {
    var t = event.target;
    menu_shutup();
    menu_show_beneathdom(0, t);
    gflag.browser.tkinfo_show(t.tkobj);
}
function hengeview_lrtkdetail(event) {
    var t = event.target;
    menu_shutup();
    menu_show_beneathdom(0, t);
    apps.circlet.hash[t.viewkey].bbj.tkinfo_show(t.tkname);
}

function menuGetonetrackdetails() {
    menu_shutup();
    gflag.menu.bbj.tkinfo_show(gflag.menu.tklst[0]);
}
function tkinfo_parse(text, hash) {
    var lst = text.split('; ');
    for (var i = 0; i < lst.length; i++) {
        var idx = lst[i].indexOf('=');
        if (idx == -1) continue;
        hash[lst[i].substr(0, idx)] = lst[i].substr(idx + 1);
    }
}
function tkinfo_print(hash, holder) {
// make a row to hold text1 and text2 in two <td>
    var i = 0;
    var table = dom_create('table', holder);
    for (var key in hash) {
        var color = (i % 2) ? colorCentral.foreground_faint_1 : '';
        i++;
        var tr = table.insertRow(-1);
        var td = tr.insertCell(0);
        td.style.fontSize = "12px";
        td.style.backgroundColor = color;
        td.innerHTML = key.replace(/\_/g, " ");
        tr.appendChild(td);
        td = tr.insertCell(1);
        td.style.fontSize = "12px";
        td.style.backgroundColor = color;
        td.innerHTML = hash[key];
    }
    if (i > 20) {
        holder.style.overflowY = 'scroll';
        holder.style.height = 200;
    }
}


function qtc_thresholdcolorcell(_qtc) {
    if (!_qtc || _qtc.thtype == undefined) return;
    if (menu.c50.style.display == 'none') return;
    if (_qtc.thtype == scale_auto) {
        menu.c50.color1_1.style.display = menu.c50.color2_1.style.display = 'none';
        return;
    }
    if (menu.c50.color1.style.display != 'none') {
        var c = menu.c50.color1_1;
        c.style.display = 'inline-block';
        c.innerHTML = 'beyond threshold';
        c.style.backgroundColor = _qtc.pth;
    }
    if (menu.c50.color2.style.display != 'none') {
        var c = menu.c50.color2_1;
        c.style.display = 'inline-block';
        c.innerHTML = 'beyond threshold';
        c.style.backgroundColor = _qtc.nth;
    }
}


function toggle26(event) {
// toggle select, change Y axis scale type
    menu.c51.fix.style.display =
        menu.c51.percentile.style.display = 'none';
    var v = parseInt(menu.c51.select.options[menu.c51.select.selectedIndex].value);
    if (v == scale_fix) {
        menu.c51.fix.style.display = 'block';
        // do not apply until user push button
        return;
    }
    if (v == scale_auto) {
        menu.c50.color1_1.style.display = menu.c50.color2_1.style.display = 'none';
    } else if (v == scale_percentile) {
        menu.c51.percentile.style.display = 'block';
        menu.c51.percentile.says.innerHTML = '95 percentile';
    }
    menu_update_track(5);
}

function qtc_setfixscale_ku(event) {
    if (event.keyCode == 13) qtc_setfixscale();
}
function qtc_setfixscale() {
// need to show beyond threshold color blobs
    var min = parseFloat(menu.c51.fix.min.value);
    if (isNaN(min)) {
        print2console('Invalid minimum value', 2);
        return;
    }
    var max = parseFloat(menu.c51.fix.max.value);
    if (isNaN(max)) {
        print2console('Invalid maximum value', 2);
        return;
    }
    if (min >= max) {
        print2console('min >= max', 2);
        return;
    }
    menu_update_track(6);
}


function menu_log_select() {
    menu_update_track(9);
}
function menu_qtksummary_select() {
    menu_update_track(32);
}
