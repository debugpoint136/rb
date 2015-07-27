/**
 * ===BASE===// menu // menu_hammock_setfixscale.js
 * @param 
 */

function menu_hammock_setfixscale(event) {
// press button
    var t = event.target.parentNode;
    var min = parseFloat(t.childNodes[1].value);
    var max = parseFloat(t.childNodes[3].value);
    if (isNaN(min) || isNaN(max) || min >= max) {
        print2console('wrong min/max value', 2);
        return;
    }
    gflag.menu.hammock_focus = {min: min, max: max};
    menu_update_track(28);
}

