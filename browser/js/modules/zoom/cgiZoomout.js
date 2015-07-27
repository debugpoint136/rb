/**
 * ===BASE===// zoom // cgiZoomout.js
 * @param __Browser.prototype__
 * @param 
 */

Browser.prototype.cgiZoomout = function (howmuch, enforce) {
    /* called by "zoom out" button, so if already meets borders, disable zoom out button
     argument: 0.5 for zoom out by 1.5 fold
     */
    /* this is not in use as the flanking can hit border..
     if(this.atLeftBorder() && this.atRightBorder()) {
     print2console('Cannot zoom out: showing entire range',2);
     return;
     }
     */
// a step of alert as required by our dear reviewer
    if (!enforce) {
        var tcount = 0;
        for (var i = 0; i < this.tklst.length; i++) {
            var tk = this.tklst[i];
            if (tk.ft != FT_matplot && tk.ft != FT_cm_c && tk.ft != FT_matplot && !tkishidden(tk) && !isNumerical(tk) && tk.ft != FT_cat_n && tk.ft != FT_cat_c) {
                for (var j = 0; j < tk.data.length; j++)
                    tcount += tk.data[j].length;
            }
        }
        if (tcount * (howmuch + 1) > trackitemnumAlert * 2) {
            gflag.zoomout.fold = howmuch;
            menu_shutup();
            menu.zoomoutalert.style.display = 'block';
            menu.zoomoutalert.count.innerHTML = tcount;
            menu.zoomoutalert.fold.innerHTML = howmuch;
            menu_show_beneathdom(0, this.clicked_zoomoutbutt);
            return;
        }
    }
    howmuch = parseFloat(howmuch);

    this.weavertoggle(this.hmSpan * this.entire.summarySize * (1 + howmuch));
    this.shieldOn();
    this.animate_zoom_stat = 1;
    var w = this.hmSpan / (1 + howmuch);
    gflag.animate_zoom[this.horcrux] = {
        x1: (this.hmSpan - w) / 2,
        x2: (this.hmSpan + w) / 2,
        zoomin: false,
    };
    start_animate_zoom(this.horcrux);
    var param = this.displayedRegionParam() + "&zoom=" + (howmuch / 2);
    this.ajaxX(param);
// for golden
    if (gflag.syncviewrange) {
        var lst = gflag.syncviewrange.lst;
        for (var i = 0; i < lst.length; i++) {
            var b = lst[i];
            b.animate_zoom_stat = 1;
            var w = b.hmSpan / (1 + howmuch);
            gflag.animate_zoom[b.horcrux] = {
                x1: (b.hmSpan - w) / 2,
                x2: (b.hmSpan + w) / 2,
                zoomin: false,
            };
            start_animate_zoom(b.horcrux);
            b.ajaxX(param);
        }
    }
};

