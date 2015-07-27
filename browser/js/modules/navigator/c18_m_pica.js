/**
 * ===BASE===// navigator // c18_m_pica.js
 * @param 
 */

function c18_m_pica(event) {
    var c = event.target;
    var p = absolutePosition(c);
    picasays.innerHTML = c.chrom + ' ' + parseInt(c.bpperpx * (event.clientX + document.body.scrollLeft - p[0]));
    pica_go(event.clientX, p[1] - document.body.scrollTop + c.height - 10);
}

