/**
 * ===BASE===// palette // palettehide.js
 * @param 
 */

function palettehide() {
    palette.style.display = "none";
    document.body.removeEventListener("mousedown", palettehide, false);
}
