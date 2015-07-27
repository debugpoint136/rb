/**
 * ===BASE===// wvfind // toggle31.js
 * @param __Browser.prototype__
 * @param 
 */

Browser.prototype.toggle31 = function () {
    apps.wvfind.shortcut.style.display = 'inline-block';
    if (apps.wvfind.main.style.display == 'none') {
        if (!this.weaver) {
            print2console('Cannot invoke app, not in genome-alignment mode.', 2);
            return;
        }
        if (!this.weaver.q) fatalError('target.weaver.q missing');
        var lst = [];
        for (var n in this.weaver.q) {
            lst.push(n);
        }
        cloakPage();
        apps.wvfind.target = [this.genome.name, weavertkcolor_target];
        apps.wvfind.gsbutt.innerHTML = 'Choose ' + this.genome.name + ' gene set';
        apps.wvfind.querynames.innerHTML = lst.join(' and ') + '&nbsp;';
        panelFadein(apps.wvfind.main, 100 + document.body.scrollLeft, 50 + document.body.scrollTop);
        apps.wvfind.bbj = this;
    } else {
        pagecloak.style.display = "none";
        panelFadeout(apps.wvfind.main);
    }
    menu_hide();
};

