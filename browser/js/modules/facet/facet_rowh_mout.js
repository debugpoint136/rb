/**
 * ===BASE===// facet // facet_rowh_mout.js
 * @param 
 */

function facet_rowh_mout(event) {
    var td = event.target;
    while (td.tagName != 'TD') {
        td = td.parentNode;
    }
    td.style.backgroundColor = "transparent";
}
