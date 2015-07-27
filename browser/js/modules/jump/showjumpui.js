/**
 * ===BASE===// jump // showjumpui.js
 * @param __Browser.prototype__
 * @param 
 */

Browser.prototype.showjumpui = function (param) {
    if (param.d) {
        menu_show_beneathdom(11, param.d);
    } else {
        menu_show(11, param.x, param.y);
    }
    gflag.menu.bbj = this;
    menu_shutup();
    menu.relocate.style.display = 'block';
    menu.relocate.jumplstholder.style.display = 'none';
    menu.relocate.snptr.style.display = this.genome.snptable ? 'table-row' : 'none';
    if (param.showchr) {
        menu.c18.style.display = 'none';
        if (!this.is_gsv()) {
            var t = this.getDspStat();
            if (t[0] == t[2]) {
                menu.c18.style.display = 'block';
                var c = menu.c18_canvas;
                c.context = 1;
                var chrom = this.regionLst[0][0];
                this.genome.drawSinglechr_markInterval(c, chrom, this.dspBoundary.vstartc, this.dspBoundary.vstopc, 13, 2);
                c.chrom = chrom;
                c.chromlen = this.genome.scaffold.len[chrom];
                c.bpperpx = c.chromlen / c.width;
                var ctx = c.getContext('2d');
                ctx.fillStyle = colorCentral.foreground_faint_5;
                drawRuler_basepair(ctx, c.chromlen, c.width, 0, 22);
            }
        }
    }
    menu.relocate.div1.style.display = 'block';
    menu.relocate.div2.style.display = 'none';
    menu.relocate.div3.style.display = 'none';
// decide whether to show scfd-related options
    if (this.genome.linkagegroup) {
        menu.c24.style.display = 'none';
        menu.c43.style.display = 'block';
    } else {
        menu.c43.style.display = 'none';
        menu.c24.style.display = this.genome.scaffold.current.length > max_viewable_chrcount ? 'none' : 'block';
    }
};


