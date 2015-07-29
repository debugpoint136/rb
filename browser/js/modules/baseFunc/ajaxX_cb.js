/**
 * ===BASE===// baseFunc // ajaxX_cb .js
 * @param __Browser.prototype__
 * @param 
 */

Browser.prototype.ajaxX_cb = function (data, norendering) {
    delete gflag.bbj_x_updating[this.horcrux];
    this.shieldOff();
    if (!data) {
        print2console('Crashed upon ajaxX', 3);
        return;
    }
    if (data.abort) {
        print2console(data.abort, 3);
    } else {
        if (this.__pending_coord_hl) {
            this.highlight_regions[0] = this.__pending_coord_hl;
            delete this.__pending_coord_hl;
        }
        menu_hide();
        menu2.style.display = 'none';
        if (data.newscaffold) {
            this.ajax_scfdruntimesync();
        }
        this.jsonDsp(data);
        this.jsonTrackdata(data);
        this.move.direction = null;
        if (this.is_gsv() && data.ajaxXtrigger_gsvupdate) {
            /* gsv updating existing list
             always loses original dsp info
             returned regionLst always contains updated itemlist
             */
            if (data.entirelst == undefined || data.entirelst.length == 0) fatalError('gsv update: entirelst missing');
            this.genesetview.lst = data.entirelst;
            this.drawNavigator();
        }
        if (this.onupdatex) {
            this.onupdatex(this);
        }
        if (this.animate_zoom_stat == 1) {
            /* browser shows the animated zoom effect
             now tk data is ready, quit, browser render will be done once animation is over
             */
            this.animate_zoom_stat = 0;
            return;
        }
        if (!norendering) {
            this.drawRuler_browser(false);
            this.drawTrack_browser_all();
            this.drawIdeogram_browser(false);
        }
    }
    this.ajax_loadbbjdata(this.init_bbj_param);
};


