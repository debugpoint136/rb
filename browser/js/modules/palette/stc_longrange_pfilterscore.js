/**
 * ===BASE===// palette // stc_longrange_pfilterscore.js
 * @param 
 */

function stc_longrange_pfilterscore() {
    /* apply positive score cutoff for filtering
     TODO hammock
     */
    var score = parseFloat(menu.lr.pfscore.value);
    if (isNaN(score)) {
        print2console('Invalid input for positive score cutoff', 2);
        return;
    }
    if (score < 0) {
        print2console('score cutoff must be positive', 2);
        return;
    }
    menu_update_track(23);
}
