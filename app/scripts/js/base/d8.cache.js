/**
 * Created by dpuru on 2/27/15.
 */
/* __cache__ */

function menu_refreshcache() {
    menu_blank();
    dom_create('div', menu.c32, 'margin:10px;width:200px;font-size:70%;opacity:.7;').innerHTML = 'Refreshing cache is necessary when you have updated the file(s) of this track.';
    gflag.menu.bbj.refreshcache_maketkhandle(dom_create('div', menu.c32, 'margin:20px;'), gflag.menu.tklst[0]);
}

Browser.prototype.refreshcache_maketkhandle = function (holder, tk) {
    var bbj = this;
    if (tk.ft == FT_cm_c) {
        var d = dom_create('div', holder, 'line-height:1.5;');
        dom_addtext(d, 'Click member track to refresh cache:');
        for (var n in tk.cm.set) {
            var t = tk.cm.set[n];
            var s = dom_create('div', d, 'color:blue;text-decoration:underline;cursor:default;');
            s.innerHTML = (n == 'cg_f' ? 'Forward CG' :
                n == 'cg_r' ? 'Reverse CG' :
                    n == 'chg_f' ? 'Forward CHG' :
                        n == 'chg_r' ? 'Reverse CHG' :
                            n == 'chh_f' ? 'Forward CHH' :
                                n == 'chh_r' ? 'Reverse CHH' :
                                    n == 'rd_f' ? 'Forward read depth' :
                                        n == 'rd_r' ? 'Reverse read depth' : 'No!') +
            ' &#187;';
            s.onclick = this.refreshcache_clickhandle_closure(t, s);
        }
        return;
    }
    if (tk.ft == FT_matplot) {
        var d = dom_create('div', holder, 'line-height:1.5;');
        dom_addtext(d, 'Click member track to refresh cache:');
        for (var i = 0; i < tk.tracks.length; i++) {
            var t = tk.tracks[i];
            if (isCustom(t.ft)) {
                var s = dom_create('div', d, 'color:blue;text-decoration:underline;cursor:default;');
                s.innerHTML = t.label + ' &#187;';
                s.onclick = this.refreshcache_clickhandle_closure(t, s);
            }
        }
        return;
    }
    if (!tk.url) {
        dom_addtext(holder, 'No URL found for this track, cannot refresh cache.');
        return;
    }
    var s = dom_create('div', holder, 'color:blue;text-decoration:underline;cursor:default;');
    s.innerHTML = 'Refresh cache &#187;';
    s.onclick = function () {
        bbj.refreshcache_clickhandle(tk, s);
    };
};

Browser.prototype.refreshcache_clickhandle_closure = function (tk, s) {
    var bbj = this;
    return function () {
        bbj.refreshcache_clickhandle(tk, s);
    };
};

Browser.prototype.refreshcache_clickhandle = function (tk, handle, callback) {
    handle.innerHTML = 'Please wait...';
    var files, dirs;
    switch (tk.ft) {
        case FT_bigwighmtk_c:
            // bigwig is in /tmp/udcCache, damned if it's not
            files = ['/tmp/udcCache/' + tk.url.replace('://', '/') + '/bitmap',
                '/tmp/udcCache/' + tk.url.replace('://', '/') + '/sparseData'];
            dirs = ['/tmp/udcCache/' + tk.url.replace('://', '/')];
            break;
        case FT_bam_c:
            var l2 = tk.url.split('/');
            files = [gflag.trashDir + '/' + tk.url.replace('://', ':/') + '/' + l2[l2.length - 1] + '.bai'];
            dirs = [gflag.trashDir + '/' + tk.url.replace('://', ':/')];
        default:
            // tabix
            var tmp = tk.url.split('/');
            var fn = tmp[tmp.length - 1];
            files = [gflag.trashDir + '/' + tk.url.replace('://', ':/') + '/' + fn + '.tbi'];
    }
    var bbj = this;
    var r = this.regionLst[0];
    this.ajax('refreshcusttkcache=on&url=' + tk.url + '&ft=' + tk.ft +
    (files ? '&filelst=' + files.join(',') : '') +
    (dirs ? '&dirlst=' + dirs.join(',') : '') +
    '&chrom=' + r[0] + '&start=' + r[3], function (data) {
        bbj.refreshcache_done(data, tk, handle, callback);
    });
};
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