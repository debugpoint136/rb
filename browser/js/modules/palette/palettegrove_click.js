/**
 * ===BASE===// palette // palettegrove_click.js
 * @param 
 */

function palettegrove_click(event) {
    // clicking on palette grove to pick up a color from the gradient
    var pos = absolutePosition(palette.grove);
    palette.slider.style.left = event.clientX - pos[0];
    var x = parseInt(palette.slider.style.left);
    if (x == 50)
        palette.output = palette.grove.color;
    else if (x < 50)
        palette.output = darkencolor(colorstr2int(palette.grove.color), (100 - x * 2) / 100);
    else
        palette.output = lightencolor(colorstr2int(palette.grove.color), (x - 50) / 50);
    palette_context_update();
}


