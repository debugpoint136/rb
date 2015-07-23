/**
 * Created by dpuru on 2/27/15.
 */
/** __rnavi__ navigate region */
function toggle30() {
    apps.navregion.shortcut.style.display = 'inline-block';
    if (apps.navregion.main.style.display == "none") {
        panelFadein(apps.navregion.main, 100 + document.body.scrollLeft, 50 + document.body.scrollTop);
    } else {
        panelFadeout(apps.navregion.main);
    }
    menu_hide();
}

function navregion_prev() {
    if (bbjisbusy()) return;
    if (apps.navregion.idx <= 0) return;
    navregion_use(apps.navregion.holder.childNodes[--apps.navregion.idx]);
}
function navregion_next() {
    if (bbjisbusy()) return;
    var lst = apps.navregion.holder.childNodes;
    if (lst.length - 1 <= apps.navregion.idx) return;
    navregion_use(lst[++apps.navregion.idx]);
}
function navregion_go(event) {
    if (bbjisbusy()) return;
    navregion_use(event.target);
}
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
