/**
 * ===BASE===// cate // custcate_color_initiate.js
 * @param 
 */

function custcate_color_initiate(event) {
    /* invoking color palette for cust cate in submit ui
     */
    paletteshow(event.clientX, event.clientY, 39);
    palettegrove_paint(event.target.style.backgroundColor);
    gflag.menu.catetk.item = event.target;
}
