/**
 * __Browser.prototype__ <br>
 * @param text
 * @param url
 */


Browser.prototype.loadmetadata_jsontext = function (text, url) {
    if (!text) {
        print2console('Cannot load metadata file ' + url, 2);
        this.__hubfailedmdvurl[url] = 1;
    } else {
        var j = parse_jsontext(text);
        if (j) {
            if (!j.vocabulary) {
                print2console('vocabulary missing from metadata ' + url, 2);
                this.__hubfailedmdvurl[url] = 1;
            } else {
                j.sourceurl = url;
                load_metadata_json(j);
            }
        } else {
            print2console('Invalid metadata JSON: ' + url, 2);
            this.__hubfailedmdvurl[url] = 1;
        }
    }
    if (this.__pending_hubjson) {
        var ibp = this.__pending_hubjson;
        delete this.__pending_hubjson;
        this.loaddatahub_json(ibp);
    }
};