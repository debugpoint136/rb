/**
 * @param event
 */

function mcm_Mout(event) {
    var bbj = gflag.browser;
    var tk = bbj.findTrack(event.target.tkname, event.target.cotton);
    tk.header.style.backgroundColor = 'transparent';
    pica.style.display = 'none';
}