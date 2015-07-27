/**
 * ===BASE===// palette // stc_longrange_pcolor_initiator.js
 * @param 
 */

function stc_longrange_pcolor_initiator(event) {
    paletteshow(event.clientX, event.clientY, 6);
//gflag.menu.context==1?6:10);
    palettegrove_paint(event.target.style.backgroundColor);
}
