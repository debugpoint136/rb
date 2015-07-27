/**
 * ===BASE===// facet // facettermclick_grid.js
 * @param 
 */

function facettermclick_grid(event) {
    var bbj = apps.hmtk.bbj;
    var td = event.target;
    while (td.tagName != 'TD') {
        td = td.parentNode;
    }
    var voc = gflag.mdlst[td.iscolumn ? bbj.facet.dim2.mdidx : bbj.facet.dim1.mdidx];
    var termarray = td.iscolumn ? bbj.facet.collst : bbj.facet.rowlst;
    var term = termarray[td.idx];
    if (term[2] == '&#8862;') {
        // expand details, insert child terms into array
        term[2] = '&#8863;';
        var j = 1;
        for (var cterm in voc.p2c[term[0]]) {
            termarray.splice(td.idx + j, 0, [cterm, term[1] + 20, '&#8862;']);
            j++;
        }
    } else {
        // hide details, remove child terms from array
        term[2] = '&#8862;';
        var lst = [];
        bbj.genome.mdvGetallchild(term[0], voc.p2c, lst);
        var i = 0;
        while (true) {
            if (thinginlist(termarray[i][0], lst)) {
                termarray.splice(i, 1);
            } else {
                i++;
            }
            if (i == termarray.length) break;
        }
    }
    bbj.generateTrackselectionGrid();
}

