/**
 * ===BASE===// palette // stc_longrange_nfilterscore.js
 * @param 
 */

function stc_longrange_nfilterscore() {
    /* apply negative score cutoff for filtering
     TODO hammock
     */
    var score = parseFloat(menu.lr.nfscore.value);
    if (isNaN(score)) {
        print2console('Invalid input for negative score cutoff', 2);
        return;
    }
    if (score > 0) {
        print2console('score cutoff must be negative', 2);
        return;
    }
    menu_update_track(24);
}

/*** __palette__ ends ***/