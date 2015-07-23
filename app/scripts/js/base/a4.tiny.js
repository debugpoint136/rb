/**
 * Created by dpuru on 2/27/15.
 */

/*** __tiny__ ***/

function parseUrlparam(uph) {
    if (window.location.href.indexOf('?') == -1) {
        return 0;
    }
    var lst = window.location.href.split('?')[1].split('&');
    for (var i = 0; i < lst.length; i++) {
        var t = lst[i].split('=');
        if (t.length == 2 && t[0].length > 0 && t[1].length > 0) {
            uph[t[0].toLowerCase()] = t[1];
        } else {
            return -1;
        }
    }
    return 1;
}

function pagemask() {
    loading_cloak(document.body);
}

function foregroundcolor(opacity) {
    return 'rgba(' + colorCentral.fg_r + ',' + colorCentral.fg_g + ',' + colorCentral.fg_b + ',' + opacity + ')';
}

function isHmtk(ft) {
// not good
    switch (ft) {
        case FT_bedgraph_c:
            return true;
        case FT_bedgraph_n:
            return true;
        case FT_cat_c:
            return true;
        case FT_cat_n:
            return true;
        case FT_bigwighmtk_c:
            return true;
        case FT_bigwighmtk_n:
            return true;
        default:
            return false;
    }
}
function isCustom(ft) {
    switch (ft) {
        case FT_cat_c:
        case FT_bedgraph_c:
        case FT_bigwighmtk_c:
        case FT_bed_c:
        case FT_sam_c:
        case FT_bam_c:
        case FT_lr_c:
        case FT_cm_c:
        case FT_ld_c:
        case FT_anno_c:
        case FT_weaver_c:
        case FT_matplot:
        case FT_catmat:
        case FT_qcats:
            return true;
        default:
            return false;
    }
}
function isNumerical(tkobj) {
// including density mode
    var ft = tkobj.ft;
    if (ft == FT_bedgraph_c || ft == FT_bedgraph_n || ft == FT_bigwighmtk_c || ft == FT_bigwighmtk_n || ft == FT_qdecor_n) return true;
    if (tkobj.mode == M_den) return true;
    return false;
}

function decormodestr2num(s) {
    var m = s.toLowerCase();
    if (m == 'hide') return M_hide;
    if (m == 'show') return M_show;
    if (m == 'thin') return M_thin;
    if (m == 'full') return M_full;
    if (m == 'arc') return M_arc;
    if (m == 'trihm') return M_trihm;
    if (m == 'heatmap') return M_trihm;
    if (m == 'density') return M_den;
    if (m == 'barplot') return M_bar;
    return undefined;
}

