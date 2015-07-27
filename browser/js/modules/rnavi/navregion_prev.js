/**
 * ===BASE===// rnavi // navregion_prev.js
 * @param 
 */

function navregion_prev() {
    if (bbjisbusy()) return;
    if (apps.navregion.idx <= 0) return;
    navregion_use(apps.navregion.holder.childNodes[--apps.navregion.idx]);
}
