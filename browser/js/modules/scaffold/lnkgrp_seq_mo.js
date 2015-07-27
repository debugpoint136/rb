/**
 * ===BASE===// scaffold // lnkgrp_seq_mo.js
 * @param 
 */

function lnkgrp_seq_mo(event) {
// from inside menu, mouse over a seq item
    var bbj = gflag.menu.bbj;
    var dom = event.target;
    if (!dom.className) {
        dom = dom.parentNode;
    }
    var n = dom.n; // this seq name
    picasays.innerHTML = '<b>' + n + '</b> ' + bbj.genome.scaffold.len[n] + ' bp, ' + dom.strand + '<br>Distance: ' + dom.cM + ' cM';
    pica_go(event.clientX, event.clientY);
// highlight this seq on linkage map
    var o = bbj.genome.linkagegroup;
    o.lg2holder[bbj.genome.scaffold.tolnkgrp[n]].appendChild(o.shadow);
    o.shadow.style.left = o.sf * dom.cM - 2;
}

