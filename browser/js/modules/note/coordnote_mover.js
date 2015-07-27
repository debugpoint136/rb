/**
 * ===BASE===// note // coordnote_mover.js
 * @param 
 */

function coordnote_mover(event) {
// pica shows note text
    var lst = gflag.browser.notes;
    var pos = absolutePosition(event.target);
    for (var i = 0; i < lst.length; i++) {
        var n = lst[i];
        if (n.chrom == event.target.chrom && n.coord == event.target.coord) {
            picasays.innerHTML = 'At ' + n.chrom + ', ' + n.coord + ':<pre>' + n.text + '</pre>';
            pica_go(pos[0] + 20 - document.body.scrollLeft, pos[1] + 20 - document.body.scrollTop);
            return;
        }
    }
}

