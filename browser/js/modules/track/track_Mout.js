/**
 * Created by dpuru on 2/27/15.
 */


/*** __track__ ***/

function track_Mout(event) {
    var bbj = gflag.browser;
    var tk = bbj.findTrack(event.target.tkname, event.target.cotton);
    if (!tk) {
        // this is the case for alethiometer splinter
        return;
    }
    if (!tk.menuselected) {
        tk.header.style.backgroundColor = 'transparent';
    }
    pica_hide();
    glasspane.style.display =
        smear1.style.display = smear2.style.display =
            indicator.style.display = indicator6.style.display = 'none';
}

