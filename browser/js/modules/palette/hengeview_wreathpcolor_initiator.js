/**
 * ===BASE===// palette // hengeview_wreathpcolor_initiator.js
 * @param 
 */

function hengeview_wreathpcolor_initiator(event) {
    paletteshow(event.clientX, event.clientY, 40);
    palettegrove_paint(event.target.style.backgroundColor);
    palette.hook = event.target; // contains track name
}
