/**
 * ===BASE===// palette // stc_longrange_autoscale.js
 * @param 
 */

function stc_longrange_autoscale(event) {
// toggling checkbox
    menu.lr.pcscore.parentNode.style.display = menu.lr.ncscore.parentNode.style.display = event.target.checked ? 'none' : 'inline';
    menu.lr.pcscoresays.style.display = menu.lr.ncscoresays.style.display = event.target.checked ? 'inline' : 'none';
    menu_update_track(18);
}

