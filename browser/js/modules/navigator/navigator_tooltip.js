/**
 * ===BASE===// navigator // navigator_tooltip.js
 * @param 
 */

function navigator_tooltip(event) {
    var bbj = gflag.browser;
    if (bbj.juxtaposition.type == RM_protein) return;
    var pos = absolutePosition(event.target);
    pica_go(event.clientX, pos[1] + event.target.clientHeight - document.body.scrollTop - 13);
    var x = event.clientX + document.body.scrollLeft - pos[0]; // offset on canvas
    var re = bbj.navigatorSeek(x);
    picasays.innerHTML = re[0] + ', ' + re[1];
}

