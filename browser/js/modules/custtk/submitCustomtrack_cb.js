/**
 * ===BASE===// custtk // submitCustomtrack_cb.js
 * @param __Browser.prototype__
 * @param 
 */

Browser.prototype.submitCustomtrack_cb = function (data, tk, ui) {
    ui.submit_butt.disabled = false;
    this.unveil();
    if (!data || data.brokenbeads) {
        print2console('Something about this track is broken. Please check your input.', 2);
        menu_blank();
        dom_create('div', menu.c32, 'margin:10px;width:200px;').innerHTML = 'Failed to add this track.<br><br>If this is an updated version of a previously used track, you need to refresh cache.';
        var d = dom_create('div', menu.c32, 'margin:20px;');
        this.refreshcache_maketkhandle(d, tk);
        menu_show_beneathdom(0, ui.submit_butt);
        gflag.menu.bbj = apps.custtk.bbj;
        return;
    }
    this.jsonAddtracks(data);
    done();
    flip_panel(this.genome.custtk.buttdiv, this.genome.custtk.ui_submit, false);
    apps.custtk.main.__hbutt2.style.display = 'none';
    for (var tag in this.splinters) {
        this.splinters[tag].ajax_addtracks([tk]);
    }
};

