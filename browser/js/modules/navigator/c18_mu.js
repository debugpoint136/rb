/**
 * ===BASE===// navigator // c18_mu.js
 * @param 
 */

function c18_mu(event) {
    document.body.removeEventListener('mousemove', c18_mm, false);
    document.body.removeEventListener('mouseup', c18_mu, false);
    indicator.style.display = 'none';
    var n = gflag.c18;
    var x = parseInt(indicator.style.left) - n.xcurb;
    var w = parseInt(indicator.style.width);
    var sf = n.canvas.bpperpx;
    var start = parseInt(sf * x);
    var stop = parseInt(sf * (x + w));
    if (n.canvas.context == 1) {
        var bbj = gflag.menu.bbj;
        var coord = menu.c18_canvas.chrom + ':' + start + '-' + stop;
        gflag.menu.bbj.cgiJump2coord(coord);
        if (gflag.syncviewrange) {
            var lst = gflag.syncviewrange.lst;
            for (var i = 0; i < lst.length; i++) {
                lst[i].cgiJump2coord(coord);
            }
        }
    } else if (n.canvas.context == 2) {
        // circlet view
        var blob = n.canvas.hengeviewblob;
        var k = blob.viewkey;
        var vobj = apps.circlet.hash[k];
        var r = vobj.regions[blob.ridx];
        r.dstart = start;
        r.dstop = stop;
        hengeview_computeRegionRadian(k);
        hengeview_ajaxupdatepanel(k);
        vobj.bbj.genome.drawSinglechr_markInterval(n.canvas, r.chrom, r.dstart, r.dstop, 13, 2);
        menu.c1.innerHTML = r.chrom + ':' + r.dstart + '-' + r.dstop;
    }
}

