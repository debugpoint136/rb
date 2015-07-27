/**
 * ===BASE===// palette // stc_reversecolor_initiator.js
 * @param 
 */

function stc_reversecolor_initiator(event) {
    paletteshow(event.clientX, event.clientY, 4);
    palettegrove_paint(event.target.style.backgroundColor);
}
