/**
 * Created by dpuru on 2/27/15.
 */

function bubbleShow(x, y) {
    bubble.style.display = "block";
    bubble.style.left = x - 13;
    bubble.style.top = y;
    document.body.addEventListener("mousedown", bubbleHide, false);
    bubble.sayajax.style.display = 'none';
    setTimeout('bubble.says.style.maxHeight="800px";', 1);
}
function bubbleHide() {
    bubble.style.display = 'none';
    document.body.removeEventListener('mousedown', bubbleHide, false);
    setTimeout('bubble.says.style.maxHeight=0;bubble.sayajax.style.maxHeight=0;', 1);
// must not directly set maxHeight to 0 in case of clicking on blank track region
}
function bubbleMover() {
    document.body.removeEventListener('mousedown', bubbleHide, false);
}
function bubbleMout() {
    document.body.addEventListener('mousedown', bubbleHide, false);
}
Browser.prototype.lditemclick_gotdata = function (data, tkobj, rs1, rs2) {
    if (!data || !data.tkdatalst || data.tkdatalst.length == 0) {
        bubble.sayajax.innerHTML = 'Error fetching data, sorry...';
        return;
    }
    var t = data.tkdatalst[0].data;
    if (!t || t.length != 2) {
        bubble.sayajax.innerHTML = 'no data...';
        return;
    }
    stripChild(bubble.sayajax, 0);
    var table3 = dom_create('table', bubble.sayajax, 'color:white');
    var tr3 = table3.insertRow(0);
    var td1 = tr3.insertCell(0);
    td1.style.paddingRight = 20;
    var miss = true;
    for (var i = 0; i < t[0].length; i++) {
        var item = t[0][i];
        if (item.name == rs1) {
            var table = dom_create('table', td1, 'color:white');
            var td = table.insertRow(0).insertCell(0);
            td.colSpan = 2;
            if (tkobj.queryUrl) {
                td.innerHTML = '<a href=' + tkobj.queryUrl + rs1 + ' style="color:white" target=_blank>' + rs1 + '</a>';
            } else {
                td.innerHTML = rs1;
            }
            if (item.category != undefined && tkobj.cateInfo) {
                td = table.insertRow(-1).insertCell(0);
                td.colSpan = 2;
                var c = tkobj.cateInfo[item.category];
                td.innerHTML = '<span class=squarecell style="padding:0px 8px;background-color:' + c[1] + ';">&nbsp;</span> ' + c[0];
            }
            if (item.details) {
                for (var k in item.details) {
                    var tr = table.insertRow(-1);
                    td = tr.insertCell(0);
                    td.style.fontStyle = 'italic';
                    td.style.opacity = 0.8;
                    td.innerHTML = k;
                    td = tr.insertCell(1);
                    td.innerHTML = item.details[k];
                }
            }
            miss = false;
            break;
        }
    }
    if (miss) {
        td1.innerHTML =
            (tkobj.queryUrl ? '<a href=' + tkobj.queryUrl + rs1 + ' style="color:white" target=_blank>' + rs1 + '</a>' : rs1) +
            '<br>No data';
    }
// duplication
    var td2 = tr3.insertCell(1);
    miss = true;
    for (var i = 0; i < t[1].length; i++) {
        var item = t[1][i];
        if (item.name == rs2) {
            var table = dom_create('table', td2, 'color:white');
            var td = table.insertRow(0).insertCell(0);
            td.colSpan = 2;
            if (tkobj.queryUrl) {
                td.innerHTML = '<a href=' + tkobj.queryUrl + rs2 + '  style="color:white" target=_blank>' + rs2 + '</a>';
            } else {
                td.innerHTML = rs2;
            }
            if (item.category != undefined && tkobj.cateInfo) {
                td = table.insertRow(-1).insertCell(0);
                td.colSpan = 2;
                var c = tkobj.cateInfo[item.category];
                td.innerHTML = '<span class=squarecell style="padding:0px 8px;background-color:' + c[1] + ';">&nbsp;</span> ' + c[0];
            }
            if (item.details) {
                for (var k in item.details) {
                    var tr = table.insertRow(-1);
                    td = tr.insertCell(0);
                    td.style.fontStyle = 'italic';
                    td.style.opacity = 0.8;
                    td.innerHTML = k;
                    td = tr.insertCell(1);
                    td.innerHTML = item.details[k];
                }
            }
            miss = false;
        }
    }
    if (miss) {
        td2.innerHTML =
            (tkobj.queryUrl ? '<a href=' + tkobj.queryUrl + rs2 + ' style="color:white" target=_blank>' + rs2 + '</a>' : rs2) +
            '<br>No data';
    }
    bubble.sayajax.style.maxHeight = 1000;
};

function sort_struct(a, b) {
    return a[0] - b[0];
}

