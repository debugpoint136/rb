/**
 * ===BASE===// cache // refreshcache_done.js
 * @param __Browser.prototype__
 * @param 
 */

Browser.prototype.refreshcache_done = function (data, tk, handle, callback) {
    if (!data || data.error) {
        handle.innerHTML = '<div style="white-space:nowrap;font-size:70%;margin:10px;">CANNOT refresh cache for this track (broken URL?)<br>Data type: ' + FT2verbal[tk.ft] + '<br>URL: <a href=' + tk.url + ' target=_blank>' + tk.url + '</a></div>';
        return;
    }
    handle.innerHTML = '<span class=g>&#10004; Done!</span>';
    if (callback) {
        callback();
    } else {
        this.ajax_addtracks([tk]);
    }
};


/* __cache__ */