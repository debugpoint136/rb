/**
 * ===BASE===// render // menu_hammock_choosescore.js
 * @param 
 */

function menu_hammock_choosescore(event) {
    gflag.menu.hammock_focus = {scoreidx: event.target.idx};
    menu_update_track(30);
}


