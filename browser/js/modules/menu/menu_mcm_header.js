/**
 * ===BASE===// menu // menu_mcm_header.js
 * @param 
 */

function menu_mcm_header(event) {
// over a mcm header term
    menu_shutup();
    menu_show(8, event.clientX, event.clientY);
    menu.c4.style.display = menu.c25.style.display = 'block';
    if (menu.c23)
        menu.c23.style.display = 'block';
    gflag.menu.bbj = gflag.browser;
    gflag.menu.idx = parseInt((event.clientX + document.body.scrollLeft - absolutePosition(gflag.browser.mcm.holder)[0]) / tkAttrColumnWidth);
    return false;
}

