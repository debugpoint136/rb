/**
 * ===BASE===// palette // stc_mismatchcolor_initiator.js
 * @param 
 */

function stc_mismatchcolor_initiator(event) {
    paletteshow(event.clientX, event.clientY, 5);
    palettegrove_paint(event.target.style.backgroundColor);
}
