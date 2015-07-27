/**
 * Created by dpuru on 2/27/15.
 */
/*** __scalebar__ ***/
function scalebarMout(event) {
// mouse out to hide beam
    var bbj = gflag.browser;
    var ctx = bbj.scalebar.arrow.getContext('2d');
    ctx.strokeStyle = colorCentral.foreground;
    bbj.scalebararrowStroke();
    scalebarbeam.style.display = 'none';
}
