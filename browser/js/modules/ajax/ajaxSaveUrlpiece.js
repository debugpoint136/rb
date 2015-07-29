/*** __ajax__ ***/

/**
 * ===BASE===// ajax // ajaxSaveUrlpiece.js
 * @param __Browser.prototype__
 * @param callback
 */

Browser.prototype.ajaxSaveUrlpiece = function (callback) {
    var url = this.cached_url;
    if (this.urloffset >= url.length) {
        // entire URL has been saved, run it with callback
        this.ajax('reviveURL=on&dbName=' + this.genome.name, callback);
        return;
    }
    var req = new XMLHttpRequest();
    var bbj = this;
    req.onreadystatechange = function () {
        if (req.readyState == 4 && req.status == 200) {
            var t = req.responseText;
            try {
                eval('(' + t + ')');
            }
            catch (err) {
                gflag.badjson.push(t);
                fatalError('wrong JSON during caching URL');
            }
            bbj.urloffset += urllenlimit;
            bbj.ajaxSaveUrlpiece(callback);
        }
    };
    req.open("POST", gflag.cors_host + "/cgi-bin/subtleKnife?NODECODE=on&offset=" + this.urloffset + "&saveURLpiece=" + escape(url.substr(this.urloffset, urllenlimit)) + "&session=" + this.sessionId + "&dbName=" + this.genome.name, true);
    req.send();
};
