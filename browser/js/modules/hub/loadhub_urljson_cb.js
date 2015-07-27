/**
 * @param text
 * @param url
 * @callback
 */
Browser.prototype.loadhub_urljson_cb = function (text, url, callback) {
    if (this.genome.custtk) {
        this.genome.custtk.ui_hub.submit_butt.disabled = false;
    }
    if (!text) {
        print2console('Cannot load this hub: ' + url, 2);
    } else {
        var j = parse_jsontext(text);
        if (j) {
            this.loaddatahub_json(j, url);
            if (apps.custtk && apps.custtk.main.style.display == 'block') {
                toggle7_2();
            }
            /* this callback is currently only used for public hubs
             */
            if (callback) {
                callback();
            }
            return;
        } else {
            print2console('Invalid JSON from this hub: ' + url, 2);
        }
    }
    this.ajax_loadbbjdata(this.init_bbj_param);
};