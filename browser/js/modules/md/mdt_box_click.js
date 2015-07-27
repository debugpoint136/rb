/**
 * from inside menu > tk detail > md term listing
 click box
 * @param box
 * @param term
 * @param voc
 */

function mdt_box_click(box, term, voc) {

    if (box.className != 'mdt_box') box = box.parentNode;
    if (box.__clc) {
        box.__clc = false;
        box.innerHTML = term in voc.idx2attr ? voc.idx2attr[term] : term;
        return;
    }
    var indent = '&nbsp;&nbsp;&nbsp;';
    var lst = [];
// FIXME not handling multi-parent case
    var x = term;
    while (x in voc.c2p) {
        var y = undefined;
        for (y in voc.c2p[x]) {
            break;
        }
        lst.unshift(y);
        x = y;
    }
    var name = term in voc.idx2attr ? voc.idx2attr[term] : term;
    lst.push(name);
    var slst = [];
    for (var i = 0; i < lst.length; i++) {
        slst.push('<div');
        if (i < lst.length - 1) {
            slst.push(' style="font-size:80%"');
        }
        slst.push('>');
        for (var j = 0; j < i; j++) {
            slst.push(indent);
        }
        if (i > 0) {
            slst.push('&#9492;&nbsp;');
        }
        slst.push(lst[i]);
        slst.push('</div>');
    }
    box.innerHTML = slst.join('') +
        (term in voc.idx2desc ?
            '<div style="font-size:70%;opacity:.8;">' + voc.idx2desc[term] + '<br>' +
            'term id: ' + term +
            '</div>' : ''
        );
    box.__clc = true;
}