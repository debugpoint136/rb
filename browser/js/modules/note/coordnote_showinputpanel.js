/**
 * ===BASE===// note // coordnote_showinputpanel.js
 * @param 
 */

function coordnote_showinputpanel(event) {
// show input panel
// for new entry or updating
    var n = menu.stickynote;
    n.firstChild.style.display =
        n.childNodes[2].style.display = 'none';
    n.childNodes[1].style.display = 'block';
    n.says.innerHTML = gflag.note.chrom + ', ' + gflag.note.coord;
    var text = '';
    if (event.target.doedit) {
        var lst = gflag.note.bbj.notes;
        for (var i = 0; i < lst.length; i++) {
            if (lst[i].chrom == gflag.note.chrom && lst[i].coord == gflag.note.coord) {
                text = lst[i].text;
                break;
            }
        }
    }
    n.textarea.value = text;
}