function samread_seqregion(cigar, coord) {
    var lst = [];
    for (var i = 0; i < cigar.length; i++) {
        var op = cigar[i][0];
        var cl = cigar[i][1];
        if (op == 'M') {
            lst.push([coord, coord + cl]);
        }
        coord += cl;
    }
    return lst;
}

Browser.prototype.trackitem_delete = function (tk, item, itemRidx) {
    for (var i = 0; i < tk.data[itemRidx].length; i++) {
        if (tk.data[itemRidx][i].id == item.id) {
            tk.data[itemRidx].splice(i, 1);
            var oldheight = tk.canvas.height;
            this.stack_track(tk, 0);
            this.drawTrack_browser(tk);
            if (tk.canvas.height != oldheight) {
                this.trackHeightChanged();
            }
            bubbleHide();
            return;
        }
    }
    print2console('Can\'t find this item!?', 2);
};

Browser.prototype.track2packmode = function (tk) {
    var data2 = [];
    for (var i = 0; i < tk.data.length; i++) {
        var lst2 = [];
        for (var j = 0; j < tk.data[i].length; j++) {
            var item = tk.data[i][j];
            var ni = item.name2 ? item.name2 : item.name;
            var keep = true;
            for (var k = 0; k < lst2.length; k++) {
                var a = lst2[k].start,
                    b = lst2[k].stop,
                    nk = lst2[k].name2 ? lst2[k].name2 : lst2[k].name;
                if (a <= item.start && b >= item.stop && nk == ni) {
                    // do nothing
                    keep = false;
                    break;
                } else if (a >= item.start && b <= item.stop) {
                    lst2.splice(k, 1, item);
                    keep = false;
                    break;
                } else if (Math.max(a, item.start) < Math.min(b, item.stop)) {
                    // try name
                    if (nk == ni) {
                        if (b - a < item.stop - item.start) {
                            lst2.splice(k, 1, item);
                        }
                        keep = false;
                        break;
                    }
                }
            }
            if (keep) {
                lst2.push(item);
            }
        }
        data2.push(lst2);
    }
    tk.data = data2;
    var oldheight = tk.canvas.height;
    this.stack_track(tk, 0);
    this.drawTrack_browser(tk);
    if (tk.canvas.height != oldheight) {
        this.trackHeightChanged();
    }
};


Browser.prototype.bamread2bubble = function (data, item) {
    if (!data || !data.lst) {
        print2console('Server error, please try again!', 2);
        return;
    }
    stripChild(bubble.sayajax, 0);
    var table = dom_create('table', bubble.sayajax);
    table.style.color = 'white';
    if (item.hasmate) {
        // paired-end
        var r1 = item.struct.L;
        var r2 = item.struct.R;
        var coord_l = samread_seqregion(r1.bam.cigar, r1.start),
            coord_r = samread_seqregion(r2.bam.cigar, r2.start);
        if (data.lst.length != coord_l.length + coord_r.length) {
            print2console('Sequence data error', 2);
            return;
        }
        var tr = table.insertRow(0);
        var td = tr.insertCell(0);
        td.colSpan = 2;
        td.style.borderTop = 'solid 1px rgba(255,255,255,0.1)';
        td.style.color = 'white';
        dom_addtext(td, '[ left end ]');
        printSamread(table, r1.bam, data.lst.splice(0, coord_l.length).join(''));
        tr = table.insertRow(-1);
        td = tr.insertCell(0);
        td.colSpan = 2;
        td.style.borderTop = 'solid 1px rgba(255,255,255,0.1)';
        td.style.color = 'white';
        dom_addtext(td, '[ right end ]');
        printSamread(table, r2.bam, data.lst.join(''));
    } else {
        var c = samread_seqregion(item.bam.cigar, item.start);
        printSamread(table, item.bam, data.lst.join(''));
    }
    bubble.sayajax.style.maxHeight = 1000;
};

