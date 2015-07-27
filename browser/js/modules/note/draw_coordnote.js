/**
 * ===BASE===// note // draw_coordnote.js
 * @param __Browser.prototype__
 * @param 
 */

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

