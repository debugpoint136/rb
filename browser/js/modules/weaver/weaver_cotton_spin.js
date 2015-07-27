/**
 * ===BASE===// weaver // weaver_cotton_spin.js
 * @param __Browser.prototype__
 * @param 
 */

Browser.prototype.weaver_cotton_spin = function (bbj) {
// arg is cottonbbj
    if (bbj.tklst.length == 0 && !bbj.init_bbj_param) return;

    if (bbj.regionLst.length == 0) {
        // clear data for cotton tracks?
        for (var j = 0; j < bbj.tklst.length; j++) {
            bbj.tklst[j].data = [];
        }
        bbj.drawTrack_browser_all();
        return;
    }
    bbj.weaver_cotton_dspboundary();

    this.cloak();
    if (bbj.init_bbj_param) {
        // loading cotton tracks for first time
        bbj.ajax_loadbbjdata(bbj.init_bbj_param);
    } else {
        var param = [], a, b;
        for (var j = 0; j < bbj.regionLst.length; j++) {
            var r = bbj.regionLst[j];
            param.push(r[0] + ',' + r[3] + ',' + r[4] + ',' +
            (this.entire.atbplevel ? (r[4] - r[3]) : r[5]));
            if (j == 0) a = r[3];
            if (j == bbj.regionLst.length - 1) b = r[4];
        }
        for (var i = 0; i < bbj.tklst.length; i++) {
            var tc = bbj.tklst[i].canvas;
            var ctx = tc.getContext('2d');
            ctx.font = '8pt Sans-serif';
            var y = tc.height / 2;
            var t = 'Loading data...';
            var w = ctx.measureText(t).width;
            var h = 14;
            var x = this.hmSpan / 2 - this.move.styleLeft - w / 2 - 20;
            ctx.fillStyle = colorCentral.background;
            ctx.fillRect(x, y - h / 2, w + 40, h);
            ctx.strokeStyle = colorCentral.foreground;
            ctx.strokeRect(x, y - h / 2, w + 40, h);
            ctx.fillStyle = colorCentral.foreground;
            ctx.fillText(t, x + 20, y + 4);
        }
        bbj.ajaxX('&runmode=' + RM_genome +
        '&regionLst=' + param.join(',') +
        '&startCoord=' + a + '&stopCoord=' + b);
    }
};


