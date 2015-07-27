/**
 * ===BASE===// menu // menu_hammock_changescale.js
 * @param 
 */

function menu_hammock_changescale(event) {
// from <select>
    var s = event.target;
    var scale = parseInt(s.options[s.selectedIndex].value);
    gflag.menu.hammock_focus = {type: scale};
    s.nextSibling.style.display = scale == scale_fix ? 'block' : 'none';
    if (scale == scale_fix) return;
    menu_update_track(29);
}

