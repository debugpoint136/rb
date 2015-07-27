/**
 * ===BASE===// menu // menu_show.js
 * @param 
 */

function menu_show(ctxt, x, y) {
    /* x/y are optional,
     must not contain body.scroll offset
     set to -1 for not changing position
     */
    pica.style.display = 'none';
    menu.style.display = 'block';
    if (x == undefined) {
        x = parseInt(menu.style.left) - 10;
        y = parseInt(menu.style.top) - 10;
    }
    setTimeout('placePanel(menu,' + x + '+10+document.body.scrollLeft,' + y + '+10+document.body.scrollTop);menu.style.maxHeight="' + maxHeight_menu + '";', 1);
    document.body.addEventListener('mousedown', menu_hide, false);
    gflag.menu.bbj = gflag.browser;
    gflag.menu.context = ctxt;
}
