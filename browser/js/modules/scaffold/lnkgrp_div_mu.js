/**
 * ===BASE===// scaffold // lnkgrp_div_mu.js
 * @param 
 */

function lnkgrp_div_mu(event) {
    document.body.removeEventListener('mousemove', lnkgrp_div_mm, false);
    document.body.removeEventListener('mouseup', lnkgrp_div_mu, false);
    indicator.style.display = 'none';
    var n = gflag.c18;
    var x = parseInt(indicator.style.left) - n.xcurb;
    var w = parseInt(indicator.style.width);
    var bbj = gflag.menu.bbj;
    var i = parseInt(x / bbj.genome.linkagegroup.lg2piecewidth[n.lgname]);
    var j = parseInt((x + w) / bbj.genome.linkagegroup.lg2piecewidth[n.lgname]);
    var lst = bbj.genome.linkagegroup.hash[n.lgname];
    if (i < lst.length && j < lst.length) {
        menu_hide();
        gflag.menu.bbj.cloak();
        gflag.menu.bbj.ajaxX(gflag.menu.bbj.runmode_param() + '&jump=on&jumppos2=' +
        lst[i].n + ',0,' + lst[j].n + ',' +
        gflag.menu.bbj.genome.scaffold.len[lst[j].n]);
    }
}

/*** __scaffold__ ends ***/