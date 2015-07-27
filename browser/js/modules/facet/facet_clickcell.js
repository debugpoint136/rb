/**
 * ===BASE===// facet // facet_clickcell.js
 * @param 
 */

function facet_clickcell(event) {
    /* called by clicking on a number pair g/r in facet list or grid
     and show the list of tracks in menu.facettklsttable
     */
    var div = event.target;
    if (div.tagName != 'DIV') {
        div = div.parentNode;
    }
    var term1 = div.term1;
    if (term1 == null) return;
    var term2 = div.term2;
    var bbj = apps.hmtk.bbj;
    var tkset1 = {};
    bbj.mdgettrack(term1, bbj.facet.dim1.mdidx, tkset1);
    if (term2) {
        // second term available, from double criteria
        // can both be big grid, or sub-table which is also a grid
        var tkset2 = {};
        bbj.mdgettrack(term2, bbj.facet.dim2.mdidx, tkset2);
        var intersection = {};
        for (var tk in tkset1) {
            if (tk in tkset2) {
                intersection[tk] = 1;
            }
        }
        tkset1 = intersection;
    }
    gflag.tsp.invoke = {
        cell: div,
    };
    var tkselectionlst = [];
    for (var tk in tkset1) {
        tkselectionlst.push(tk);
    }
    if (tkselectionlst.length == 0) {
        return;
    }
    var pos = absolutePosition(div);
    bbj.showhmtkchoice({
        lst: tkselectionlst,
        x: pos[0] + div.clientWidth - 6 - document.body.scrollLeft,
        y: pos[1] - 10 - document.body.scrollTop,
        context: 10,
    });
}


