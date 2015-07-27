/**
 * ===BASE===// palette // palettedyeclick.js
 * @param 
 */

function palettedyeclick(event) {
    // clicking palette dye
    palettegrove_paint(event.target.style.backgroundColor);
    palette.output = event.target.style.backgroundColor;
    palette_context_update();
}
