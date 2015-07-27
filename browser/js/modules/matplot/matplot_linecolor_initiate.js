/**
 * ===BASE===// matplot // matplot_linecolor_initiate.js
 * @param 
 */

function matplot_linecolor_initiate(event) {
    paletteshow(event.clientX, event.clientY, 14);
    palettegrove_paint(event.target.style.backgroundColor);
    gflag.menu.matplottkcell = event.target;
}

