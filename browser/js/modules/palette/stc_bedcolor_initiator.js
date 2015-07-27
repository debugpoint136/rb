/**
 * ===BASE===// palette // stc_bedcolor_initiator.js
 * @param 
 */

function stc_bedcolor_initiator(event) {
    paletteshow(event.clientX, event.clientY, 2);
    palettegrove_paint(event.target.style.backgroundColor);
}
