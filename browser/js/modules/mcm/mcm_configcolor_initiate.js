/**
 *
 */

function mcm_configcolor_initiate(event) {
    paletteshow(event.clientX, event.clientY, 12);
    palettegrove_paint(event.target.style.backgroundColor);
    menu.colorlonglstcell = event.target;
}