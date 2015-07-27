/**
 * currently internal, not called from user action on ui
 * @param url
 */

Browser.prototype.load_metadata_url = function (url) {
    var bbj = this;
    this.ajaxText('loaddatahub=on&url=' + url, function (text) {
        bbj.loadmetadata_jsontext(text, url);


    });
};