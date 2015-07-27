/**
 * @param forwhat
 * @param handler - handler must be a closure function
 * @param mdidxlimit
 */

function mdtermsearch_show(forwhat, handler, mdidxlimit) {
// handler must be a closure function
    menu_shutup();
    menu.c55.style.display = 'block';
    menu.c55.says.innerHTML = forwhat;
    menu.c56.style.display = 'block';
    menu.c56.hit_handler = handler;
    menu.c56.input.focus();
    if (mdidxlimit) {
        menu.c56.mdidxlimit = mdidxlimit;
    } else {
        delete menu.c56.mdidxlimit;
    }
}