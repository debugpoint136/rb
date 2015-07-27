/**
 * ===BASE===// cache // refreshcache_maketkhandle.js
 * @param __Browser.prototype__
 * @param 
 */

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

