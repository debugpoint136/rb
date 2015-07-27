/**
 * ===BASE===// palette // stc_forwardcolor_initiator.js
 * @param 
 */

function stc_forwardcolor_initiator(event) {
    paletteshow(event.clientX, event.clientY, 3);
    palettegrove_paint(event.target.style.backgroundColor);
}
