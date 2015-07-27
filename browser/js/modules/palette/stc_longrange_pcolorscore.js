/**
 * ===BASE===// palette // stc_longrange_pcolorscore.js
 * @param 
 */

function stc_longrange_pcolorscore() {
    /* apply positive score cutoff for coloring
     TODO hammock generic
     */
    var score = parseFloat(menu.lr.pcscore.value);
    if (isNaN(score)) {
        print2console('Invalid input for positive score cutoff', 2);
        return;
    }
    if (score < 0) {
        print2console('score cutoff must be positive', 2);
        return;
    }
    menu_update_track(21);
}
