/**
 * ===BASE===// predsp // printSamread.js
 * @param 
 */

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

