/**
 * ===BASE===// palette // palettesliderMU.js
 * @param 
 */

function palettesliderMU() {
    document.body.removeEventListener("mousemove", palettesliderM, false);
    document.body.removeEventListener("mouseup", palettesliderMU, false);
    var x = parseInt(palette.slider.style.left);
    if (x == 50)
        palette.output = palette.grove.color;
    else if (x < 50)
        palette.output = darkencolor(colorstr2int(palette.grove.color), (100 - x * 2) / 100);
    else
        palette.output = lightencolor(colorstr2int(palette.grove.color), (x - 50) / 50);
    palette_context_update();
}