function printSamread(table, info, refseq) {
    var tr = table.insertRow(-1);
    var td = tr.insertCell(0);
    td.colSpan = 2;
    var alignlen = 0; // aligned length
    if (info.cigar) {
        for (var i = 0; i < info.cigar.length; i++) {
            var c = info.cigar[i];
            if (c[0] == 'M') alignlen += c[1];
        }
    }
    td.innerHTML = ((((info.flag >> 4) & 1) == 1) ? 'Reverse' : 'Forward') + ', ' +
    (alignlen == info.seq.length ? alignlen + ' bp' : 'read length: ' + info.seq.length + ' bp, ' + alignlen + ' bp aligned');
    if (info.cigar) {
        tr = table.insertRow(-1);
        td = tr.insertCell(0);
        td.style.opacity = .5;
        td.innerHTML = 'cigar';
        td = tr.insertCell(1);
        td.innerHTML = cigar2str(info.cigar);
    }
    tr = table.insertRow(-1);
    td = tr.insertCell(0);
    td.style.opacity = .5;
    td.innerHTML = 'aln. start';
    td = tr.insertCell(1);
    td.innerHTML = info.start;
    tr = table.insertRow(-1);
    td = tr.insertCell(0);
    td.style.opacity = .5;
    td.innerHTML = 'aln. stop';
    td = tr.insertCell(1);
    td.innerHTML = info.stop;

    tr = table.insertRow(-1);
    td = tr.insertCell(0);
    td.style.opacity = .5;
    td.innerHTML = 'reference';
    var std = tr.insertCell(1);
    std.style.font = '15px Courier,monospace';
    tr = table.insertRow(-1);
    td = tr.insertCell(0);
    td.style.opacity = .5;
    td.innerHTML = 'read';
    td.style.paddingBottom = 10;
    var rtd = tr.insertCell(1);
    rtd.style.font = '15px Courier,monospace';
    rtd.style.paddingBottom = 10;
    var readseq = info.seq; // make copy
// insertion/deletion
    if (info.cigar.length > 0) {
        var i = 0;
        for (var j = 0; j < info.cigar.length; j++) {
            var op = info.cigar[j][0];
            var cl = info.cigar[j][1];
            if (op == 'I') {
                var tmp = [refseq.substr(0, i)];
                for (var k = 0; k < cl; k++) tmp.push('*');
                refseq = tmp.join('') + refseq.substr(i);
            } else if (op == 'D') {
                var tmp = [readseq.substr(0, i)];
                for (var k = 0; k < cl; k++) tmp.push('*');
                readseq = tmp.join('') + readseq.substr(i);
            }
            i += cl;
        }
    }
    var readbp = [];
    for (var i = 0; i < readseq.length; i++) {
        var a = null;
        if (i < refseq.length) a = refseq[i];
        var b = readseq[i];
        var rbp = dom_addtext(rtd, b);
        readbp.push(rbp);
        if (a) {
            dom_addtext(std, a);
            if (b != '*' && a != '*') {
                if (a.toLowerCase() != b.toLowerCase()) {
                    rbp.style.backgroundColor = 'rgba(255,255,0,0.4)';
                }
            }
        }
    }
// clippings
    if (info.cigar.length > 0) {
        var c = info.cigar[0];
        if (c[0] == 'S') {
            for (i = 0; i < c[1]; i++) {
                readbp[i].style.backgroundColor = colorCentral.background_faint_3;
            }
        }
        c = info.cigar[info.cigar.length - 1];
        if (c[0] == 'S') {
            for (i = 0; i < c[1]; i++) {
                readbp[readbp.length - 1 - i].style.backgroundColor = colorCentral.background_faint_3;
            }
        }
    }
}

function cigar2str(c) {
    var s = [];
    for (var i = 0; i < c.length; i++) {
        s.push(c[i][1]);
        s.push(c[i][0]);
    }
    return s.join('');
}


function dye_seq(seq) {
// soaked in an urn
    var lst = [];
    for (var i = 0; i < seq.length; i++) {
        var c = seq.charAt(i);
        lst.push('<span style="background-color:' + ntbcolor[c.toLowerCase()] + '">' + c + '</span>');
    }
    return lst.join('');
}


function findDecoritem_longrange_trihm(data, angle, mX, mY) {
    /* args:
     data - .data_trihm
     angle - .qtc.angle
     mX/mY - cursor position relative to start of canvas

     ascending lines:
     A : tan
     B : -1
     C : b-a*tan
     C2: b-a*tan-m*tan

     descending lines:
     A : -tan
     B : -1
     C : a*tan+b
     C2: a*tan+b-n*tan

     use formular to calculate point-to-line distance
     */
    var tan = Math.tan(angle);
    var sin = Math.sin(angle);
    for (var i = 0; i < data.length; i++) {
        var item = data[i];
        var a = item[0];
        var b = item[1];
        var m = item[2];
        var n = item[3];
        // distance to first ascending line
        if (Math.abs(tan * mX - mY + b - a * tan) > m * sin * Math.sqrt(tan * tan + 1)) continue;
        // distance to second ascending line
        if (Math.abs(tan * mX - mY + b - a * tan - m * tan) > m * sin * Math.sqrt(tan * tan + 1)) continue;
        // distance to first descending line
        if (Math.abs(-tan * mX - mY + a * tan + b) > n * sin * Math.sqrt(tan * tan + 1)) continue;
        // distance to second descending line
        if (Math.abs(-tan * mX - mY + a * tan + b - n * tan) > n * sin * Math.sqrt(tan * tan + 1)) continue;
        return item;
    }
    return null;
}
function findDecoritem_longrange_arc(data, x, y) {
    /* data: .data_arc
     x/y: absolute postion on tk canvas
     */
    for (var i = 0; i < data.length; i++) {
        var t = data[i];
        if (Math.abs(Math.sqrt(Math.pow(x - t[0], 2) + Math.pow(y - t[1], 2)) - t[2]) <= 2) {
            return t;
        }
    }
    return null;
}