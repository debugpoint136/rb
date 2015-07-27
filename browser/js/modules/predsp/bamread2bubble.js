/**
 * ===BASE===// predsp // bamread2bubble.js
 * @param __Browser.prototype__
 * @param 
 */

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