function simulateEvent(dom, action) {
// action: click, change, mouseover,
    var e = document.createEvent('MouseEvents');
    e.initMouseEvent(action, true, true, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
    dom.dispatchEvent(e);
}
function int2strcomma(num) {
// integer to string with comma
}
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
function stripChild(holder, what) {
// if what==0, strip all children
    var L = holder.childNodes.length;
    if (what == 0) {
        while (holder.hasChildNodes())
            holder.removeChild(holder.lastChild);
    } else {
        for (var i = what; i < L; i++)
            holder.removeChild(holder.lastChild);
    }
}

function neat_0t1(num) {
    if (num == 0) return '0';
    if (num == 1) return '1';
    return num.toFixed(2);
}

function neatstr(num) {
// try make it "%.6g"
//var s = num.toFixed(6);
    var s = num.toFixed(2); //dli
    if (s.indexOf('.') == -1) return s;
    var lst = s.split('.');
    var a = lst[0], b = lst[1];
    while (b.length > 0 && b[b.length - 1] == '0') {
        b = b.substr(0, b.length - 1);
    }
    if (b.length == 0) {
        return a;
    }
    return a + '.' + b;
}

function bp2neatstr(a) {
    var u = ['bp', 'Kb', 'Mb', 'Gb'];
    for (var i = 0; i < u.length; i++) {
        var b = Math.pow(10, (i + 1) * 3);
        if (a < b) {
            var v = a * 1000 / b;
            if (v == parseInt(v)) {
                return v + ' ' + u[i];
            }
            return v.toFixed(1) + ' ' + u[i];
        }
    }
    return a;
}


function lightencolor(rgb, perc) {
// lighten color, higher percentage means lighter color
    return "rgb(" + (rgb[0] + parseInt((255 - rgb[0]) * perc)) + "," + (rgb[1] + parseInt((255 - rgb[1]) * perc)) + "," + (rgb[2] + parseInt((255 - rgb[2]) * perc)) + ")";
}
function darkencolor(rgb, perc) {
// darken color, higher percentage means darker color
    var p = 1 - perc;
    return "rgb(" + parseInt(rgb[0] * p) + "," + parseInt(rgb[1] * p) + "," + parseInt(rgb[2] * p) + ")";
}
function colorstr2int(what) {
// accepts #aabbcc or rgb(12,23,34)
    var c = [0, 0, 0];
    if (what.charAt(0) == "#") {
        if (what.length == 4) {
            c[0] = parseInt(what.charAt(1) + what.charAt(1), 16);
            c[1] = parseInt(what.charAt(2) + what.charAt(2), 16);
            c[2] = parseInt(what.charAt(3) + what.charAt(3), 16);
        } else {
            c[0] = parseInt(what.substr(1, 2), 16);
            c[1] = parseInt(what.substr(3, 2), 16);
            c[2] = parseInt(what.substr(5, 2), 16);
        }
    } else {
        var lst = what.split(',');
        c[0] = parseInt(lst[0].split('(')[1]);
        c[1] = parseInt(lst[1]);
        c[2] = parseInt(lst[2]);
    }
    return c;
}
function rgb2hex(str) {
// must be rgb(,,)
    if (str.charAt(0) == '#') return str;
    var c = colorstr2int(str);
    if (isNaN(c[0]) || isNaN(c[1]) || isNaN(c[2])) {
        return '#000000';
    }
    var h = '#';
    return '#' + (c[0] == 0 ? '00' : c[0].toString(16)) +
        (c[1] == 0 ? '00' : c[1].toString(16)) +
        (c[2] == 0 ? '00' : c[2].toString(16));
}
function arrayMin(arr) {
    if (arr.length == 0) fatalError('arrayMin: zero length array');
    var s = arr[0];
    for (var i = 1; i < arr.length; i++) {
        if (s > arr[i]) s = arr[i];
    }
    return s;
}
function arrayMean(arr) {
    if (arr.length == 0) fatalError("arrayMean: zero length array");
    var s = 0;
    for (var i = 0; i < arr.length; i++)
        s += arr[i];
    return s / arr.length;
}
function arrayMax(arr) {
    if (arr.length == 0) fatalError("arrayMax: zero length array");
    var s = 0;
    for (var i = 0; i < arr.length; i++) {
        if (s < arr[i])
            s = arr[i];
    }
    return s;
}
function getArrIdx(thing, lst) {
    // return -1 if thing is not found
    if (lst.length == 0) return -1;
    for (var i = 0; i < lst.length; i++) {
        if (lst[i] == thing) return i;
    }
    return -1;
}
function stringLstIsIdentical(lst1, lst2) {
    if (lst1.length != lst2.length)
        return false;
    for (var i = 0; i < lst1.length; i++) {
        if (lst1[i] != lst2[i])
            return false;
    }
    return true;
}
function hashisempty(h) {
    for (var k in h)
        return false;
    return true;
}
function thinginlist(thing, lst) {
    for (var i = 0; i < lst.length; i++) {
        if (lst[i] == thing) return true;
    }
    return false;
}
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


function gfSort_len(a, b) {
    return b.stop - b.start - a.stop + a.start;
}
function gfSort_coord(a, b) {
// using actual genomic coord
    if (a.start == b.start) return a.stop - b.stop;
    return a.start - b.start;
}
function gfSort_coord_rev(a, b) {
// using actual genomic coord
    if (a.start == b.start) return b.stop - a.stop;
    return b.start - a.start;
}
function numSort(a, b) {
    return a - b;
} // ascending
function numSort2(a, b) {
    return b - a;
} // descending
function getSelectValueById(what) {
    var tag = document.getElementById(what);
    if (tag == null) fatalError(what + ' not found as select');
    if (tag.type != 'select-one')
        fatalError(what + ' not found for a select tag');
    return tag.options[tag.selectedIndex].value;
}
function snpSort(a, b) {
    if (a[0] == b[0]) return a[1] - b[1];
    return a[0] - b[0];
}
function hspSort(a, b) {
    if (a.querychr == b.querychr) return a.querystart - b.querystart;
//if(a.targetrid==b.targetrid) return a.targetstart-b.targetstart;
    return 1;
}
function stitchSort(a, b) {
    if (Math.max(a.t1, b.t1) < Math.min(a.t2, b.t2)) {
        return a.sort_midx - (a.t2 - a.t1) / 5 - a.sort_sumw / 2 -
            (b.sort_midx - (b.t2 - b.t1) / 5 - b.sort_sumw / 2);
    } else {
        return a.t1 - b.t1;
    }
}


function changeSelectByValue(arg, value) {
    /* change .selectedIndex of a <select> by given value
     return 1 for success, -1 for failure
     first argument could be string (<select> id), or dom object
     */
    var s = arg;
    if (typeof(s) == "string") {
        s = document.getElementById(arg);
        if (s == undefined)
            return -1;
    }
    if (s.tagName != 'SELECT') {
        print2console('changeSelectByValue: target object is not <select>', 2);
        return -1;
    }
    var lst = s.options;
    for (var i = 0; i < lst.length; i++) {
        if (lst[i].value == value) {
            s.selectedIndex = i;
            return 1;
        }
    }
    return -1;
}
function checkInputByvalue(radioName, value) {
// works for both radio and checkbox
    var lst = document.getElementsByName(radioName);
    if (lst.length == 0)
        fatalError("checkInputByvalue: unknown <input> name");
    for (var i = 0; i < lst.length; i++) {
        if (lst[i].value == value) {
            lst[i].checked = true;
            return;
        }
    }
    fatalError("checkInputByvalue: unknown value '" + value + "' for " + radioName);
}
function getValue_by_radioName(what) {
// a set of radio button sharing same name
    var tag_lst = document.getElementsByName(what);
    if (tag_lst.length == 0) fatalError("radio button with name " + what + " not found.");
    for (var i = 0; i < tag_lst.length; i++) {
        if (tag_lst[i].checked) return tag_lst[i].value;
    }
    return null;
}
function getAlt_by_radioName(what) {
    var tag_lst = document.getElementsByName(what);
    if (tag_lst.length == 0) fatalError("radio button with name " + what + " not found.");
    for (var i = 0; i < tag_lst.length; i++) {
        if (tag_lst[i].checked) return tag_lst[i].alt;
    }
    fatalError("None of the options were checked for radio button " + what);
}

function makecanvaslabel(param) {
    /* make canvas with string plotted vertically
     args:
     - str
     - color:
     - bg:
     - bottom: boolean if string start from bottom
     - horizontal: boolean
     */
    var c = document.createElement("canvas");
    var ctx = c.getContext('2d');
    if (param.horizontal) {
        c.height = tkAttrColumnWidth - 2;
    } else {
        c.width = tkAttrColumnWidth - 2; // FIXME
    }
    if (param.bg) {
        c.style.backgroundColor = colorCentral.pagebg;
    }
    ctx.font = "10pt Sans-serif";
    var w = ctx.measureText(param.str).width;
    var truncate = false;
    if (w + 10 > 200) {
        if (param.horizontal) {
            c.width = 200;
        } else {
            c.height = 200;
        }
        truncate = true;
    } else {
        if (param.horizontal) {
            c.width = w + 10;
        } else {
            c.height = w + 10;
        }
    }
    ctx.font = "10pt Sans-serif";
    ctx.fillStyle = param.color ? param.color : colorCentral.foreground;
    if (param.horizontal) {
        ctx.fillText(param.str, 0, 12);
        if (truncate) {
            var x = c.width - 14;
            ctx.clearRect(x, 0, 14, 12);
            ctx.font = "bold 11pt Georgia";
            ctx.fillText('...', x, 12);
        }
    } else {
        if (param.bottom) {
            ctx.rotate(Math.PI * 1.5);
            ctx.fillText(param.str, -c.height + 2, 12);
        } else {
            ctx.rotate(Math.PI * 0.5);
            ctx.fillText(param.str, 0, 0);
        }
        if (truncate) {
            ctx.clearRect(-14, 0, 14, 12);
            ctx.font = "bold 11pt Georgia";
            ctx.fillText('...', -14, 12);
        }
    }
    return c;
}

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
function indicator4actuallyfly() {
    if (indicator4.count == 20) {
        indicator4.style.display = 'none';
        return;
    }
    indicator4.count++;
    indicator4.style.width = parseInt(indicator4.style.width) + indicator4.wshrink;
    indicator4.style.height = parseInt(indicator4.style.height) + indicator4.hshrink;
    indicator4.style.left = parseInt(indicator4.style.left) + indicator4.xincrement;
    indicator4.style.top = parseInt(indicator4.style.top) + indicator4.yincrement;
    setTimeout(indicator4actuallyfly, 10);
}

Genome.prototype.parseCoordinate = function (input, type) {
    /* type:
     1 - array [chr, start, stop]
     2 - str chr start stop
     3 - str chrA start chrB stop
     */
    var c = [];
    switch (type) {
        case 1:
            if (input.length != 3) return null;
            c[0] = c[2] = input[0];
            c[1] = input[1];
            c[3] = input[2];
            break;
        case 2:
            var t = input.split(/[^\w\.]/);
            if (t.length == 3) {
                c[0] = c[2] = t[0];
                c[1] = parseInt(t[1]);
                c[3] = parseInt(t[2]);
            } else {
                // remove all comma and try again
                t = input.replace(/,/g, '').split(/[^\w\.]/);
                if (t.length == 3) {
                    c[0] = c[2] = t[0];
                    c[1] = parseInt(t[1]);
                    c[3] = parseInt(t[2]);
                } else {
                    return null;
                }
            }
            break;
        case 3:
            var t = input.split(/[^\w\.]/);
            if (t.length != 4) return null;
            c[0] = t[0];
            c[2] = t[2];
            c[1] = parseInt(t[1]);
            c[3] = parseInt(t[3]);
            break;
        default:
            fatalError('parseCoordinate: unknown type');
    }
    if (isNaN(c[1])) return null;
    if (isNaN(c[3])) return null;
    if (c[1] < 0 || c[3] <= 0) return null;
    if (type == 1 || type == 2) {
        if (c[1] >= c[3]) return null;
        var len = this.scaffold.len[c[0]];
        if (!len) return null;
        if (c[1] > len) return null;
        if (c[3] > len) return null;
        return c;
    }
    var len = this.scaffold.len[c[0]];
    if (!len) return null;
    if (c[1] > len) return null;
    len = this.scaffold.len[c[2]];
    if (!len) return null;
    if (c[3] > len) return null;
    return c;
};

Browser.prototype.defaultposition = function () {
    var c = this.genome.defaultStuff.coord.split(/[^\w\.]/);
    if (c.length == 3) return [c[0], c[1], c[0], c[2]];
    if (c.length == 4) return c;
    print2console('Irregular default coord: ' + this.genome.defaultStuff.coord, 3);
    return null;
};

Browser.prototype.parseCoord_wildgoose = function (param, highlight) {
    param = param.trim();  // gets rid of whitespace
    var _len = this.genome.scaffold.len[param];
    if (_len) {
        // only chr name
        var x = parseInt(_len / 2);
        return [param, Math.max(x - 10000, 0), Math.min(x + 10000, _len - 1)];
    }
    var c = this.genome.parseCoordinate(param, 2);
    if (c) {
        if (c[0] == c[2]) {
            if (highlight) {
                this.__pending_coord_hl = [c[0], c[1], c[3]];
            }
            return [c[0], c[1], c[3]];
        } else {
            print2console('unexpected coord: ' + c[0] + ' - ' + c[2], 2);
            return c;
        }
    }
    c = param.split(/[^\w\.]/);
    if (c.length == 1) {
        var pos = parseInt(c[0]);
        if (isNaN(pos)) {
            return null;
        }
        // treat it as a coordinate
        if (!this.regionLst || this.regionLst.length == 0) {
            return null;
        }
        var chrom = this.getDspStat()[0];
        if (pos > 0 && pos <= this.genome.scaffold.len[chrom]) {
            var a = parseInt((this.hmSpan / MAXbpwidth_bold) / 2);
            if (highlight) {
                this.__pending_coord_hl = [chrom, pos, pos + 1];
            }
            return [chrom, Math.max(0, pos - a), pos + a];
        }
    } else if (c.length == 2) {
        var pos = parseInt(c[1]);
        var len = this.genome.scaffold.len[c[0]];
        if (len && !isNaN(pos) && pos > 0 && pos <= len) {
            if (highlight) {
                this.__pending_coord_hl = [c[0], pos, pos + 1];
            }
            var a = parseInt((this.hmSpan / MAXbpwidth_bold) / 2);
            return [c[0], Math.max(0, pos - a), pos + a];
        } else {
            var a = parseInt(c[0]), b = parseInt(c[1]);
            if (!isNaN(a) && !isNaN(b)) {
                if (!this.regionLst || this.regionLst.length == 0) {
                    return null;
                }
                var chrom = this.getDspStat()[0];
                if (highlight) {
                    this.__pending_coord_hl = [chrom, a, b];
                }
                return [chrom, a, b];
            }
        }
    } else if (c.length == 4) {
        if (c[0] == c[2]) return [c[0], c[1], c[3]];
        return c;
    }
// try again by erasing comma, damn, all repeated!
    c = param.replace(/,/g, '').split(/[^\w\.]/);
    if (c.length == 1) {
        var pos = parseInt(c[0]);
        if (isNaN(pos)) {
            return null;
        }
        // treat it as a coordinate
        if (!this.regionLst || this.regionLst.length == 0) {
            return null;
        }
        var chrom = this.getDspStat()[0];
        if (pos > 0 && pos <= this.genome.scaffold.len[chrom]) {
            var a = parseInt((this.hmSpan / MAXbpwidth_bold) / 2);
            if (highlight) {
                this.__pending_coord_hl = [chrom, pos, pos + 1];
            }
            return [chrom, Math.max(0, pos - a), pos + a];
        }
    } else if (c.length == 2) {
        var pos = parseInt(c[1]);
        var len = this.genome.scaffold.len[c[0]];
        if (len && !isNaN(pos) && pos > 0 && pos <= len) {
            if (highlight) {
                this.__pending_coord_hl = [c[0], pos, pos + 1];
            }
            var a = parseInt((this.hmSpan / MAXbpwidth_bold) / 2);
            return [c[0], Math.max(0, pos - a), pos + a];
        } else {
            var a = parseInt(c[0]), b = parseInt(c[1]);
            if (!isNaN(a) && !isNaN(b)) {
                if (!this.regionLst || this.regionLst.length == 0) {
                    return null;
                }
                var chrom = this.getDspStat()[0];
                if (highlight) {
                    this.__pending_coord_hl = [chrom, a, b];
                }
                return [chrom, a, b];
            }
        }
    } else if (c.length == 4) {
        if (c[0] == c[2]) return [c[0], c[1], c[3]];
        return c;
    }
    return null;
};

function pica_go(x, y) {
// x/y does not contain scroll offset
// if is null, won't change x/y
    pica.style.display = 'block';
    if (x != null) {
        var xx = document.body.clientWidth;
        if (x > xx - pica.clientWidth) {
            pica.style.left = '';
            pica.style.right = xx - x + 10;
        } else {
            pica.style.right = '';
            pica.style.left = x + 10;
        }
    }
    if (y != null) {
        var yy = document.body.clientHeight;
        if (y > yy - pica.clientHeight) {
            pica.style.top = '';
            pica.style.bottom = document.body.clientHeight - y;
        } else {
            pica.style.bottom = '';
            pica.style.top = y + 10;
        }
    }
}

function htmltext_colorscale(minv, maxv, bg, nr, ng, nb, pr, pg, pb, nth, pth) {
    /* minv,maxv
     bg: background color
     nr,ng,nb, pr,pg,pb,
     nth,pth: color beyond p/n threshold, optional
     */
    if (maxv <= 0) {
        // only show negative bar
        return (nth == undefined ? '' : '<div style="width:10px;height:12px;display:inline-block;background-color:' + nth + ';"></div> ') +
            neatstr(minv) +
            ' <div style="width:50px;height:12px;display:inline-block;' +
            'background:-webkit-gradient(linear,left top,right top,from(rgb(' + nr + ',' + ng + ',' + nb + ')),to(' + bg + '));' +
            'background:-moz-linear-gradient(left,rgb(' + nr + ',' + ng + ',' + nb + '),' + bg + ');"></div> ' +
            neatstr(maxv);
    }
    if (minv >= 0) {
        // only show positive bar
        return neatstr(minv) +
            ' <div style="width:50px;height:12px;display:inline-block;' +
            'background:-webkit-gradient(linear,left top,right top,from(' + bg + '),to(rgb(' + pr + ',' + pg + ',' + pb + ')));' +
            'background:-moz-linear-gradient(left,' + bg + ',rgb(' + pr + ',' + pg + ',' + pb + '));"></div> ' +
            neatstr(maxv) +
            (pth == undefined ? '' : ' <div style="width:10px;height:12px;display:inline-block;background-color:' + pth + ';"></div>');
    }
// show both bars
    return (nth == undefined ? '' : '<div style="width:10px;height:12px;display:inline-block;background-color:' + nth + ';"></div> ') +
        neatstr(minv) +
        ' <div style="width:50px;height:12px;display:inline-block;' +
        'background:-webkit-gradient(linear,left top,right top,from(rgb(' + nr + ',' + ng + ',' + nb + ')),to(' + bg + '));' +
        'background:-moz-linear-gradient(left,rgb(' + nr + ',' + ng + ',' + nb + '),' + bg + ');' +
        '"></div> 0 <div style="width:50px;height:12px;display:inline-block;' +
        'background:-webkit-gradient(linear,left top,right top,from(' + bg + '),to(rgb(' + pr + ',' + pg + ',' + pb + ')));' +
        'background:-moz-linear-gradient(left,' + bg + ',rgb(' + pr + ',' + pg + ',' + pb + '));' +
        '"></div> ' + neatstr(maxv) +
        (pth == undefined ? '' : ' <div style="width:10px;height:12px;display:inline-block;background-color:' + pth + ';"></div>');
}

function pica_hide() {
    pica.style.display = 'none';
}


function toggle_prevnode(event) {
    var d = event.target.previousSibling;
    d.style.display = d.style.display == 'block' ? 'none' : 'block';
}
function toggle33() {
    menu_shutup();
    menu.apppanel.getseq.main.style.display = 'block';
    menu.apppanel.getseq.shortcut.style.display = 'inline-block';
}
function toggle34() {
    menu.c57.shortcut.style.display = 'inline-block';
    mdtermsearch_show('Find terms and show in colormap', mcm_addterm_closure);
}
function toggle1_1() {
    gflag.menu.bbj.toggle1();
}
function toggle1_2() {
    gflag.browser.toggle1();
}
Browser.prototype.toggle1 = function () {
// show hmtk facet panel
    if (apps.hmtk.main.style.display == "none") {
        cloakPage();
        var b = this;
        if (this.trunk) b = this.trunk;
        b.facet.main.style.display = 'block';
        stripChild(apps.hmtk.holder, 0);
        apps.hmtk.holder.appendChild(b.facet.main);
        var tmp = b.tkCount();
        apps.hmtk.custtk2lst.style.display = tmp[1] > 0 ? 'block' : 'none';
        panelFadein(apps.hmtk.main, 100 + document.body.scrollLeft, 50 + document.body.scrollTop);
        apps.hmtk.bbj = b;
    } else {
        pagecloak.style.display = "none";
        panelFadeout(apps.hmtk.main);
    }
    menu_hide();
};

function toggle7_2() {
    gflag.browser.toggle7();
}
function toggle7_1() {
    gflag.menu.bbj.toggle7();
}
Browser.prototype.toggle7 = function () {
    if (apps.custtk.main.style.display == 'none') {
        for (var n in apps) {
            if (apps[n].main.style.display != 'none') apps[n].main.style.display = 'none';
        }
        if (gflag.askabouttrack) {
            toggle9();
        }
        cloakPage();
        var c = this.genome.custtk;

        // put in custtk submit ui
        stripChild(apps.custtk.main.__contentdiv, 0);
        apps.custtk.main.__contentdiv.appendChild(c.main);
        apps.custtk.main.__hbutt2.style.display = c.buttdiv.style.display == 'block' ? 'none' : 'block';

        panelFadein(apps.custtk.main, 100 + document.body.scrollLeft, 50 + document.body.scrollTop);
        apps.custtk.bbj = this.trunk ? this.trunk : this;
    } else {
        pagecloak.style.display = "none";
        panelFadeout(apps.custtk.main);
    }
    menu_hide();
};

function toggle8_1() {
    gflag.menu.bbj.toggle8();
}
function toggle8_2() {
    gflag.browser.toggle8();
}
Browser.prototype.toggle8 = function () {
    if (apps.publichub.main.style.display == "none") {
        if (gflag.askabouttrack) {
            toggle9();
        }
        cloakPage();
        stripChild(apps.publichub.holder, 0);
        apps.publichub.holder.appendChild(this.genome.publichub.holder);
        panelFadein(apps.publichub.main, 100 + document.body.scrollLeft, 50 + document.body.scrollTop);
        apps.publichub.bbj = this;
    } else {
        pagecloak.style.display = "none";
        panelFadeout(apps.publichub.main);
    }
    menu_hide();
};

function toggle9() {
    pagecloak.style.display = 'none';
    panelFadeout(gflag.askabouttrack);
    delete gflag.askabouttrack;
}

function toggle13(event) {
    gflag.menu.bbj.decor_invoketksp(event);
}
function toggle14(event) {
    var cc = event.target;
    gflag.allow_packhide_tkdata = cc.checked;
    cc.nextSibling.nextSibling.style.display = cc.checked ? 'block' : 'none';
}

function toggle2(event) {
    event.target.style.display = 'none';
    event.target.nextSibling.style.display = 'block';
}


function plot_ruler(param) {
    /*
     .ctx
     .start, .stop: plotting position
     .min, .max: values
     .horizontal: boolean
     if true, ruler opens to bottom
     start/stop are x coord
     requires .yoffset
     if false, ruler opens to left
     start/stop are y coord
     requires .xoffset
     */
// for svg
    var svgdata = [];
    var svtext = param.scrollable ? svgt_text : svgt_text_notscrollable;
    var svline = param.scrollable ? svgt_line : svgt_line_notscrollable;
    var a, b, c, d;

    var ctx = param.ctx;
    ctx.fillStyle = param.color;
    if (param.min == null || param.max == null) {
        // no data in view range
        return svgdata;
    }
    if (param.min > param.max) {
        param.max = param.min;
    }
    var ticksize = 4;
    var unit = 10;
    var total = param.max - param.min;
    while (Math.pow(10, unit) > total / 3) {
        unit--;
    }
    unit = Math.pow(10, unit);
    var sf; // px per value
    var aa, bb;
    if (param.horizontal) {
        a = param.start;
        b = param.yoffset;
        ctx.fillRect(a, b, 1, ticksize);
        if (param.tosvg) svgdata.push({type: svline, x1: a, y1: b, x2: a, y2: b + ticksize, color: param.color});
        a = param.start;
        b = param.yoffset;
        c = param.stop - param.start;
        ctx.fillRect(a, b, c, 1);
        if (param.tosvg) svgdata.push({type: svline, x1: a, y1: b, x2: a + c, y2: b, color: param.color});
        a = param.stop;
        b = param.yoffset;
        ctx.fillRect(a, b, 1, ticksize);
        if (param.tosvg) svgdata.push({type: svline, x1: a, y1: b, x2: a, y2: b + ticksize, color: param.color});

        var s = neatstr(param.min);
        a = param.start;
        b = param.yoffset + ticksize + 10;
        ctx.fillText(s, a, b);
        if (param.tosvg) svgdata.push({type: svtext, x: a, y: b, text: s, color: param.color});

        aa = param.start + ctx.measureText(s).width; // later use

        s = neatstr(param.max);
        var w = ctx.measureText(s).width;
        a = param.stop - w;
        b = param.yoffset + ticksize + 10;
        ctx.fillText(s, a, b);
        if (param.tosvg) svgdata.push({type: svtext, x: a, y: b, text: s, color: param.color});

        bb = param.stop - w;

        sf = (param.stop - param.start) / (param.max - param.min);
    } else {
        // min tick
        a = param.xoffset - ticksize;
        b = param.start;
        ctx.fillRect(a, b, ticksize, 1);
        if (param.tosvg) svgdata.push({type: svline, x1: a, y1: b, x2: a + ticksize, y2: b, color: param.color});
        // vertical line
        a = param.xoffset;
        b = param.stop;
        c = param.start - param.stop + 1;
        ctx.fillRect(a, b, 1, c);
        if (param.tosvg) svgdata.push({type: svline, x1: a, y1: b, x2: a, y2: b + c, color: param.color});
        // max tick
        a = param.xoffset - ticksize;
        b = param.stop;
        ctx.fillRect(a, b, ticksize, 1);
        if (param.tosvg) svgdata.push({type: svline, x1: a, y1: b, x2: a + ticksize, y2: b, color: param.color});
        // min v
        var s = neatstr(param.min);
        a = param.xoffset - ticksize - ctx.measureText(s).width - 2;
        b = param.start;
        ctx.fillText(s, a, b);
        if (param.tosvg) svgdata.push({type: svtext, x: a, y: b, text: s, color: param.color});

        aa = param.start - 10;

        // max v
        s = neatstr(param.max);
        a = param.xoffset - ticksize - ctx.measureText(s).width - 2;
        b = param.stop + 10 + (param.max_offset ? param.max_offset : 0);
        ctx.fillText(s, a, b);
        if (param.tosvg) svgdata.push({type: svtext, x: a, y: b, text: s, color: param.color});

        bb = param.stop + 10;

        sf = (param.start - param.stop) / (param.max - param.min);
    }
    if (param.extremeonly) {
        // try to put 0
        if (param.min < 0 && param.max > 0) {
            if (param.horizontal) {
            } else {
                a = param.xoffset - ticksize;
                b = param.stop + (param.start - param.stop) * param.max / (param.max - param.min);
                ctx.fillRect(a, b, ticksize, 1);
                if (param.tosvg) svgdata.push({
                    type: svline,
                    x1: a,
                    y1: b,
                    x2: a + ticksize,
                    y2: b,
                    color: param.color
                });
            }
        }
        return svgdata;
    }
    for (var i = Math.ceil(param.min / unit); i <= Math.floor(param.max / unit); i++) {
        var value = unit * i;
        var str = neatstr(value);
        if (param.horizontal) {
            var x = (value - param.min) * sf + param.start;
            a = param.yoffset;
            ctx.fillRect(x, a, 1, ticksize);
            if (svgdata) svgdata.push({type: svline, x1: x, y1: a, x2: x, y2: a + ticksize, color: param.color});
            var w = ctx.measureText(str).width;
            if (x - aa > w / 2 + 2 && bb - x > w / 2 + 2) {
                a = x - w / 2;
                b = param.yoffset + ticksize + 10;
                ctx.fillText(str, a, b);
                if (param.tosvg) svgdata.push({type: svtext, x: a, y: b, text: str, color: param.color});
                aa = x + w / 2;
            }
        } else {
            var y = param.start - (value - param.min) * sf;
            a = param.xoffset - ticksize;
            ctx.fillRect(a, y, ticksize, 1);
            if (param.tosvg) svgdata.push({type: svline, x1: a, y1: y, x2: a + ticksize, y2: y, color: param.color});
            if (aa - y > 7 && y - bb > 7) {
                a = param.xoffset - ticksize - 2 - ctx.measureText(str).width;
                b = y + 5;
                ctx.fillText(str, a, b);
                if (param.tosvg) svgdata.push({type: svtext, x: a, y: b, text: str, color: param.color});
                aa = y - 5;
            }
        }
    }
    return svgdata;
}

function drawscale_compoundtk(arg) {
    /* 3 values: top - middle -bottom
     arg.h is half total height
     */
    var a = arg.x,
        b = arg.y,
        c = arg.h * 2 + 2,
        ctx = arg.ctx,
        linetype = arg.scrollable ? svgt_line : svgt_line_notscrollable,
        texttype = arg.scrollable ? svgt_text : svgt_text_notscrollable;
    var svgdata = [];
    ctx.fillRect(a, b, 1, c);
    if (arg.tosvg) svgdata.push({type: linetype, x1: a, y1: b, x2: a, y2: b + c, color: ctx.fillStyle});
    a -= 4;
    ctx.fillRect(a, b, 4, 1);
    if (arg.tosvg) svgdata.push({type: linetype, x1: a, y1: b, x2: a + 4, y2: b, color: ctx.fillStyle});
    b += arg.h + 1;
    ctx.fillRect(a, b, 4, 1);
    if (arg.tosvg) svgdata.push({type: linetype, x1: a, y1: b, x2: a + 4, y2: b, color: ctx.fillStyle});
    b += arg.h;
    ctx.fillRect(a, b, 4, 1);
    if (arg.tosvg) svgdata.push({type: linetype, x1: a, y1: b, x2: a + 4, y2: b, color: ctx.fillStyle});
// top
    var w = ctx.measureText(arg.v1).width;
    b = densitydecorpaddingtop + 10;
    ctx.fillText(arg.v1, a - w - 3, b);
    if (arg.tosvg) svgdata.push({type: texttype, x: a - w - 3, y: b, text: arg.v1, color: ctx.fillStyle});
// middle
    b += arg.h - 5;
    ctx.fillText(arg.v2, a - 10, b);
    if (arg.tosvg) svgdata.push({type: texttype, x: a - 10, y: b, text: arg.v2, color: ctx.fillStyle});
// bottom
    w = ctx.measureText(arg.v3).width;
    b = densitydecorpaddingtop + arg.h * 2;
    ctx.fillText(arg.v3, a - w - 3, b);
    if (arg.tosvg) svgdata.push({type: texttype, x: a - w - 3, y: b, text: arg.v3, color: ctx.fillStyle});

    if (arg.tosvg) return svgdata;
}


function shake_dom(dom) {
    gflag.shakedom = dom;
    var l = parseInt(dom.style.left);
    var s = 50;
    setTimeout('gflag.shakedom.style.left="' + (l - 5) + '"', s);
    setTimeout('gflag.shakedom.style.left="' + (l + 5) + '"', s * 2);
    setTimeout('gflag.shakedom.style.left="' + (l - 5) + '"', s * 3);
    setTimeout('gflag.shakedom.style.left="' + (l + 5) + '"', s * 4);
    setTimeout('gflag.shakedom.style.left="' + l + '"', s * 5);
}


function panelFadein(d, x1, y1) {
    d.style.display = 'block';
    if (x1 != null) {
        d.style.left = x1;
        d.style.top = y1;
    }
    d.addEventListener('animationend', panelFadein_end, false);
    d.addEventListener('webkitAnimationEnd', panelFadein_end, false);
    if (d.className) {
        d.className += ' fadein';
    } else {
        d.className = 'fadein';
    }
}
function panelFadein_end(event) {
    var d = event.target;
    d.removeEventListener('animationend', panelFadein_end, false);
    d.removeEventListener('webkitAnimationEnd', panelFadein_end, false);
    var lst = d.className.split(' ');
    if (lst.length == 1) {
        d.className = '';
    } else {
        lst.pop();
        d.className = lst.join(' ');
    }
}
function panelFadeout(d) {
    d.addEventListener('animationend', panelFadeout_end, false);
    d.addEventListener('webkitAnimationEnd', panelFadeout_end, false);
    if (d.className) {
        d.className += ' fadeout';
    } else {
        d.className = 'fadeout';
    }
}
function panelFadeout_end(event) {
    var d = event.target;
    d.removeEventListener('animationend', panelFadeout_end, false);
    d.removeEventListener('webkitAnimationEnd', panelFadeout_end, false);
    var lst = d.className.split(' ');
    if (lst.length == 1) {
        d.className = '';
    } else {
        lst.pop();
        d.className = lst.join(' ');
    }
    d.style.display = 'none';
}

function page_keyup(event) {
// pushing Esc to remove any app panel that is open
    if (event.keyCode !== 27) return;
    if (menu.style.display != 'none') menu_hide();
    if (menu2.style.display != 'none') menu2_hide();
    if (bubble.style.display != 'none') bubbleHide();
    for (var appname in apps) {
        if (apps[appname].main.style.display != 'none') {
            if (appname == 'oneshot') {
                shake_dom(apps.oneshot.main);
                return;
            }
            pagecloak.style.display = 'none';
            panelFadeout(apps[appname].main);
            return;
        }
    }
}


function print2console(what, msgtype) {
    if (!msgconsole) {
        if (msgtype == 3) alert(what);
        return;
    }
    switch (msgtype) {
        case 0:
            // normal
            dom_addtext(msgconsole, what);
            dom_create('br', msgconsole);
            break;
        case 1:
            // done
            dom_addtext(msgconsole, what, '#2A9242');
            dom_create('br', msgconsole);
            break;
        case 2:
            // reminder or warning
            dom_create('div', msgconsole, 'color:#E4273A;').innerHTML = what;
            shake_dom(floatingtoolbox);
            break;
        case 3:
            // fatal error
            dom_create('div', msgconsole, 'color:white;background-color:#E3394A;').innerHTML = what;
            shake_dom(floatingtoolbox);
            break;
        default:
            return;
    }
    msgconsole.scrollTop = 9999;
}
function done() {
    print2console('done', 1);
}


function tkishidden(t) {
    if (t.mastertk) return true;
    return false;
}
function tk_height(tk) {
    if (tkishidden(tk)) return 0;
    if (!tk.canvas) return 0;
    return tk.canvas.height;
}
function cmtk_height(tk) {
    if (tk.cm.combine || !tk.cm.set.rd_r) return tk.qtc.height + densitydecorpaddingtop;
    return 1 + 2 * (tk.qtc.height + densitydecorpaddingtop);
}

function geneisinvalid(gene) {
    if (!gene.c || !gene.a || !gene.b) {
        gflag.badgene = gene;
        return true;
    }
    return false
}

Browser.prototype.bbjparamfillto_x = function (pa) {
    var vr = this.getDspStat();
    if (this.is_gsv()) {
        this.gsv_savelst();
        pa.gsvparam = {list: this.genesetview.savelst, viewrange: vr};
        delete pa.coord_rawstring;
    } else {
        pa.coord_rawstring = vr.join(',');
        var j = this.juxtaposition;
        if (j.type == RM_jux_n || j.type == RM_jux_c) {
            pa.juxtapose_rawstring = j.what;
            if (j.type == RM_jux_c) {
                pa.juxtaposecustom = true;
            }
            delete pa.run_gsv;
        }
    }
};

Browser.prototype.bbjparamfillto_tk = function (pa) {
// mmm matplot
    if (!pa.tklst) pa.tklst = [];
    if (!pa.cmtk) pa.cmtk = [];
    if (!pa.matplot) pa.matplot = [];
    if (!pa.track_order) pa.track_order = [];
    for (var i = 0; i < this.tklst.length; i++) {
        var t = this.tklst[i];
        if (t.ft == FT_cm_c) {
            pa.cmtk.push(t);
            pa.track_order.push({name: t.name, where: t.where});
        } else if (t.ft == FT_matplot) {
            pa.matplot.push(t);
            pa.track_order.push({name: t.name, where: t.where});
        } else {
            pa.tklst.push(t);
            if (!tkishidden(t)) {
                pa.track_order.push({name: t.name, where: t.where});
            }
        }
    }
};


function str2jsonobj(str) {
    var j = null;
    try {
        var j = JSON.parse(str);
    } catch (e) {
        try {
            if (str[0] == '{') {
                if (str[str.length - 1] == '}') {
                    try {
                        j = eval('(' + str + ')');
                    } catch (err) {
                    }
                }
            } else {
                try {
                    j = eval('({' + str + '})');
                } catch (err) {
                }
            }
        } catch (e) {
            return null;
        }
    }
    return j;
}

function hammockjsondesc2tk(a, b) {
    for (var k in a) {
        if (k == 'categories') {
            b.cateInfo = a[k];
        } else {
            b[k] = a[k];
        }
    }
}

function bbjisbusy() {
    for (var x in gflag.bbj_x_updating) {
        return true;
    }
    return false;
}

/*** __tiny__ ends ***/

