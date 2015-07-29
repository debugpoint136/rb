/**
 * ===BASE===// ajax // ajaxPost.js
 * @param 
 */

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

