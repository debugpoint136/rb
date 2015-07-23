/**
 * Created by dpuru on 2/27/15.
 */
/*** __ajax__ ***/



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


function ajaxPost(data2post, callback) {
    var req = new XMLHttpRequest();
    req.onreadystatechange = function () {
        if (req.readyState == 4 && req.status == 200) {
            var t = req.responseText;
            if (t.substr(0, 5) == 'ERROR') {
                print2console('Failed to post data to server', 3);
                callback(null);
            } else {
                callback(t);
            }
        }
    };
    req.open('POST', gflag.cors_host + '/cgi-bin/postdeposit', true);
    req.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    req.send(data2post);
}

Browser.prototype.ajaxText = function (url, callback) {
// don't use with long url
    var req = new XMLHttpRequest();
    req.onreadystatechange = function () {
        if (req.readyState == 4 && req.status == 200) {
            var t = req.responseText;
            if (t.substr(0, 5) == 'ERROR') {
                print2console(t.substr(6), 3);
                callback(null);
            } else {
                callback(t);
            }
        }
    };
    req.open("GET", gflag.cors_host + '/cgi-bin/subtleKnife?' + escape(url), true);
    req.send();
};


/*** __ajax__ ends ***/

