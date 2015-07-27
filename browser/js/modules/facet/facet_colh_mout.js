/**
 * ===BASE===// facet // facet_colh_mout.js
 * @param 
 */

function facet_colh_mout(event) {
    var td = event.target;
    while (td.tagName != 'TD') {
        td = td.parentNode;
    }
    td.style.backgroundColor = "transparent";
// don't call menu_hide(), can't let cursor move from td to menu
}
