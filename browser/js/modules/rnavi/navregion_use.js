/**
 * ===BASE===// rnavi // navregion_use.js
 * @param 
 */

function navregion_use(d) {
    var lst = apps.navregion.holder.childNodes;
    for (var i = 0; i < lst.length; i++) {
        lst[i].className = 'header_b';
        if (lst[i].innerHTML == d.innerHTML) apps.navregion.idx = i;
    }
    d.className = 'header_r';
    var b = gflag.browser;
    b.weavertoggle(d.stop - d.start);
    b.cgiJump2coord(d.coord);
}

/** __rnavi__ ends */
