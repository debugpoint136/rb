/**
 * ===BASE===// note // coordnote_delete.js
 * @param 
 */

function coordnote_delete() {
    var bbj = gflag.note.bbj;
    var lst = bbj.notes;
    for (var i = 0; i < lst.length; i++) {
        if (lst[i].chrom == gflag.note.chrom && lst[i].coord == gflag.note.coord) {
            //bbj.ideogram.canvas.parentNode.removeChild(lst[i].img);
            lst.splice(i, 1);
            break;
        }
    }
    bbj.drawIdeogram_browser(false);
    for (var s in bbj.splinters)
        bbj.splinters[s].drawIdeogram_browser(false);
    menu_hide();
}

/*** __note__ ends ***/