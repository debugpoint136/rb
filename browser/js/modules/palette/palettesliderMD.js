/**
 * ===BASE===// palette // palettesliderMD.js
 * @param 
 */

function palettesliderMD(event) {
    // palette slider md
    event.preventDefault();
    palette.slider.x = event.clientX;
    document.body.addEventListener("mousemove", palettesliderM, false);
    document.body.addEventListener("mouseup", palettesliderMU, false);
}
