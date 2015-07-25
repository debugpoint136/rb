/**
 * show hmtk facet panel
 */

Browser.prototype.toggle1 = function () {
// show hmtk facet panel
    if (apps.hmtk.main.style.display == "none") {
        cloakPage();
        var b = this;
        if (this.trunk) b = this.trunk;
        b.facet.main.style.display = 'block';
        stripChild(apps.hmtk.holder, 0);
        apps.hmtk.holder.appendChild(b.facet.main);
        var tmp = b.tkCount();
        apps.hmtk.custtk2lst.style.display = tmp[1] > 0 ? 'block' : 'none';
        panelFadein(apps.hmtk.main, 100 + document.body.scrollLeft, 50 + document.body.scrollTop);
        apps.hmtk.bbj = b;
    } else {
        pagecloak.style.display = "none";
        panelFadeout(apps.hmtk.main);
    }
    menu_hide();
};