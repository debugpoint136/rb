/**
 * ===BASE===// weaver // weaver_detail.js
 * @param __Browser.prototype__
 * @param 
 */

Browser.prototype.weaver_detail = function (x, hitpoint, result, tk, holder) {
    stripChild(holder, 0);
    if (tk.weaver.mode == W_rough) {
        var s = result.stitch;
        if (!s) return;
        var d = dom_create('div', holder, 'margin:10px;line-height:1.5;');
        d.innerHTML =
            'Entire ' + tk.cotton + ' region:<br>' +
            s.chr + ':' + s.start + '-' + s.stop + ' (' +
            bp2neatstr(s.stop - s.start) + ')' +
            (s.lst.length > 1 ? '<br>Joined by ' + s.lst.length + ' alignments.' : '') +
            '<div style="opacity:.8;font-size:80%;">Coordinates in the flags are approximate<br>because gaps are not considered.<br>ZOOM IN to view detailed alignment.</div>';
        return;
    }
    var item = result;
// determine chew start
    var a = x - item.hsp.canvasstart;
    var spsize = this.regionLst[hitpoint.rid][7];
    var chewstart = item.hsp.chew_start + parseInt(this.entire.atbplevel ? a / this.entire.bpwidth : a * spsize);
    var chewflank = 10 + Math.min(15, this.entire.atbplevel ? 0 : parseInt(spsize));
    var targetbp = [], querybp = [], aln = [];
    var fv = item.hsp.strand == '+';
    var targetcoord = item.hsp.targetstart,
        querycoord = fv ? item.hsp.querystart : item.hsp.querystop;
    for (var i = item.hsp.chew_start; i < Math.max(item.hsp.chew_start, chewstart - chewflank); i++) {
        if (item.hsp.targetseq[i] != '-') targetcoord++;
        if (item.hsp.queryseq[i] != '-') querycoord += fv ? 1 : -1;
    }
    var chewrealstart = i;
    var targetstart = targetcoord;
    var querystart, querystop,
        tchl = [], qchl = []; // t/q highlight coord
    if (fv) querystart = querycoord;
    else querystop = querycoord;
    for (; i < Math.min(item.hsp.targetseq.length, chewstart + chewflank); i++) {
        var t = item.hsp.targetseq[i],
            q = item.hsp.queryseq[i];
        if (t != '-' && q != '-' && (t.toLowerCase() == q.toLowerCase())) {
            aln.push('|');
        } else {
            aln.push('&nbsp;');
        }
        // only highlight those in summary point
        var highlight = this.entire.atbplevel ? (i == chewstart) : (i >= chewstart - spsize / 2 && i <= chewstart + spsize / 2);
        targetbp.push(highlight ? '<span style="background-color:rgba(255,255,0,.2);">' + t + '</span>' : t);
        querybp.push(highlight ? '<span style="background-color:rgba(255,255,0,.2);">' + q + '</span>' : q);
        if (highlight) {
            tchl.push(targetcoord);
            qchl.push(querycoord);
        }
        if (t != '-') targetcoord++;
        if (q != '-') querycoord += fv ? 1 : -1;
    }
    var chewrealstop = i;
    if (fv) querystop = querycoord;
    else querystart = querycoord;

    var table = dom_create('table', holder, 'margin:10px;color:white;');
// row 1
    var tr = table.insertRow(0);
    var td = tr.insertCell(0);
    td.colSpan = 3;
    td.style.paddingBottom = 10;
// target highlight coord
    var max = min = tchl[0];
    for (var i = 1; i < tchl.length; i++) {
        var a = tchl[i];
        if (a > max) max = a;
        if (a < min) min = a;
    }
    td.innerHTML = this.genome.name + ', ' + this.regionLst[hitpoint.rid][0] + '&nbsp;&nbsp;' +
    '<span style="background-color:rgba(255,255,0,.2);">' +
    (max == min ? max : min + '-' + max) + '</span>';
// row 2
    tr = table.insertRow(-1);
    td = tr.insertCell(0);
    td.style.opacity = .7;
    td.innerHTML = targetstart;
    td = tr.insertCell(1);
    td.style.font = '15px Courier,monospace';
    td.innerHTML = targetbp.join('');
    td = tr.insertCell(2);
    td.style.opacity = .7;
    td.innerHTML = targetcoord;
// row 3
    tr = table.insertRow(-1);
    tr.insertCell(0);
    td = tr.insertCell(1);
    td.style.font = '15px Courier,monospace';
    td.innerHTML = aln.join('');
    tr.insertCell(2);
// row 4
    tr = table.insertRow(-1);
    td = tr.insertCell(0);
    td.style.opacity = .7;
    td.innerHTML = fv ? querystart : querystop;
    td = tr.insertCell(1);
    td.style.font = '15px Courier,monospace';
    td.innerHTML = querybp.join('');
    td = tr.insertCell(2);
    td.style.opacity = .7;
    td.innerHTML = fv ? querystop : querystart;
// row 5
    tr = table.insertRow(-1);
    td = tr.insertCell(0);
    td.colSpan = 3;
    td.style.paddingTop = 10;
// target highlight coord
    var max = min = qchl[0];
    for (var i = 1; i < qchl.length; i++) {
        var a = qchl[i];
        if (a > max) max = a;
        if (a < min) min = a;
    }
    td.innerHTML = tk.cotton + ', ' + item.hsp.querychr + '&nbsp;&nbsp;' +
    '<span style="background-color:rgba(255,255,0,.2);">' +
    (max == min ? max : (fv ? min + '-' + max : max + '-' + min)) + '</span>&nbsp;&nbsp;' +
    '<span style="opacity:.7;">' + (item.hsp.strand == '+' ? 'forward' : 'reverse') + '</span>';
    return [chewrealstart, chewrealstop, table];
};

