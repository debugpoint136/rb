/**
 *
 */

Browser.prototype.loaddatahub_pushbutt = function () {
    var ui = this.genome.custtk.ui_hub;
    var url = ui.input_url.value;
    if (url.length == 0 || url == 'Enter URL of hub descriptor file') {
        print2console('URL to hub descriptor file required', 2);
        return;
    }
    ui.submit_butt.disabled = true;
    print2console('Loading data hub...', 0);
    this.cloak();
    var which = ui.select.options[ui.select.selectedIndex].value;
    if (which == 'json') {
        this.loadhub_urljson(url);
    } else {
        this.loaddatahub_ucsc(url);
    }
};