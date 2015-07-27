/**
 * ===BASE===// palette // stc_longrange_ncolor_initiator.js
 * @param 
 */

function stc_longrange_ncolor_initiator(event) {
    paletteshow(event.clientX, event.clientY, 8);
//gflag.menu.context==1?8:11);
    palettegrove_paint(event.target.style.backgroundColor);
}
