/**
 * ===BASE===// render // menu2ele_click.js
 * @param 
 */

function menu2ele_click(event) {
    menu2_hide();
    menu.relocate.gene.value = event.target.genename;
    menuJump();
}


