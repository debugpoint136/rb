/**
 * load datahub from json text file by url <br>
 * __Browser.prototype__ <br>
 * @param url
 * @param callback
 */


Browser.prototype.loadhub_urljson = function (url, callback) {
    /*
     oh, must use trunk please..
     */
    var bbj = this.trunk ? this.trunk : this;
    bbj.shieldOn();
    bbj.cloak();
    bbj.ajaxText('loaddatahub=on&url=' + url, function (text) {
            bbj.loadhub_urljson_cb(text, url, callback);
        }
    );
};