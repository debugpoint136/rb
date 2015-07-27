/**
 * Created by dpuru on 7/26/15.
 */

Browser.prototype.mcmPlaceheader = function () {
    var m = this.mcm;
    if (!m || !m.holder) return;
    /* this is to escape for alethiometer
     */
    var lst = m.holder.firstChild.firstChild.childNodes;
    if (m.holder.attop == undefined) {
        for (var i = 0; i < lst.length; i++)
            lst[i].vAlign = 'bottom';
        return;
    }
    if (m.holder.attop) {
        m.headerholder_top.appendChild(m.holder);
        m.holder.style.top = '';
        m.holder.style.bottom = 0;
    } else {
        m.headerholder_bottom.appendChild(m.holder);
        m.holder.style.top = 0;
        m.holder.style.bottom = '';
    }
    for (var i = 0; i < lst.length; i++) {
        lst[i].vAlign = m.holder.attop ? 'bottom' : 'top';
    }
};