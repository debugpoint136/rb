/**
 * ===BASE===// ajax // ajaxText.js
 * @param __Browser.prototype__
 * @param 
 */

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

