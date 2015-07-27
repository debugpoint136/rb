/**
 * ===BASE===// palette // stc_textcolor_initiator.js
 * @param 
 */

function stc_textcolor_initiator(event) {
    paletteshow(event.clientX, event.clientY, 1);
    palettegrove_paint(event.target.style.backgroundColor);
}
