/**
 * ===BASE===// menu // menu_shutup.js
 * @param 
 */

function menu_shutup() {
    for (var i = 0; i < menu.childNodes.length; i++) {
        var n = menu.childNodes[i];
        if (n.nodeType == 1) n.style.display = 'none';
    }
}

