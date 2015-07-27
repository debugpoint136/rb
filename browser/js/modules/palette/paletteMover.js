/**
 * Created by dpuru on 2/27/15.
 */
/*** __palette__ ***
 a pair of two functions,
 - xx_initiator()
 toggles on palette, register xx() for click event
 - xx()
 capture color and do stuff, hide palette, remove event registry
 */
function paletteMover() {
    document.body.removeEventListener('mousedown', palettehide, false);
    document.body.removeEventListener('mousedown', menu_hide, false);
}
