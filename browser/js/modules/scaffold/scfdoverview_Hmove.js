/**
 * ===BASE===// scaffold // scfdoverview_Hmove.js
 * @param 
 */

function scfdoverview_Hmove(event) {
    var genome = gflag.menu.bbj.genome;
    var pos = absolutePosition(event.target);
    picasays.innerHTML = event.target.chr + ', ' + parseInt((event.clientX + document.body.scrollLeft - pos[0]) * genome.scaffold.overview.sf);
    pica_go(event.clientX - document.body.scrollLeft, pos[1] + event.target.clientHeight - document.body.scrollTop);
}
