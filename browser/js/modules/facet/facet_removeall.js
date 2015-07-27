/**
 * ===BASE===// facet // facet_removeall.js
 * @param 
 */

function facet_removeall(event) {
    /* called by pushing butt in facet panel
     */
    var bbj = apps.hmtk.bbj;
    var cells = bbj.facet.main.getElementsByClassName('tscell');
    var tkshown = {};
    for (var i = 0; i < cells.length; i++) {
        if (cells[i].firstChild.className == 'r') {
            var s1 = {};
            bbj.mdgettrack(cells[i].term1, bbj.facet.dim1.mdidx, s1);
            if (cells[i].term2 != undefined) {
                var s2 = {};
                bbj.mdgettrack(cells[i].term2, bbj.facet.dim2.mdidx, s2);
                var si = {};
                for (var n in s2) {
                    if (n in s1) {
                        si[n] = 1;
                    }
                }
                s1 = si;
            }
            for (var n in s1) {
                tkshown[n] = 1;
            }
        }
    }
    var lst = [];
    for (var n in tkshown) {
        lst.push(n);
    }
    if (lst.length == 0) {
        print2console('No tracks are on display from this group.', 0);
        return;
    }
    bbj.removeTrack(lst);
    bbj.generateTrackselectionLayout();
}

/*** __facet__ ends ***/