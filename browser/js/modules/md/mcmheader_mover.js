/**
 * mouse over mcm header canvas, must update gflag.browser
 * as this canvas stays outside bbj.main table
 * @param event
 */


function mcmheader_mover(event) {

    var t = event.target;
    while (t.tagName != 'TABLE') t = t.parentNode;
    gflag.browser = horcrux[t.horcrux];
}