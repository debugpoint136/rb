/**
 * ===BASE===// cache // refreshcache_clickhandle.js
 * @param __Browser.prototype__
 * @param 
 */

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
