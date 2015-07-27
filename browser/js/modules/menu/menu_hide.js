/**
 * ===BASE===// menu // menu_hide.js
 * @param 
 */

function menu_hide() {
    indicator3.style.display =
        indicator7.style.display =
            indicator6.style.display =
                invisibleBlanket.style.display =
                    menu.style.display = 'none';
    menu.style.maxHeight = 1;
    document.body.removeEventListener('mousedown', menu_hide, false);
    gflag.menu.context = null;
}

