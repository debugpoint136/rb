/**
 * ===BASE===// note // coordnote_submit.js
 * @param 
 */

function coordnote_submit() {
// no ajax
    var text = menu.stickynote.textarea.value;
    if (text.length == 0) {
        print2console('Cannot make note: no text written', 2);
        return;
    }
    var bbj = gflag.note.bbj;
    if (gflag.note.update) {
        var lst = bbj.notes;
        for (var i = 0; i < lst.length; i++) {
            if (lst[i].chrom == gflag.note.chrom && lst[i].coord == gflag.note.coord) {
                lst[i].text = text;
                break;
            }
        }
    } else {
        bbj.notes.push({
            chrom: gflag.note.chrom,
            coord: gflag.note.coord,
            text: text,
        });
    }
    bbj.drawIdeogram_browser(false);
    for (var s in bbj.splinters)
        bbj.splinters[s].drawIdeogram_browser(false);
    menu_hide();
}

