Browser.prototype.toggle8 = function () {
    if (apps.publichub.main.style.display == "none") {
        if (gflag.askabouttrack) {
            toggle9();
        }
        cloakPage();
        stripChild(apps.publichub.holder, 0);
        apps.publichub.holder.appendChild(this.genome.publichub.holder);
        panelFadein(apps.publichub.main, 100 + document.body.scrollLeft, 50 + document.body.scrollTop);
        apps.publichub.bbj = this;
    } else {
        pagecloak.style.display = "none";
        panelFadeout(apps.publichub.main);
    }
    menu_hide();
};