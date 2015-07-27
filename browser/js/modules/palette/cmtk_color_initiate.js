/**
 * ===BASE===// palette // cmtk_color_initiate.js
 * @param 
 */

function cmtk_color_initiate(event) {
    paletteshow(event.clientX, event.clientY, 16);
    palettegrove_paint(event.target.style.backgroundColor);
    gflag.menu.cmtk_colorcell = event.target;
}
