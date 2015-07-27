/**
 * ===BASE===// cate // cateTkitemcolor_initiate.js
 * @param 
 */

function cateTkitemcolor_initiate(event) {
    /* invoking color palette for categorical track from the configuration menu
     track is identified by gflag.menu
     */
    paletteshow(event.clientX, event.clientY, 42);
    palettegrove_paint(event.target.style.backgroundColor);
    gflag.menu.catetk.itemidx = parseInt(event.target.getAttribute('itemidx'));
    gflag.menu.catetk.item = event.target;
}
