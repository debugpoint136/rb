/**
 * Created by dpuru on 2/27/15.
 */

/*** __tks__ track select panel ***/

Browser.prototype.decor_invoketksp = function () {
    /* called by clicking grandadd > add decor option, to add decor into main panel
     the menu must have already been shown
     */
    var d = this.genome.decorInfo;
    for (var n in d) {
        if (d[n].tksentry) {
            d[n].tksentry.className = 'tkentry';
        }
    }
// disable decors already in collection
    for (var i = 0; i < this.tklst.length; i++) {
        var tk = this.tklst[i];
        if (tk.name in d) {
            if (tk.cotton) {
                if (tk.cotton != this.genome.name) continue;
            }
            // custom tk do not have tksentry
            var ent = d[tk.name].tksentry;
            if (ent) ent.className = 'tkentry_inactive';
        }
    }
    menu_shutup();
    menu.decorcatalog.style.display = 'block';
    stripChild(menu.decorcatalog, 0);
    menu.decorcatalog.appendChild(this.genome.tablist_decor);
    gflag.menu.context = 12;
    if (this.weaver && this.weaver.iscotton) {
        stripChild(menu.c32, 0);
        menu.c32.style.display = 'block';
        dom_create('div', menu.c32, 'background-color:#858585;color:white;text-align:center;').innerHTML = 'tracks from ' + this.genome.name;
    }
};


