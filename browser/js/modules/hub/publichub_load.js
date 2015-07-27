/**
 * __Browser.prototype__ <br>
 * @param hubid
 */

Browser.prototype.publichub_load = function (hubid) {
    for (var i = 0; i < this.genome.publichub.lst.length; i++) {
        var h = this.genome.publichub.lst[i];
        if (h.id == hubid) {
            var butt = h.says.firstChild;
            if (butt.tagName == 'BUTTON') butt.disabled = true;
            this.loadhub_urljson(h.url, function () {
                h.says.innerHTML = ' <span class=clb onclick="apps.publichub.bbj.toggle8();apps.publichub.bbj.toggle1()">Loaded &#187;</span>';
            });
            return;
        }
    }
    print2console('Unknown publichub identifier: ' + hubid, 2);
    this.ajax_loadbbjdata(this.init_bbj_param);
};