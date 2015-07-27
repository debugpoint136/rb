/**
 * ===BASE===// palette // stc_longrange_ncolorscore.js
 * @param 
 */

function stc_longrange_ncolorscore() {
    /* apply negative score cutoff for coloring
     TODO hammock
     */
    var score = parseFloat(menu.lr.ncscore.value);
    if (isNaN(score)) {
        print2console('Invalid input for negative score cutoff', 2);
        return;
    }
    if (score > 0) {
        print2console('score cutoff must be negative', 2);
        return;
    }
    menu_update_track(22);
}

