/**
 * ===BASE===// scaffold // lnkgrp_seq_click.js
 * @param 
 */

function lnkgrp_seq_click(event) {
    var bbj = gflag.menu.bbj;
    var dom = event.target;
    if (!dom.className) {
        dom = dom.parentNode;
    }
    var n = dom.n;
    bbj.cgiJump2coord(n + ':0-' + bbj.genome.scaffold.len[n]);
    menu_hide();
}

