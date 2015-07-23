/**
 * Created by dpuru on 2/27/15.
 */
/*** __note__ ***/

function menu_coordnote(event) {
// right click on main panel ideogram canvas, show option related to coordnote
    if (!menu.stickynote) return;
    menu_shutup();
    var n = menu.stickynote;
    n.style.display = 'block';
    if (event.target.tagName == 'IMG') {
        // clicked on note
        n.firstChild.style.display =
            n.childNodes[1].style.display = 'none';
        n.childNodes[2].style.display = 'block';
        menu_show(0, event.clientX, event.clientY);
        var pos = absolutePosition(event.target);
        placeIndicator3(pos[0], pos[1], event.target.clientWidth, event.target.clientHeight);
        gflag.note = {
            bbj: gflag.browser,
            chrom: event.target.chrom,
            coord: event.target.coord,
            update: true,
        };
    } else {
        n.firstChild.style.display = 'block';
        n.childNodes[1].style.display =
            n.childNodes[2].style.display = 'none';
        menu_show(0, event.clientX, event.clientY);
        var pos = absolutePosition(event.target);
        var x = event.clientX + document.body.scrollLeft;
        placeIndicator3(x, pos[1], 1, event.target.height);
        var bbj = gflag.browser;
        pos = absolutePosition(bbj.hmdiv.parentNode);
        var rr = bbj.sx2rcoord(x - pos[0] - bbj.move.styleLeft);
        if (!rr) return false;
        gflag.note = {
            bbj: (bbj.splinterTag != null ? bbj.trunk : bbj),
            chrom: bbj.regionLst[rr.rid][0],
            coord: rr.coord,
            update: false,
        };
    }
    return false;
}

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

Browser.prototype.draw_coordnote = function () {
    /* draw/make coordnote after ideogram is drawn
     called by drawIdeogram_browser()
     */
    var holder = this.ideogram.canvas.parentNode;
    stripChild(holder, 1);
// first of all, remove all notes there
    if (this.notes.length == 0) return;

// insert notes
    var xoffset = 0;
    for (var i = 0; i < this.regionLst.length; i++) {
        var r = this.regionLst[i];
        for (var j = 0; j < this.notes.length; j++) {
            var n = this.notes[j];
            if (n.chrom != r[0] || r[3] > n.coord || r[4] < n.coord) continue;
            // insert this note
            var img = document.createElement('img');
            img.src = 'images/stickyNote.png';
            img.className = 'coordnote';
            img.oncontextmenu = menu_coordnote;
            img.addEventListener('mouseover', coordnote_mover, false);
            img.addEventListener('mouseout', pica_hide, false);
            img.chrom = n.chrom;
            img.coord = n.coord;
            holder.appendChild(img);
            img.style.left = xoffset +
            (this.entire.atbplevel ? ((n.coord - r[3]) * this.entire.bpwidth) : ((n.coord - r[3]) / r[7]));
        }
        xoffset += r[5] + regionSpacing.width;
    }
};

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