/**
 * ===BASE===// ajax // ajax.js
 * @param __Browser.prototype__
 * @param 
 */

Browser.prototype.ajax = function (queryUrl, callback) {
    /* in case of too long url, need to send it in small pieces one at a time
     to get rid of "Request Entity Too Large" error on server

     in case of saving status, don't run ajaxSaveUrlpiece(),
     as the already-escaped url will be escaped again,
     and there's no good way to unescape on server-side

     won't process abort directive from returned json packet

     tell from the head of queryUrl if it is saving status
     */
    if (queryUrl.length > urllenlimit) {
        this.urloffset = 0;
        this.cached_url = queryUrl;
        this.ajaxSaveUrlpiece(callback);
        return;
    }
    var req = new XMLHttpRequest();

    req.onreadystatechange = function () {
        if (req.readyState == 4 && req.status == 200) {
            var t = req.responseText;
            try {
                var data = eval('(' + t + ')'); //dli
            } catch (err) {
                // unrecoverable??
                gflag.badjson.push(t);
                print2console('Json syntax error...', 3);
                callback(null);
                return;
            }
            callback(data);
        }
    };
    req.open("GET", gflag.cors_host + '/cgi-bin/subtleKnife?' + escape(queryUrl) + '&session=' + this.sessionId + '&statusId=' + this.statusId + '&hmspan=' + this.hmSpan +
    (this.ajax_phrase ? this.ajax_phrase : ''), true);
    req.send();
};


