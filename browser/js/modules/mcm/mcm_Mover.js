/**
 * @param event
 */

function mcm_Mover(event) {
    var bbj = gflag.browser;
    var tk = bbj.findTrack(event.target.tkname, event.target.cotton);
    tk.header.style.backgroundColor = colorCentral.tkentryfill;
}