/**
 * ===BASE===// palette // hengeview_wreathncolor_initiator.js
 * @param 
 */

function hengeview_wreathncolor_initiator(event) {
    paletteshow(event.clientX, event.clientY, 41);
    palettegrove_paint(event.target.style.backgroundColor);
    palette.hook = event.target; // contains track name
}
