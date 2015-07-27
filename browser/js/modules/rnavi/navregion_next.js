/**
 * ===BASE===// rnavi // navregion_next.js
 * @param 
 */

function navregion_next() {
    if (bbjisbusy()) return;
    var lst = apps.navregion.holder.childNodes;
    if (lst.length - 1 <= apps.navregion.idx) return;
    navregion_use(lst[++apps.navregion.idx]);
}
