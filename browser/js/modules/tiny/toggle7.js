Browser.prototype.toggle7 = function () {
    if (apps.custtk.main.style.display == 'none') {
        for (var n in apps) {
            if (apps[n].main.style.display != 'none') apps[n].main.style.display = 'none';
        }
        if (gflag.askabouttrack) {
            toggle9();
        }
        cloakPage();
        var c = this.genome.custtk;

        // put in custtk submit ui
        stripChild(apps.custtk.main.__contentdiv, 0);
        apps.custtk.main.__contentdiv.appendChild(c.main);
        apps.custtk.main.__hbutt2.style.display = c.buttdiv.style.display == 'block' ? 'none' : 'block';

        panelFadein(apps.custtk.main, 100 + document.body.scrollLeft, 50 + document.body.scrollTop);
        apps.custtk.bbj = this.trunk ? this.trunk : this;
    } else {
        pagecloak.style.display = "none";
        panelFadeout(apps.custtk.main);
    }
    menu_hide();
};